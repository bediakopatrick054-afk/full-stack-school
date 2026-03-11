"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({
  data,
}: {
  data: { 
    name: string; 
    present: number; 
    absent: number;
    firstTimers?: number;
    cellGroup?: string;
  }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          formatter={(value: number, name: string) => {
            if (name === "present") return [`${value} members`, "Present"];
            if (name === "absent") return [`${value} members`, "Absent"];
            if (name === "firstTimers") return [`${value} souls`, "First Timers"];
            return [value, name];
          }}
          labelFormatter={(label) => `Service: ${label}`}
        />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          formatter={(value: string) => {
            if (value === "present") return "Members Present";
            if (value === "absent") return "Members Absent";
            if (value === "firstTimers") return "First Timers / Souls Won";
            return value;
          }}
        />
        <Bar
          dataKey="present"
          fill="#FAE27C" // Gold for present members
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="absent"
          fill="#C3EBFA" // Light blue for absent members
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        {data[0]?.firstTimers !== undefined && (
          <Bar
            dataKey="firstTimers"
            fill="#4CAF50" // Green for new souls/first timers
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Church-specific attendance summary component
export const ChurchAttendanceSummary = ({
  totalMembers,
  presentToday,
  firstTimersToday,
  cellGroupsActive,
}: {
  totalMembers: number;
  presentToday: number;
  firstTimersToday: number;
  cellGroupsActive: number;
}) => {
  const attendancePercentage = totalMembers > 0 
    ? Math.round((presentToday / totalMembers) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
        <p className="text-sm text-gray-500">Total Members</p>
        <p className="text-2xl font-bold">{totalMembers}</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
        <p className="text-sm text-gray-500">Present Today</p>
        <p className="text-2xl font-bold text-green-600">{presentToday}</p>
        <p className="text-xs text-gray-400">{attendancePercentage}% attendance</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
        <p className="text-sm text-gray-500">First Timers</p>
        <p className="text-2xl font-bold text-yellow-600">{firstTimersToday}</p>
        <p className="text-xs text-gray-400">Souls won today</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
        <p className="text-sm text-gray-500">Active Cell Groups</p>
        <p className="text-2xl font-bold text-purple-600">{cellGroupsActive}</p>
      </div>
    </div>
  );
};

// Weekly attendance trend component
export const WeeklyAttendanceTrend = ({
  weeklyData,
}: {
  weeklyData: { day: string; attendance: number; firstTimers: number }[];
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
      <div className="space-y-3">
        {weeklyData.map((day) => (
          <div key={day.day} className="flex items-center gap-4">
            <span className="w-24 text-sm font-medium">{day.day}</span>
            <div className="flex-1 h-10 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 flex items-center justify-end px-4 text-xs text-white"
                style={{ width: `${Math.min(day.attendance, 100)}%` }}
              >
                {day.attendance > 0 && `${day.attendance}`}
              </div>
            </div>
            <span className="text-sm text-gray-600 w-16">{day.attendance}</span>
            {day.firstTimers > 0 && (
              <span className="text-xs text-green-600">
                +{day.firstTimers} new
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;
