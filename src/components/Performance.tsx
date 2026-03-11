"use client";
import Image from "next/image";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Active", value: 78, fill: "#4CAF50" }, // Green for active
  { name: "Inactive", value: 22, fill: "#EF4444" }, // Red for inactive
];

const Performance = () => {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Church Health</h1>
        <Image src="/moreDark.png" alt="More options" width={16} height={16} />
      </div>
      
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold text-green-600">78%</h1>
        <p className="text-xs text-gray-400">Active Members</p>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 m-auto text-center">
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active (78%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Inactive (22%)</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Based on last 30 days attendance</p>
      </div>
    </div>
  );
};

export default Performance;
