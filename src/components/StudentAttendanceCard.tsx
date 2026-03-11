import prisma from "@/lib/prisma";

const MemberAttendanceCard = async ({ 
  id, 
  type = "member" 
}: { 
  id: string; 
  type?: "member" | "cellGroup" | "ministry";
}) => {
  let attendanceData;
  let totalDays = 0;
  let presentDays = 0;
  let excusedDays = 0;
  let lateDays = 0;

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const totalPossibleServices = 52; // Approx number of Sunday services in a year

  if (type === "member") {
    // Get attendance for a specific member
    attendanceData = await prisma.attendance.findMany({
      where: {
        memberId: id,
        date: {
          gte: startOfYear,
        },
      },
    });

    totalDays = attendanceData.length;
    presentDays = attendanceData.filter(
      (day) => day.status === "PRESENT" || day.status === "LATE"
    ).length;
    excusedDays = attendanceData.filter((day) => day.status === "EXCUSED").length;
    lateDays = attendanceData.filter((day) => day.status === "LATE").length;
  } else if (type === "cellGroup") {
    // Get attendance for all members in a cell group
    const cellGroup = await prisma.cellGroup.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: {
          include: {
            attendance: {
              where: {
                date: {
                  gte: startOfYear,
                },
              },
            },
          },
        },
      },
    });

    if (cellGroup) {
      const allAttendance = cellGroup.members.flatMap((m) => m.attendance);
      totalDays = allAttendance.length;
      presentDays = allAttendance.filter(
        (a) => a.status === "PRESENT" || a.status === "LATE"
      ).length;
      excusedDays = allAttendance.filter((a) => a.status === "EXCUSED").length;
    }
  } else if (type === "ministry") {
    // Get attendance for a specific ministry/service
    attendanceData = await prisma.attendance.findMany({
      where: {
        service: {
          ministryId: parseInt(id),
        },
        date: {
          gte: startOfYear,
        },
      },
    });

    totalDays = attendanceData.length;
    presentDays = attendanceData.filter(
      (day) => day.status === "PRESENT" || day.status === "LATE"
    ).length;
    excusedDays = attendanceData.filter((day) => day.status === "EXCUSED").length;
    lateDays = attendanceData.filter((day) => day.status === "LATE").length;
  }

  // Calculate percentages
  const attendancePercentage = totalDays > 0 
    ? ((presentDays / totalDays) * 100).toFixed(1)
    : "0.0";
  
  const overallPercentage = totalPossibleServices > 0
    ? ((presentDays / totalPossibleServices) * 100).toFixed(1)
    : "0.0";

  // Determine faithfulness level
  const getFaithfulnessLevel = (percentage: number) => {
    if (percentage >= 80) return { label: "Faithful", color: "text-green-600" };
    if (percentage >= 50) return { label: "Regular", color: "text-yellow-600" };
    if (percentage >= 25) return { label: "Occasional", color: "text-orange-600" };
    return { label: "Needs Encouragement", color: "text-red-600" };
  };

  const faithfulness = getFaithfulnessLevel(parseFloat(attendancePercentage));

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Main attendance number */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-purple-600">{attendancePercentage}%</h1>
        <p className="text-sm text-gray-500">Attendance Rate</p>
        <p className={`text-xs font-medium mt-1 ${faithfulness.color}`}>
          {faithfulness.label}
        </p>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-green-50 p-2 rounded">
          <p className="text-green-600 font-bold">{presentDays}</p>
          <p className="text-gray-500">Present</p>
        </div>
        <div className="bg-yellow-50 p-2 rounded">
          <p className="text-yellow-600 font-bold">{lateDays}</p>
          <p className="text-gray-500">Late</p>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-blue-600 font-bold">{excusedDays}</p>
          <p className="text-gray-500">Excused</p>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Total Services:</span>
          <span className="font-medium">{totalDays}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-400">Year-to-date:</span>
          <span className="font-medium">{overallPercentage}%</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-400">Missed:</span>
          <span className="font-medium text-red-500">
            {totalDays - presentDays}
          </span>
        </div>
      </div>

      {/* Encouragement message */}
      {parseFloat(attendancePercentage) < 50 && (
        <div className="mt-3 bg-purple-50 p-2 rounded text-center">
          <p className="text-xs text-purple-600">
            🙏 We look forward to seeing you more often!
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberAttendanceCard;
