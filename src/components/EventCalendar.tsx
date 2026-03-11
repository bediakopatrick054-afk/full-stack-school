import Image from "next/image";
import CountChart, { DemographicChart } from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  // Get gender distribution for ACTIVE members only
  const genderData = await prisma.member.groupBy({
    by: ["gender"],
    where: {
      membershipStatus: "ACTIVE",
    },
    _count: true,
  });

  // Get membership status distribution (all statuses)
  const statusData = await prisma.member.groupBy({
    by: ["membershipStatus"],
    _count: true,
  });

  // Get first timers (members who joined in the last 30 days) - regardless of status
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const firstTimers = await prisma.member.count({
    where: {
      joinDate: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Get new converts (baptized in the last 30 days)
  const thirtyDaysAgoEnd = new Date();
  thirtyDaysAgoEnd.setDate(thirtyDaysAgoEnd.getDate() - 30);
  
  const newConverts = await prisma.member.count({
    where: {
      baptismDate: {
        gte: thirtyDaysAgoEnd,
      },
    },
  });

  // Get children count (members under 18) - active only
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

  // Get youth count (members 13-25) - active only
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );
  
  const twentyFiveYearsAgo = new Date(
    today.getFullYear() - 26,
    today.getMonth(),
    today.getDate()
  );

  const youth = await prisma.member.count({
    where: {
      dateOfBirth: {
        lte: thirteenYearsAgo,
        gt: twentyFiveYearsAgo,
      },
      membershipStatus: "ACTIVE",
    },
  });

  // Get marital status distribution - active only
  const maritalData = await prisma.member.groupBy({
    by: ["maritalStatus"],
    where: {
      membershipStatus: "ACTIVE",
    },
    _count: true,
  });

  // Get department/ministry distribution
  const ministryData = await prisma.member.groupBy({
    by: ["departmentId"],
    where: {
      membershipStatus: "ACTIVE",
      departmentId: {
        not: null,
      },
    },
    _count: true,
  });

  const totalInMinistries = ministryData.reduce((acc, curr) => acc + curr._count, 0);

  // Get cell group distribution
  const cellGroupData = await prisma.cellGroup.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  const activeCellGroups = cellGroupData.filter(g => g._count.members > 0).length;
  const totalInCellGroups = cellGroupData.reduce((acc, g) => acc + g._count.members, 0);

  // Get age group distribution (more accurate calculation)
  const allMembers = await prisma.member.findMany({
    where: {
      membershipStatus: "ACTIVE",
    },
    select: {
      dateOfBirth: true,
    },
  });

  // Calculate age groups with accurate ages
  const ageGroups = {
    children: 0, // 0-12
    youth: 0,    // 13-25
    adults: 0,   // 26-45
    seniors: 0,  // 46+
    unknown: 0,  // No DOB
  };

  allMembers.forEach((member) => {
    if (!member.dateOfBirth) {
      ageGroups.unknown++;
      return;
    }
    
    const birthDate = new Date(member.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
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
  const transferred = statusData.find((d) => d.membershipStatus === "TRANSFERRED")?._count || 0;
  
  const married = maritalData.find((d) => d.maritalStatus === "MARRIED")?._count || 0;
  const single = maritalData.find((d) => d.maritalStatus === "SINGLE")?._count || 0;
  const divorced = maritalData.find((d) => d.maritalStatus === "DIVORCED")?._count || 0;
  const widowed = maritalData.find((d) => d.maritalStatus === "WIDOWED")?._count || 0;
  const separated = maritalData.find((d) => d.maritalStatus === "SEPARATED")?._count || 0;
  const otherMarital = divorced + widowed + separated;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 overflow-y-auto">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Church Demographics</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      {/* MAIN CHART - Shows gender distribution */}
      <div className="h-64">
        <CountChart 
          men={men}
          women={women}
          children={children}
          youth={youth}
          total={total}
        />
      </div>

      {/* BOTTOM STATS - Gender Distribution */}
      <div className="flex justify-center gap-8 mt-2">
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-lamaSky rounded-full" />
          <h1 className="font-bold text-lg">{men}</h1>
          <h2 className="text-xs text-gray-500">
            Men ({total > 0 ? Math.round((men / total) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-lamaYellow rounded-full" />
          <h1 className="font-bold text-lg">{women}</h1>
          <h2 className="text-xs text-gray-500">
            Women ({total > 0 ? Math.round((women / total) * 100) : 0}%)
          </h2>
        </div>
        {children > 0 && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 bg-green-400 rounded-full" />
            <h1 className="font-bold text-lg">{children}</h1>
            <h2 className="text-xs text-gray-500">
              Children ({total > 0 ? Math.round((children / total) * 100) : 0}%)
            </h2>
          </div>
        )}
      </div>

      {/* MEMBERSHIP HEALTH CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Active Members</p>
          <p className="text-xl font-bold text-green-600">{active}</p>
          <p className="text-xs text-gray-400">{total > 0 ? Math.round((active / total) * 100) : 0}%</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">First Timers (30d)</p>
          <p className="text-xl font-bold text-yellow-600">{firstTimers}</p>
          <p className="text-xs text-gray-400">New souls</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">New Converts</p>
          <p className="text-xl font-bold text-blue-600">{newConverts}</p>
          <p className="text-xs text-gray-400">Baptized (30d)</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-red-600">{inactive}</p>
          <p className="text-xs text-gray-400">Need follow-up</p>
        </div>
      </div>

      {/* AGE DISTRIBUTION */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3">Age Distribution</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Children (0-12)</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full flex items-center justify-end px-2"
                style={{ width: `${total > 0 ? (ageGroups.children / total) * 100 : 0}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {total > 0 ? Math.round((ageGroups.children / total) * 100) : 0}%
                </span>
              </div>
            </div>
            <span className="text-xs w-12 font-medium">{ageGroups.children}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Youth (13-25)</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 rounded-full flex items-center justify-end px-2"
                style={{ width: `${total > 0 ? (ageGroups.youth / total) * 100 : 0}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {total > 0 ? Math.round((ageGroups.youth / total) * 100) : 0}%
                </span>
              </div>
            </div>
            <span className="text-xs w-12 font-medium">{ageGroups.youth}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Adults (26-45)</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full flex items-center justify-end px-2"
                style={{ width: `${total > 0 ? (ageGroups.adults / total) * 100 : 0}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {total > 0 ? Math.round((ageGroups.adults / total) * 100) : 0}%
                </span>
              </div>
            </div>
            <span className="text-xs w-12 font-medium">{ageGroups.adults}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-16">Seniors (46+)</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full flex items-center justify-end px-2"
                style={{ width: `${total > 0 ? (ageGroups.seniors / total) * 100 : 0}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {total > 0 ? Math.round((ageGroups.seniors / total) * 100) : 0}%
                </span>
              </div>
            </div>
            <span className="text-xs w-12 font-medium">{ageGroups.seniors}</span>
          </div>
        </div>
      </div>

      {/* MARITAL STATUS */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3">Marital Status</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-pink-50 p-2 rounded">
            <p className="text-xs text-gray-500">Single</p>
            <p className="font-bold text-pink-600">{single}</p>
            <p className="text-xs text-gray-400">{total > 0 ? Math.round((single / total) * 100) : 0}%</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded">
            <p className="text-xs text-gray-500">Married</p>
            <p className="font-bold text-indigo-600">{married}</p>
            <p className="text-xs text-gray-400">{total > 0 ? Math.round((married / total) * 100) : 0}%</p>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <p className="text-xs text-gray-500">Divorced</p>
            <p className="font-bold text-orange-600">{divorced}</p>
            <p className="text-xs text-gray-400">{total > 0 ? Math.round((divorced / total) * 100) : 0}%</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Widowed</p>
            <p className="font-bold text-gray-600">{widowed}</p>
            <p className="text-xs text-gray-400">{total > 0 ? Math.round((widowed / total) * 100) : 0}%</p>
          </div>
        </div>
      </div>

      {/* MINISTRY & CELL GROUP ENGAGEMENT */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Ministry Engagement</h4>
          <p className="text-2xl font-bold text-blue-600">{totalInMinistries}</p>
          <p className="text-xs text-gray-500">Members in ministries</p>
          <p className="text-xs text-gray-400 mt-1">
            {total > 0 ? Math.round((totalInMinistries / total) * 100) : 0}% participation
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Cell Groups</h4>
          <p className="text-2xl font-bold text-green-600">{activeCellGroups}</p>
          <p className="text-xs text-gray-500">Active cell groups</p>
          <p className="text-xs text-gray-400 mt-1">
            {totalInCellGroups} members in cells
          </p>
        </div>
      </div>

      {/* QUICK STATS FOOTER */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Total Registered: {total + transferred}</span>
          <span>Transferred: {transferred}</span>
          <span>Updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
