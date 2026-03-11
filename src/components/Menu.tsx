import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "CHURCH DASHBOARD",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "pastor", "member", "familyHead", "ministryLeader", "cellLeader"],
      },
      {
        icon: "/pastor.png",
        label: "Pastors",
        href: "/list/pastors",
        visible: ["admin", "super_admin"],
      },
      {
        icon: "/member.png",
        label: "Members",
        href: "/list/members",
        visible: ["admin", "pastor", "cellLeader"],
      },
      {
        icon: "/family.png",
        label: "Families",
        href: "/list/families",
        visible: ["admin", "pastor", "familyHead"],
      },
      {
        icon: "/ministry.png",
        label: "Ministries",
        href: "/list/ministries",
        visible: ["admin", "pastor", "ministryLeader"],
      },
      {
        icon: "/cellgroup.png",
        label: "Cell Groups",
        href: "/list/cell-groups",
        visible: ["admin", "pastor", "cellLeader"],
      },
      {
        icon: "/service.png",
        label: "Services",
        href: "/list/services",
        visible: ["admin", "pastor", "ministryLeader", "member"],
      },
      {
        icon: "/contribution.png",
        label: "Contributions",
        href: "/list/contributions",
        visible: ["admin", "pastor", "financeLeader"],
      },
      {
        icon: "/fund.png",
        label: "Church Funds",
        href: "/list/funds",
        visible: ["admin", "pastor", "financeLeader"],
      },
      {
        icon: "/soul.png",
        label: "Soul Winning",
        href: "/list/soul-winning",
        visible: ["admin", "pastor", "evangelismLeader", "member"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "pastor", "cellLeader"],
      },
      {
        icon: "/calendar.png",
        label: "Church Events",
        href: "/list/events",
        visible: ["admin", "pastor", "ministryLeader", "cellLeader", "member"],
      },
      {
        icon: "/prayer.png",
        label: "Prayer Requests",
        href: "/list/prayer-requests",
        visible: ["admin", "pastor", "prayerLeader", "member"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "pastor", "ministryLeader", "cellLeader", "member"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "pastor", "ministryLeader", "cellLeader", "member"],
      },
    ],
  },
  {
    title: "CHURCH ADMIN",
    items: [
      {
        icon: "/profile.png",
        label: "My Profile",
        href: "/profile",
        visible: ["admin", "pastor", "member", "familyHead", "ministryLeader", "cellLeader"],
      },
      {
        icon: "/reports.png",
        label: "Reports",
        href: "/reports",
        visible: ["admin", "super_admin", "pastor"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "super_admin"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "pastor", "member", "familyHead", "ministryLeader", "cellLeader"],
      },
    ],
  },
];

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

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  
  // Get current date for church service reminder
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isSunday = dayOfWeek === 0;
  
  return (
    <div className="mt-4 text-sm">
      {/* Welcome Message */}
      <div className="px-4 mb-6">
        <p className="text-xs text-gray-400">Welcome back,</p>
        <p className="text-sm font-semibold text-gray-700">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-lamaPurple mt-1 capitalize">{getRoleDisplayName(role)}</p>
        
        {/* Sunday Service Reminder */}
        {isSunday && (
          <div className="mt-3 bg-purple-50 p-2 rounded-md border-l-4 border-purple-500">
            <p className="text-xs font-medium text-purple-700">🙏 Sunday Service Today</p>
            <p className="text-xs text-gray-500">9:00 AM - Main Sanctuary</p>
          </div>
        )}
      </div>

      {menuItems.map((section) => (
        <div className="flex flex-col gap-1" key={section.title}>
          <span className="hidden lg:block text-xs text-gray-400 font-light my-4 px-4">
            {section.title}
          </span>
          <div className="px-2">
            {section.items.map((item) => {
              if (item.visible.includes(role)) {
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 py-3 px-4 rounded-md hover:bg-purple-50 transition-colors group"
                  >
                    <Image 
                      src={item.icon} 
                      alt={item.label} 
                      width={20} 
                      height={20}
                      className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" 
                    />
                    <span className="hidden lg:block text-sm group-hover:text-purple-700">
                      {item.label}
                    </span>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      ))}

      {/* Church Footer */}
      <div className="mt-8 px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Flood of Life Embassy Church
        </p>
        <p className="text-xs text-gray-300 text-center mt-1">
          © {new Date().getFullYear()} • All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Menu;
