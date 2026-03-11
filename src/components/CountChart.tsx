"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";


const CountChart = ({ 
  total, 
  active, 
  firstTimers,
  men,
  women,
  children 
}: { 
  total?: number; 
  active?: number; 
  firstTimers?: number;
  men?: number;
  women?: number;
  children?: number;
}) => {
  // Default to male/female if provided, otherwise use church demographics
  const hasGenderData = men !== undefined && women !== undefined;
  
  const data = hasGenderData ? [
    {
      name: "Total",
      count: total || men + women + (children || 0),
      fill: "white",
    },
    {
      name: "Women",
      count: women || 0,
      fill: "#FAE27C", // Gold for women
    },
    {
      name: "Men",
      count: men || 0,
      fill: "#C3EBFA", // Light blue for men
    },
    ...(children ? [{
      name: "Children",
      count: children,
      fill: "#4CAF50", // Green for children
    }] : []),
  ] : [
    {
      name: "Total",
      count: total || 0,
      fill: "white",
    },
    {
      name: "Active",
      count: active || 0,
      fill: "#4CAF50", // Green for active members
    },
    {
      name: "First Timers",
      count: firstTimers || 0,
      fill: "#FAE27C", // Gold for first timers
    },
  ];

  // Calculate percentages for display
  const totalCount = data.find(d => d.name === "Total")?.count || 1;
  const getPercentage = (value: number) => ((value / totalCount) * 100).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar 
              background 
              dataKey="count" 
              cornerRadius={10}
              label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
            />
            <Legend 
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {hasGenderData ? (
          <Image
            src="/maleFemale.png"
            alt="Gender distribution"
            width={50}
            height={50}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <Image
            src="/church-icon.png"
            alt="Church demographics"
            width={50}
            height={50}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>
      
      {/* Demographic Summary */}
      <div className="flex justify-around mt-4 text-sm">
        {hasGenderData ? (
          <>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#C3EBFA]" />
              <span className="font-bold">{men || 0}</span>
              <span className="text-xs text-gray-500">Men ({getPercentage(men || 0)}%)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#FAE27C]" />
              <span className="font-bold">{women || 0}</span>
              <span className="text-xs text-gray-500">Women ({getPercentage(women || 0)}%)</span>
            </div>
            {children !== undefined && (
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
                <span className="font-bold">{children}</span>
                <span className="text-xs text-gray-500">Children ({getPercentage(children)}%)</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
              <span className="font-bold">{active || 0}</span>
              <span className="text-xs text-gray-500">Active ({getPercentage(active || 0)}%)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#FAE27C]" />
              <span className="font-bold">{firstTimers || 0}</span>
              <span className="text-xs text-gray-500">First Timers ({getPercentage(firstTimers || 0)}%)</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-white border border-gray-300" />
              <span className="font-bold">{total || 0}</span>
              <span className="text-xs text-gray-500">Total Members</span>
            </div>
          </>
        )}
      </div>

      {/* Additional Stats Card */}
      <div className="mt-4 bg-gray-50 rounded-lg p-3">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">CHURCH HEALTH METRICS</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-400">Growth Rate</p>
            <p className="font-bold">
              {firstTimers && total ? 
                `+${((firstTimers / total) * 100).toFixed(1)}%` : 
                '0%'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Retention</p>
            <p className="font-bold">
              {active && total ? 
                `${((active / total) * 100).toFixed(1)}%` : 
                '0%'}
            </p>
          </div>
          {hasGenderData && (
            <>
              <div>
                <p className="text-gray-400">Men/Women Ratio</p>
                <p className="font-bold">
                  {men && women ? 
                    `1:${(women / men).toFixed(1)}` : 
                    'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Family Coverage</p>
                <p className="font-bold">
                  {children ? 'With Children' : 'N/A'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Church-specific demographic chart component
export const DemographicChart = ({ 
  ageGroups,
  maritalStatus,
  occupation 
}: { 
  ageGroups?: { label: string; count: number; color: string }[];
  maritalStatus?: { single: number; married: number; other: number };
  occupation?: { employed: number; student: number; retired: number };
}) => {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg border">
      <h3 className="text-sm font-semibold mb-4">Detailed Demographics</h3>
      
      {/* Age Groups */}
      {ageGroups && (
        <div className="mb-4">
          <h4 className="text-xs text-gray-500 mb-2">Age Distribution</h4>
          <div className="space-y-2">
            {ageGroups.map((group) => (
              <div key={group.label} className="flex items-center gap-2">
                <div className="w-16 text-xs">{group.label}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(group.count / ageGroups.reduce((sum, g) => sum + g.count, 0)) * 100}%`,
                      backgroundColor: group.color 
                    }}
                  />
                </div>
                <div className="w-8 text-xs font-bold">{group.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marital Status */}
      {maritalStatus && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-500">Single</p>
            <p className="font-bold">{maritalStatus.single}</p>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <p className="text-xs text-gray-500">Married</p>
            <p className="font-bold">{maritalStatus.married}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Other</p>
            <p className="font-bold">{maritalStatus.other}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountChart;
