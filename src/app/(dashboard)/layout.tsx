import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white border-r border-gray-100 p-4 overflow-y-auto">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-6"
        >
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Image src="/church-logo.png" alt="Flood of Life" width={24} height={24} />
          </div>
          <span className="hidden lg:block font-bold text-gray-700">
            Flood of Life
          </span>
        </Link>
        <Menu />
        
        {/* Church Info Footer (visible on larger screens) */}
        <div className="hidden lg:block mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Flood of Life Embassy
          </p>
          <p className="text-[10px] text-gray-300 text-center mt-1">
            Making disciples of all nations
          </p>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F9FAFB] overflow-y-auto flex flex-col">
        <Navbar />
        
        {/* Main Content with Padding */}
        <main className="p-4 md:p-6 lg:p-8 flex-1">
          {children}
        </main>

        {/* Mobile Footer (visible only on small screens) */}
        <div className="lg:hidden bg-white border-t border-gray-100 p-3 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Flood of Life Embassy
          </p>
        </div>
      </div>
    </div>
  );
}
