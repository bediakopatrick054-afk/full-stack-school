import Image from "next/image";
import CountChart, { DemographicChart } from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  // Get gender distribution
  const genderData = await prisma.member.groupBy({
    by: ["gender"],
    where: {
      membershipStatus: "ACTIVE",
    },
    _count: true,
  });

  // Get membership status distribution
  const statusData = await prisma.member.groupBy({
    by: ["membershipStatus"],
    _count: true,
  });

  // Get first timers (members who joined in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const firstTimers = await prisma.member.count({
    where: {
      joinDate: {
        gte: thirtyDaysAgo,
      },
      membershipStatus: "ACTIVE",
    },
  });

  // Get children count (members under 18)
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const children = await prisma.member.count({
    where: {
      dateOfBirth: {
        gt: eighteenYearsAgo,
      },
      membershipStatus: "ACTIVE",
    },
  });

  // Get marital status distribution
  const maritalData = await prisma.member.groupBy({
    by: ["maritalStatus"],
    where: {
      membershipStatus: "ACTIVE",
    },
    _count: true,
  });

  // Get age group distribution
  const allMembers = await prisma.member.findMany({
    where: {
      membershipStatus: "ACTIVE",
    },
    select: {
      dateOfBirth: true,
    },
  });

  // Calculate age groups
  const ageGroups = {
    children: 0, // 0-12
    youth: 0,    // 13-25
    adults: 0,   // 26-45
    seniors: 0,  // 46+
  };

  allMembers.forEach((member) => {
    const age = today.getFullYear() - member.dateOfBirth.getFullYear();
    if (age <= 12) ageGroups.children++;
    else if (age <= 25) ageGroups.youth++;
    else if (age <= 45) ageGroups.adults++;
    else ageGroups.seniors++;
  });

  // Calculate totals
  const men = genderData.find((d) => d.gender === "MALE")?._count || 0;
  const women = genderData.find((d) => d.gender === "FEMALE")?._count || 0;
  const total = men + women;
  
  const active = statusData.find((d) => d.membershipStatus === "ACTIVE")?._count || 0;
  const inactive = statusData.find((d) => d.membershipStatus === "INACTIVE")?._count || 0;
  
  const married = maritalData.find((d) => d.maritalStatus === "MARRIED")?._count || 0;
  const single = maritalData.find((d) => d.maritalStatus === "SINGLE")?._count || 0;
  const otherMarital = total - (married + single);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Church Demographics</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      {/* CHART - Shows either gender distribution or active/first timers */}
      <CountChart 
        men={men}
        women={women}
        children={children}
        active={active}
        firstTimers={firstTimers}
        total={total}
      />

      {/* BOTTOM STATS - Gender Distribution */}
      <div className="flex justify-center gap-16 mt-4">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{men}</h1>
          <h2 className="text-xs text-gray-500">
            Men ({Math.round((men / total) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{women}</h1>
          <h2 className="text-xs text-gray-500">
            Women ({Math.round((women / total) * 100)}%)
          </h2>
        </div>
        {children > 0 && (
          <div className="flex flex-col gap-1">
            <div className="w-5 h-5 bg-green-400 rounded-full" />
            <h1 className="font-bold">{children}</h1>
            <h2 className="text-xs text-gray-500">
              Children ({Math.round((children / total) * 100)}%)
            </h2>
          </div>
        )}
      </div>

      {/* Membership Health Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Active Members</p>
          <p className="text-xl font-bold text-green-600">{active}</p>
          <p className="text-xs text-gray-400">{Math.round((active / total) * 100)}% of total</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">First Timers (30d)</p>
          <p className="text-xl font-bold text-yellow-600">{firstTimers}</p>
          <p className="text-xs text-gray-400">New souls this month</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-blue-600">{inactive}</p>
          <p className="text-xs text-gray-400">Need follow-up</p>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3">Age Distribution</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Children (0-12)</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${(ageGroups.children / total) * 100}%` }}
              />
            </div>
            <span className="text-xs w-12">{ageGroups.children}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Youth (13-25)</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${(ageGroups.youth / total) * 100}%` }}
              />
            </div>
            <span className="text-xs w-12">{ageGroups.youth}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Adults (26-45)</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${(ageGroups.adults / total) * 100}%` }}
              />
            </div>
            <span className="text-xs w-12">{ageGroups.adults}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Seniors (46+)</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full"
                style={{ width: `${(ageGroups.seniors / total) * 100}%` }}
              />
            </div>
            <span className="text-xs w-12">{ageGroups.seniors}</span>
          </div>
        </div>
      </div>

      {/* Marital Status */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="bg-pink-50 p-2 rounded">
          <p className="text-xs text-gray-500">Single</p>
          <p className="font-bold text-pink-600">{single}</p>
          <p className="text-xs text-gray-400">{Math.round((single / total) * 100)}%</p>
        </div>
        <div className="bg-indigo-50 p-2 rounded">
          <p className="text-xs text-gray-500">Married</p>
          <p className="font-bold text-indigo-600">{married}</p>
          <p className="text-xs text-gray-400">{Math.round((married / total) * 100)}%</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Other</p>
          <p className="font-bold text-gray-600">{otherMarital}</p>
          <p className="text-xs text-gray-400">{Math.round((otherMarital / total) * 100)}%</p>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400">
        <p>Total Registered Members: {total}</p>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default CountChartContainer;
