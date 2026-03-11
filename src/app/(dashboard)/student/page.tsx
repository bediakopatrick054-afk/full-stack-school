import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import MemberAttendanceCard from "@/components/MemberAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

const MemberPage = async () => {
  const { userId } = auth();

  // Get member details
  const member = await prisma.member.findUnique({
    where: { id: userId! },
    include: {
      family: true,
      cellGroup: true,
      department: true,
    },
  });

  // Get member's cell group if assigned
  const cellGroup = member?.cellGroupId 
    ? await prisma.cellGroup.findUnique({
        where: { id: member.cellGroupId },
        include: {
          leader: true,
        },
      })
    : null;

  // Get upcoming events for member's cell group/ministry
  const upcomingEvents = await prisma.event.findMany({
    where: {
      OR: [
        { cellGroupId: member?.cellGroupId },
        { ministryId: member?.departmentId },
        { eventType: "SUNDAY_SERVICE" },
      ],
      startDate: {
        gte: new Date(),
      },
    },
    take: 3,
    orderBy: {
      startDate: 'asc',
    },
  });

  // Get prayer requests from member's cell group
  const prayerRequests = await prisma.prayerRequest.findMany({
    where: {
      OR: [
        { memberId: userId },
        { 
          isPublic: true,
          member: {
            cellGroupId: member?.cellGroupId
          }
        }
      ],
      status: "PENDING",
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const memberName = member?.firstName || "Beloved";
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isSunday = dayOfWeek === 0;

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT - Main Content */}
      <div className="w-full xl:w-2/3">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg mb-4">
          <h1 className="text-2xl font-bold">Welcome, {memberName}! 🙏</h1>
          <p className="text-green-100 mt-2">
            {isSunday 
              ? "Today is Sunday Service. We look forward to worshipping with you!" 
              : "Here's what's happening in your church community."}
          </p>
          
          {/* Member Info Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {member?.cellGroup && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                Cell Group: {member.cellGroup.name}
              </span>
            )}
            {member?.department && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                Ministry: {member.department.name}
              </span>
            )}
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
              Member since {new Date(member?.joinDate || "").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="h-full bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-700">
              {cellGroup ? `${cellGroup.name} Schedule` : "Church Schedule"}
            </h1>
            <Link href="/list/services" className="text-sm text-green-600 hover:underline">
              View All Services
            </Link>
          </div>
          {cellGroup ? (
            <BigCalendarContainer type="cellGroupId" id={cellGroup.id} />
          ) : (
            <BigCalendarContainer type="memberId" id={userId!} />
          )}
        </div>
      </div>

      {/* RIGHT - Sidebar */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* Personal Stats */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">MY SPIRITUAL WALK</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {await prisma.attendance.count({
                  where: {
                    memberId: userId,
                    status: "PRESENT",
                    date: {
                      gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    },
                  },
                })}
              </p>
              <p className="text-xs text-gray-500">Services (30d)</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {await prisma.prayerRequest.count({
                  where: { memberId: userId },
                })}
              </p>
              <p className="text-xs text-gray-500">Prayers</p>
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">MY ATTENDANCE</h2>
          <MemberAttendanceCard id={userId!} />
        </div>

        {/* Cell Group Info */}
        {cellGroup && (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">MY CELL GROUP</h2>
            <div className="space-y-2">
              <p className="text-sm font-medium">{cellGroup.name}</p>
              {cellGroup.leader && (
                <p className="text-xs text-gray-600">Leader: {cellGroup.leader.name}</p>
              )}
              <p className="text-xs text-gray-500">📍 {cellGroup.location || "Location TBD"}</p>
              {cellGroup.meetingDay && (
                <p className="text-xs text-gray-500">
                  📅 Meets {cellGroup.meetingDay}s at {cellGroup.meetingTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">UPCOMING EVENTS</h2>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No upcoming events</p>
            )}
          </div>
          <Link href="/list/events" className="block text-center text-sm text-green-600 mt-3 hover:underline">
            View All Events →
          </Link>
        </div>

        {/* Prayer Requests */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">PRAYER REQUESTS</h2>
            <Link href="/list/prayer-requests/new" className="text-xs text-green-600 hover:underline">
              + Add
            </Link>
          </div>
          <div className="space-y-2">
            {prayerRequests.length > 0 ? (
              prayerRequests.map((prayer) => (
                <p key={prayer.id} className="text-sm text-gray-600">
                  🙏 {prayer.title.length > 30 ? prayer.title.substring(0, 30) + '...' : prayer.title}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No prayer requests</p>
            )}
          </div>
          <Link href="/list/prayer-requests" className="block text-center text-sm text-green-600 mt-3 hover:underline">
            View All Requests →
          </Link>
        </div>

        {/* Event Calendar */}
        <EventCalendar />
        
        {/* Announcements */}
        <Announcements />
      </div>
    </div>
  );
};

export default MemberPage;
