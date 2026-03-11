import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "pastorId" | "cellGroupId" | "ministryId" | "memberId";
  id: string | number;
}) => {
  let events = [];

  // Fetch different types of church events based on the type parameter
  switch (type) {
    case "pastorId":
      // Get services/events led by a specific pastor
      const pastorLessons = await prisma.service.findMany({
        where: {
          OR: [
            { pastorId: id as string },
            { 
              events: {
                some: {
                  organizerId: id as string
                }
              }
            }
          ]
        },
        include: {
          events: {
            where: {
              organizerId: id as string
            }
          }
        }
      });

      // Get cell groups led by pastor
      const pastorCellGroups = await prisma.cellGroup.findMany({
        where: {
          leaderId: id as string
        },
        include: {
          events: true
        }
      });

      // Get ministries led by pastor
      const pastorMinistries = await prisma.ministry.findMany({
        where: {
          leaderId: id as string
        },
        include: {
          events: true
        }
      });

      // Combine all events
      events = [
        ...pastorLessons.flatMap(service => ({
          title: service.name,
          start: service.startTime,
          end: service.endTime,
          type: "SUNDAY_SERVICE",
          location: service.location,
          leader: `Pastor ${id}`
        })),
        ...pastorCellGroups.flatMap(group => 
          group.events?.map(event => ({
            title: event.title,
            start: event.startDate,
            end: event.endDate,
            type: event.eventType,
            location: event.location,
            cellGroup: group.name
          })) || []
        ),
        ...pastorMinistries.flatMap(ministry => 
          ministry.events?.map(event => ({
            title: event.title,
            start: event.startDate,
            end: event.endDate,
            type: event.eventType,
            location: event.location,
            ministry: ministry.name
          })) || []
        )
      ];
      break;

    case "cellGroupId":
      // Get events for a specific cell group
      const cellGroupEvents = await prisma.event.findMany({
        where: {
          cellGroupId: parseInt(id as string)
        },
        include: {
          cellGroup: true,
          organizer: true
        }
      });

      // Get cell group meetings
      const cellGroup = await prisma.cellGroup.findUnique({
        where: {
          id: parseInt(id as string)
        }
      });

      events = [
        ...(cellGroup ? [{
          title: `${cellGroup.name} Weekly Meeting`,
          start: cellGroup.meetingTime || new Date(),
          end: cellGroup.meetingTime ? new Date(new Date(cellGroup.meetingTime).getTime() + 2 * 60 * 60 * 1000) : new Date(),
          type: "CELL_MEETING",
          location: cellGroup.location,
          cellGroup: cellGroup.name
        }] : []),
        ...cellGroupEvents.map(event => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          type: event.eventType,
          location: event.location,
          organizer: event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : undefined
        }))
      ];
      break;

    case "ministryId":
      // Get events for a specific ministry
      const ministryEvents = await prisma.event.findMany({
        where: {
          ministryId: parseInt(id as string)
        },
        include: {
          ministry: true,
          organizer: true
        }
      });

      // Get ministry services
      const ministryServices = await prisma.service.findMany({
        where: {
          ministryId: parseInt(id as string)
        }
      });

      events = [
        ...ministryServices.map(service => ({
          title: service.name,
          start: service.startTime,
          end: service.endTime,
          type: "MINISTRY_SERVICE",
          location: service.location,
          ministry: (ministryEvents[0]?.ministry?.name) || "Ministry"
        })),
        ...ministryEvents.map(event => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          type: event.eventType,
          location: event.location,
          organizer: event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : undefined
        }))
      ];
      break;

    case "memberId":
      // Get events a specific member is involved in or attending
      const memberEvents = await prisma.event.findMany({
        where: {
          OR: [
            { organizerId: id as string },
            { 
              attendance: {
                some: {
                  memberId: id as string
                }
              }
            }
          ]
        },
        include: {
          organizer: true,
          ministry: true,
          cellGroup: true
        }
      });

      // Get prayer requests by member
      const memberPrayers = await prisma.prayerRequest.findMany({
        where: {
          memberId: id as string,
          isPublic: true
        }
      });

      events = [
        ...memberEvents.map(event => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          type: event.eventType,
          location: event.location,
          organizer: event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : undefined,
          ministry: event.ministry?.name,
          cellGroup: event.cellGroup?.name
        })),
        ...memberPrayers.map(prayer => ({
          title: `🙏 ${prayer.title}`,
          start: prayer.createdAt,
          end: prayer.createdAt,
          type: "PRAYER_REQUEST",
          description: prayer.description
        }))
      ];
      break;

    default:
      // For admin dashboard - get all upcoming church events
      const allEvents = await prisma.event.findMany({
        where: {
          startDate: {
            gte: new Date()
          }
        },
        include: {
          organizer: true,
          ministry: true,
          cellGroup: true
        },
        orderBy: {
          startDate: 'asc'
        },
        take: 50
      });

      const allServices = await prisma.service.findMany({
        include: {
          pastor: true
        }
      });

      events = [
        ...allServices.map(service => ({
          title: service.name,
          start: service.startTime,
          end: service.endTime,
          type: "SUNDAY_SERVICE",
          location: service.location,
          leader: service.pastor ? `${service.pastor.name} ${service.pastor.surname}` : undefined
        })),
        ...allEvents.map(event => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          type: event.eventType,
          location: event.location,
          organizer: event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : undefined,
          ministry: event.ministry?.name,
          cellGroup: event.cellGroup?.name
        }))
      ];
  }

  // Adjust all events to the current week for consistent display
  const schedule = adjustScheduleToCurrentWeek(events);

  return (
    <div className="h-full">
      <BigCalendar 
        data={schedule}
        eventType={type}
      />
    </div>
  );
};

// Helper function to get event counts for dashboard
export const getEventCounts = async () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const [
    totalEvents,
    weekEvents,
    servicesToday,
    upcomingPrayerMeetings
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({
      where: {
        startDate: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    }),
    prisma.service.count({
      where: {
        startTime: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999))
        }
      }
    }),
    prisma.event.count({
      where: {
        eventType: "PRAYER_MEETING",
        startDate: {
          gte: new Date()
        }
      }
    })
  ]);

  return {
    totalEvents,
    weekEvents,
    servicesToday,
    upcomingPrayerMeetings
  };
};

export default BigCalendarContainer;
