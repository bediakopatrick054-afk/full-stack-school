import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

// Helper function to get user-friendly role name
const getRoleDisplayName = (role: string) => {
  const roleMap: { [key: string]: string } = {
    admin: "Admin",
    super_admin: "Super Admin",
    pastor: "Pastor",
    member: "Member",
    familyHead: "Family Head",
    ministryLeader: "Ministry Leader",
    cellLeader: "Cell Group Leader",
    evangelismLeader: "Evangelism Leader",
    prayerLeader: "Prayer Leader",
    financeLeader: "Finance Leader",
  };
  return roleMap[role] || role;
};

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  
  // Get current date for church greeting
  const today = new Date();
  const hour = today.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";
  
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-1 ring-gray-200 px-3 py-1 hover:ring-purple-300 transition-all">
        <Image src="/search.png" alt="Search" width={16} height={16} className="opacity-50" />
        <input
          type="text"
          placeholder="Search members, events, prayers..."
          className="w-[250px] p-2 bg-transparent outline-none text-sm"
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 text-xs text-gray-400">
          <span className="text-lg">⌘</span>K
        </kbd>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 justify-end w-full">
        {/* TODAY'S DATE */}
        <div className="hidden lg:block text-sm text-gray-500">
          {today.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>

        {/* PRAYER REQUESTS */}
        <Link href="/list/prayer-requests" className="relative group">
          <div className="bg-purple-50 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer group-hover:bg-purple-100 transition-colors">
            <Image src="/prayer.png" alt="Prayer Requests" width={18} height={18} />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-600 text-white rounded-full text-xs font-medium">
            3
          </div>
        </Link>

        {/* MESSAGES */}
        <Link href="/list/messages" className="relative group">
          <div className="bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer group-hover:bg-blue-100 transition-colors">
            <Image src="/message.png" alt="Messages" width={18} height={18} />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs font-medium">
            2
          </div>
        </Link>

        {/* ANNOUNCEMENTS */}
        <Link href="/list/announcements" className="relative group">
          <div className="bg-yellow-50 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer group-hover:bg-yellow-100 transition-colors">
            <Image src="/announcement.png" alt="Announcements" width={18} height={18} />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-yellow-600 text-white rounded-full text-xs font-medium">
            5
          </div>
        </Link>

        {/* DIVIDER */}
        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        {/* USER INFO */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-700">
            {user?.firstName} {user?.lastName}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-purple-600 font-medium capitalize">
              {getRoleDisplayName(role)}
            </span>
            <span className="text-[10px] text-gray-400">•</span>
            <span className="text-[10px] text-gray-400">{greeting}</span>
          </div>
        </div>

        {/* USER BUTTON */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
