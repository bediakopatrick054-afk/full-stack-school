import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import MemberAttendanceCard from "@/components/MemberAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

const FamilyHeadPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;
  
  // Get family head details
  const familyHead = await prisma.member.findUnique({
    where: { id: currentUserId! },
    include: {
      family: {
        include: {
          members: {
            include: {
              cellGroup: true,
            },
          },
        },
      },
    },
  });

  // Get family members (spouse and children)
  const familyMembers = familyHead?.family?.members.filter(
    member => member.id !== currentUserId
  ) || [];

  // Get prayer requests from family members
  const familyPrayerRequests = await prisma.prayerRequest.findMany({
    where: {
      member: {
        familyId: familyHead?.familyId,
      },
      isPublic: true,
      status: "PENDING",
    },
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get upcoming family-friendly events
  const familyEvents = await prisma.event.findMany({
    where: {
      OR: [
        { eventType: "CHILDREN'S_CHURCH" },
        { eventType: "WEDDING" },
        { eventType: "BAPTISM" },
        { eventType: "DEDICATION" },
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

  const familyName = familyHead?.family?.familyName || "Family";

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT - Family Members Section */}
      <div className="w-full xl:w-2/3 space-y-4">
        {/* Family Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold">{familyName} Dashboard</h1>
          <p className="text-amber-100 mt-2">
            Managing {familyMembers.length} family member{familyMembers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Family Members List */}
        {familyMembers.length > 0 ? (
          familyMembers.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">
                      {member.gender === "MALE" ? "👨" : "👩"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      {member.firstName} {member.lastName}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {member.relationship || "Family Member"} • 
                      Joined {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <Link 
                  href={`/list/members/${member.id}`}
                  className="text-sm text-amber-600 hover:underline"
                >
                  View Profile
                </Link>
              </div>

              {/* Member Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {member.cellGroup && (
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-400">Cell Group</p>
                    <p className="text-sm font-medium">{member.cellGroup.name}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-400">Attendance</p>
                  <MemberAttendanceCard id={member.id} />
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`text-sm font-medium ${
                    member.membershipStatus === "ACTIVE" ? "text-green-600" : "text-gray-400"
                  }`}>
                    {member.membershipStatus}
                  </p>
                </div>
              </div>

              {/* Member Schedule */}
              {member.cellGroup && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {member.firstName}'s Schedule
                  </h3>
                  <BigCalendarContainer type="cellGroupId" id={member.cellGroup.id} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-md shadow-sm text-center">
            <p className="text-gray-400">No family members found</p>
          </div>
        )}
      </div>

      {/* RIGHT - Sidebar */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* Family Stats */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">FAMILY STATS</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{familyMembers.length}</p>
              <p className="text-xs text-gray-500">Family Members</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {familyMembers.filter(m => m.membershipStatus === "ACTIVE").length}
              </p>
              <p className="text-xs text-gray-500">Active Members</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {familyMembers.filter(m => m.cellGroup).length}
              </p>
              <p className="text-xs text-gray-500">In Cell Groups</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {await prisma.attendance.count({
                  where: {
                    member: {
                      familyId: familyHead?.familyId,
                    },
                    date: {
                      gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    },
                  },
                })}
              </p>
              <p className="text-xs text-gray-500">Combined Attendance</p>
            </div>
          </div>
        </div>

        {/* Family Prayer Requests */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">FAMILY PRAYER REQUESTS</h2>
            <Link href="/list/prayer-requests/new" className="text-xs text-amber-600 hover:underline">
              + Add
            </Link>
          </div>
          <div className="space-y-2">
            {familyPrayerRequests.length > 0 ? (
              familyPrayerRequests.map((prayer) => (
                <p key={prayer.id} className="text-sm text-gray-600">
                  🙏 {prayer.title.length > 40 ? prayer.title.substring(0, 40) + '...' : prayer.title}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No prayer requests from family</p>
            )}
          </div>
          <Link href="/list/prayer-requests" className="block text-center text-sm text-amber-600 mt-3 hover:underline">
            View All Requests →
          </Link>
        </div>

        {/* Family-Friendly Events */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">FAMILY EVENTS</h2>
          <div className="space-y-3">
            {familyEvents.length > 0 ? (
              familyEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">
                      {event.eventType === "CHILDREN'S_CHURCH" ? "🧸" : 
                       event.eventType === "WEDDING" ? "💒" : 
                       event.eventType === "BAPTISM" ? "💧" : "🎉"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No upcoming family events</p>
            )}
          </div>
          <Link href="/list/events" className="block text-center text-sm text-amber-600 mt-3 hover:underline">
            View All Events →
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/list/events/new" 
                  className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm text-center hover:bg-amber-100 transition-colors">
              Schedule Event
            </Link>
            <Link href="/list/prayer-requests/new" 
                  className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm text-center hover:bg-blue-100 transition-colors">
              Add Prayer
            </Link>
            <Link href="/list/members" 
                  className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center hover:bg-green-100 transition-colors">
              View Members
            </Link>
            <Link href="/list/contributions/new" 
                  className="bg-purple-50 text-purple-700 p-3 rounded-lg text-sm text-center hover:bg-purple-100 transition-colors">
              Give Offering
            </Link>
          </div>
        </div>

        {/* Announcements */}
        <Announcements />
      </div>
    </div>
  );
};

export default FamilyHeadPage;
