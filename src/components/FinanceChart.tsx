"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Church-specific financial data
const data = [
  {
    name: "Jan",
    tithes: 4500,
    offerings: 3200,
    missions: 1800,
    expenses: 3800,
  },
  {
    name: "Feb",
    tithes: 5200,
    offerings: 2800,
    missions: 2100,
    expenses: 4100,
  },
  {
    name: "Mar",
    tithes: 4800,
    offerings: 3500,
    missions: 1900,
    expenses: 4300,
  },
  {
    name: "Apr",
    tithes: 5100,
    offerings: 2900,
    missions: 2200,
    expenses: 3900,
  },
  {
    name: "May",
    tithes: 5300,
    offerings: 3100,
    missions: 2000,
    expenses: 4200,
  },
  {
    name: "Jun",
    tithes: 4900,
    offerings: 3400,
    missions: 2300,
    expenses: 4400,
  },
  {
    name: "Jul",
    tithes: 5600,
    offerings: 3600,
    missions: 2400,
    expenses: 4600,
  },
  {
    name: "Aug",
    tithes: 5400,
    offerings: 3300,
    missions: 2100,
    expenses: 4300,
  },
  {
    name: "Sep",
    tithes: 5800,
    offerings: 3800,
    missions: 2500,
    expenses: 4800,
  },
  {
    name: "Oct",
    tithes: 5200,
    offerings: 3400,
    missions: 2200,
    expenses: 4500,
  },
  {
    name: "Nov",
    tithes: 5900,
    offerings: 3900,
    missions: 2600,
    expenses: 4900,
  },
  {
    name: "Dec",
    tithes: 6300,
    offerings: 4200,
    missions: 2800,
    expenses: 5200,
  },
];

const FinanceChart = () => {
  // Calculate totals
  const totalTithes = data.reduce((sum, month) => sum + month.tithes, 0);
  const totalOfferings = data.reduce((sum, month) => sum + month.offerings, 0);
  const totalMissions = data.reduce((sum, month) => sum + month.missions, 0);
  const totalIncome = totalTithes + totalOfferings + totalMissions;
  const totalExpenses = data.reduce((sum, month) => sum + month.expenses, 0);
  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return `₵${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-700">{label} 2025</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Church Finances</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Tithes (YTD)</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(totalTithes)}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Offerings (YTD)</p>
          <p className="text-lg font-bold text-yellow-600">{formatCurrency(totalOfferings)}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Missions (YTD)</p>
          <p className="text-lg font-bold text-blue-600">{formatCurrency(totalMissions)}</p>
        </div>
        <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-purple-50' : 'bg-red-50'}`}>
          <p className="text-xs text-gray-500">Balance</p>
          <p className={`text-lg font-bold ${balance >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="70%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            axisLine={false} 
            tick={{ fill: "#9CA3AF", fontSize: 12 }} 
            tickLine={false}  
            tickMargin={20}
            tickFormatter={(value) => `₵${value/1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
          />
          <Line
            type="monotone"
            dataKey="tithes"
            name="Tithes"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="offerings"
            name="Offerings"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="missions"
            name="Missions"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
        <div>
          <p>Total Income: {formatCurrency(totalIncome)}</p>
          <p>Total Expenses: {formatCurrency(totalExpenses)}</p>
        </div>
        <div className="text-right">
          <p className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
            {balance >= 0 ? 'Surplus' : 'Deficit'}: {formatCurrency(Math.abs(balance))}
          </p>
          <p>Tithe Ratio: {((totalTithes/totalIncome)*100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceChart;
