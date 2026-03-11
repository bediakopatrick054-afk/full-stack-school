import Image from "next/image";
import AttendanceChart, { ChurchAttendanceSummary, WeeklyAttendanceTrend } from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceSunday = dayOfWeek; // Sunday is 0, so days since Sunday is the dayOfWeek

  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - daysSinceSunday);

  // Fetch attendance records for the week
  const attendanceData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastSunday,
      },
    },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          membershipStatus: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Fetch first timers (new members who joined this week)
  const firstTimersData = await prisma.member.findMany({
    where: {
      joinDate: {
        gte: lastSunday,
      },
      membershipStatus: "ACTIVE",
    },
    select: {
      id: true,
      joinDate: true,
    },
  });

  // Fetch cell group attendance
  const cellGroups = await prisma.cellGroup.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize attendance map for all days of the week
  const attendanceMap: { [key: string]: { present: number; absent: number; firstTimers: number } } = {
    Sun: { present: 0, absent: 0, firstTimers: 0 },
    Mon: { present: 0, absent: 0, firstTimers: 0 },
    Tue: { present: 0, absent: 0, firstTimers: 0 },
    Wed: { present: 0, absent: 0, firstTimers: 0 },
    Thu: { present: 0, absent: 0, firstTimers: 0 },
    Fri: { present: 0, absent: 0, firstTimers: 0 },
    Sat: { present: 0, absent: 0, firstTimers: 0 },
  };

  // Process attendance data
  attendanceData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayName = daysOfWeek[dayOfWeek];

    if (item.status === "PRESENT" || item.status === "LATE") {
      attendanceMap[dayName].present += 1;
    } else if (item.status === "ABSENT") {
      attendanceMap[dayName].absent += 1;
    } else if (item.status === "EXCUSED") {
      // Excused can be counted separately or as present based on church policy
      attendanceMap[dayName].present += 1; // Usually excused are counted as present
    }
  });

  // Process first timers data
  firstTimersData.forEach((item) => {
    const itemDate = new Date(item.joinDate);
    const dayOfWeek = itemDate.getDay();
    const dayName = daysOfWeek[dayOfWeek];
    
    attendanceMap[dayName].firstTimers += 1;
  });

  // Prepare chart data
  const chartData = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
    firstTimers: attendanceMap[day].firstTimers,
  }));

  // Calculate summary statistics
  const totalMembers = await prisma.member.count({
    where: { membershipStatus: "ACTIVE" },
  });

  const presentToday = attendanceMap[daysOfWeek[new Date().getDay()]].present;
  const firstTimersToday = attendanceMap[daysOfWeek[new Date().getDay()]].firstTimers;
  
  const activeCellGroups = cellGroups.filter(
    (group) => group._count.members > 0
  ).length;

  // Prepare weekly trend data
  const weeklyTrend = daysOfWeek.map((day) => ({
    day,
    attendance: attendanceMap[day].present,
    firstTimers: attendanceMap[day].firstTimers,
  }));

  // Calculate service-specific attendance
  const serviceAttendance = await prisma.attendance.groupBy({
    by: ['serviceId'],
    where: {
      date: {
        gte: lastSunday,
      },
    },
    _count: {
      _all: true,
    },
  });

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Church Attendance Overview</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      
      {/* Church Attendance Summary Cards */}
      <ChurchAttendanceSummary
        totalMembers={totalMembers}
        presentToday={presentToday}
        firstTimersToday={firstTimersToday}
        cellGroupsActive={activeCellGroups}
      />

      {/* Main Attendance Chart */}
      <div className="h-64 mt-4">
        <AttendanceChart data={chartData} />
      </div>

      {/* Weekly Attendance Trend */}
      <WeeklyAttendanceTrend weeklyData={weeklyTrend} />

      {/* Additional Church Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Average Weekly Attendance</p>
          <p className="text-xl font-bold">
            {Math.round(
              chartData.reduce((acc, day) => acc + day.present, 0) / 7
            )}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Total Souls Won (Week)</p>
          <p className="text-xl font-bold text-green-600">
            {chartData.reduce((acc, day) => acc + day.firstTimers, 0)}
          </p>
        </div>
      </div>

      {/* Service Type Breakdown (Optional) */}
      {serviceAttendance.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium mb-2">Service Breakdown</h3>
          <div className="space-y-2">
            {serviceAttendance.map((service) => (
              <div key={service.serviceId} className="flex justify-between text-sm">
                <span className="text-gray-600">Service {service.serviceId}</span>
                <span className="font-medium">{service._count._all} attendees</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceChartContainer;
