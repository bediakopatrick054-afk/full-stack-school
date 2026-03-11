import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import MemberAttendanceCard from "@/components/MemberAttendanceCard";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

const PastorPage = () => {
  const { userId } = auth();
  
  // For demo purposes - in production, fetch this data
  const pastorName = "Pastor John";
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isSunday = dayOfWeek === 0;

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT - Main Content */}
      <div className="w-full xl:w-2/3">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-4">
          <h1 className="text-2xl font-bold">Welcome back, {pastorName}! 👋</h1>
          <p className="text-purple-100 mt-2">
            {isSunday 
              ? "Today is Sunday Service day. May God's presence fill the sanctuary." 
              : "Here's what's happening in your church today."}
          </p>
          
          {/* Quick Actions */}
          <div className="flex gap-3 mt-4">
            <Link href="/list/services/new" 
                  className="bg-white text-purple-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-50 transition-colors">
              Schedule Service
            </Link>
            <Link href="/list/events/new" 
                  className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-400 transition-colors">
              Create Event
            </Link>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="h-full bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-700">Pastoral Schedule</h1>
            <Link href="/list/services" className="text-sm text-purple-600 hover:underline">
              View All
            </Link>
          </div>
          <BigCalendarContainer type="pastorId" id={userId!} />
        </div>
      </div>

      {/* RIGHT - Sidebar */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* Quick Stats */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">QUICK STATS</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">3</p>
              <p className="text-xs text-gray-500">Services Today</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-500">Prayer Requests</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-xs text-gray-500">Counseling Sessions</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">28</p>
              <p className="text-xs text-gray-500">Members Joined</p>
            </div>
          </div>
        </div>

        {/* Upcoming Duties */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">UPCOMING DUTIES</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📖</span>
              </div>
              <div>
                <p className="text-sm font-medium">Sunday Service Preaching</p>
                <p className="text-xs text-gray-400">Tomorrow, 9:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🙏</span>
              </div>
              <div>
                <p className="text-sm font-medium">Prayer Meeting</p>
                <p className="text-xs text-gray-400">Wed, 6:30 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium">Leadership Meeting</p>
                <p className="text-xs text-gray-400">Fri, 4:00 PM</p>
              </div>
            </div>
          </div>
          <Link href="/list/services" className="block text-center text-sm text-purple-600 mt-3 hover:underline">
            View All Duties →
          </Link>
        </div>

        {/* Personal Attendance Card */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">MY ATTENDANCE</h2>
          <MemberAttendanceCard id={userId!} />
        </div>

        {/* Prayer Requests Preview */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">PRAYER REQUESTS</h2>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">3 new</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">🙏 Sister Mary - Healing</p>
            <p className="text-sm text-gray-600">🙏 Brother John - Family</p>
            <p className="text-sm text-gray-600">🙏 Youth Group - Revival</p>
          </div>
          <Link href="/list/prayer-requests" className="block text-center text-sm text-purple-600 mt-3 hover:underline">
            View All Requests →
          </Link>
        </div>

        {/* Announcements */}
        <Announcements />
      </div>
    </div>
  );
};

export default PastorPage;
