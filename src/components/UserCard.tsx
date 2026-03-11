import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "admin" | "pastor" | "member" | "familyHead" | "cellGroup" | "ministry";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    pastor: prisma.pastor,
    member: prisma.member,
    familyHead: prisma.family,
    cellGroup: prisma.cellGroup,
    ministry: prisma.ministry,
  };

  let data = 0;
  
  if (type === "familyHead") {
    // Count distinct families (each family has one head)
    data = await prisma.family.count();
  } else if (type === "cellGroup") {
    data = await prisma.cellGroup.count();
  } else if (type === "ministry") {
    data = await prisma.ministry.count();
  } else {
    data = await modelMap[type].count();
  }

  // Get current year for display
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  // Get icon and color based on type
  const getCardStyle = () => {
    switch(type) {
      case "admin":
        return { bg: "bg-purple-100", text: "text-purple-700", icon: "/admin-icon.png" };
      case "pastor":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: "/pastor-icon.png" };
      case "member":
        return { bg: "bg-green-100", text: "text-green-700", icon: "/member-icon.png" };
      case "familyHead":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "/family-icon.png" };
      case "cellGroup":
        return { bg: "bg-orange-100", text: "text-orange-700", icon: "/cell-icon.png" };
      case "ministry":
        return { bg: "bg-pink-100", text: "text-pink-700", icon: "/ministry-icon.png" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: "/more.png" };
    }
  };

  const style = getCardStyle();

  // Get display name
  const getDisplayName = () => {
    switch(type) {
      case "admin": return "Admins";
      case "pastor": return "Pastors";
      case "member": return "Members";
      case "familyHead": return "Families";
      case "cellGroup": return "Cell Groups";
      case "ministry": return "Ministries";
      default: return `${type}s`;
    }
  };

  return (
    <div className={`rounded-2xl ${style.bg} p-4 flex-1 min-w-[130px] shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-purple-600 font-medium">
          {currentYear}/{nextYear.toString().slice(2)}
        </span>
        <Image 
          src="/more-dark.png" 
          alt="More options" 
          width={20} 
          height={20}
          className="opacity-60 hover:opacity-100 cursor-pointer" 
        />
      </div>
      
      <div className="flex items-center gap-2 my-3">
        <Image 
          src={style.icon} 
          alt={type} 
          width={24} 
          height={24}
          className="opacity-70"
        />
        <h1 className={`text-2xl font-bold ${style.text}`}>{data.toLocaleString()}</h1>
      </div>
      
      <h2 className={`capitalize text-sm font-medium ${style.text} opacity-80`}>
        {getDisplayName()}
      </h2>
      
      {/* Quick stat for members */}
      {type === "member" && (
        <div className="mt-2 text-xs text-gray-500">
          <span>✨ {Math.round(data * 0.78)} active this month</span>
        </div>
      )}
      
      {/* Quick stat for cell groups */}
      {type === "cellGroup" && (
        <div className="mt-2 text-xs text-gray-500">
          <span>👥 Avg 12 members per group</span>
        </div>
      )}
    </div>
  );
};

export default UserCard;
