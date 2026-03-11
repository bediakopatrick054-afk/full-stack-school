import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      ministry: true,
      cellGroup: true,
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  const services = await prisma.service.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  const prayerRequests = await prisma.prayerRequest.findMany({
    where: {
      createdAt: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
      isPublic: true,
    },
  });

  // Combine and sort all events
  const allEvents = [
    ...services.map(service => ({
      id: `service-${service.id}`,
      title: service.name,
      description: `Service at ${service.location}`,
      time: service.startTime,
      type: 'service',
      location: service.location,
    })),
    ...events.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      description: event.description,
      time: event.startDate,
      type: event.eventType,
      ministry: event.ministry?.name,
      cellGroup: event.cellGroup?.name,
      location: event.location,
    })),
    ...prayerRequests.map(prayer => ({
      id: `prayer-${prayer.id}`,
      title: `🙏 ${prayer.title}`,
      description: prayer.description,
      time: prayer.createdAt,
      type: 'prayer',
    })),
  ].sort((a, b) => a.time.getTime() - b.time.getTime());

  if (allEvents.length === 0) {
    return (
      <div className="p-5 text-center text-gray-400">
        No events scheduled for this day
      </div>
    );
  }

  const getEventStyle = (type: string) => {
    switch(type) {
      case 'SUNDAY_SERVICE':
      case 'service':
        return 'border-t-purple-400 bg-purple-50';
      case 'BIBLE_STUDY':
        return 'border-t-blue-400 bg-blue-50';
      case 'PRAYER_MEETING':
        return 'border-t-green-400 bg-green-50';
      case 'CELL_MEETING':
        return 'border-t-yellow-400 bg-yellow-50';
      case 'CONFERENCE':
        return 'border-t-red-400 bg-red-50';
      case 'OUTREACH':
        return 'border-t-orange-400 bg-orange-50';
      case 'WEDDING':
        return 'border-t-pink-400 bg-pink-50';
      case 'BAPTISM':
        return 'border-t-indigo-400 bg-indigo-50';
      case 'prayer':
        return 'border-t-teal-400 bg-teal-50';
      default:
        return 'border-t-gray-400 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-UK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return allEvents.map((event) => (
    <div
      className={`p-4 rounded-md border-l-4 ${getEventStyle(event.type)}`}
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-700">{event.title}</h1>
        <span className="text-gray-500 text-xs bg-white px-2 py-1 rounded">
          {formatTime(event.time)}
        </span>
      </div>
      <p className="mt-1 text-gray-600 text-sm">{event.description}</p>
      
      {/* Additional details */}
      {(event.location || event.ministry || event.cellGroup) && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
          {event.location && (
            <span className="flex items-center gap-1">
              📍 {event.location}
            </span>
          )}
          {event.ministry && (
            <span className="flex items-center gap-1">
              🙏 {event.ministry}
            </span>
          )}
          {event.cellGroup && (
            <span className="flex items-center gap-1">
              👥 {event.cellGroup}
            </span>
          )}
        </div>
      )}
    </div>
  ));
};

export default EventList;
