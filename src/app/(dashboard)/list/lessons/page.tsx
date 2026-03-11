import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Service, Ministry, Pastor, CellGroup, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ServiceList = Service & { 
  ministry: Ministry | null 
} & { 
  cellGroup: CellGroup | null 
} & {
  pastor: Pastor | null
};

const ServiceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Service Name",
      accessor: "name",
    },
    {
      header: "Ministry",
      accessor: "ministry",
      className: "hidden md:table-cell",
    },
    {
      header: "Cell Group",
      accessor: "cellGroup",
      className: "hidden md:table-cell",
    },
    {
      header: "Officiating Pastor",
      accessor: "pastor",
      className: "hidden lg:table-cell",
    },
    {
      header: "Day & Time",
      accessor: "schedule",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" || role === "super_admin" || role === "pastor"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ServiceList) => {
    // Format day of week
    const dayOfWeek = item.dayOfWeek ? 
      item.dayOfWeek.charAt(0) + item.dayOfWeek.slice(1).toLowerCase() : 
      "TBD";
    
    // Format time
    const startTime = item.startTime ? 
      new Date(item.startTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : 
      "TBD";
    
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50 transition-colors"
      >
        <td className="p-4">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-400 md:hidden mt-1">
              {dayOfWeek} • {startTime}
            </p>
          </div>
        </td>
        <td className="hidden md:table-cell">
          {item.ministry?.name || "—"}
        </td>
        <td className="hidden md:table-cell">
          {item.cellGroup?.name || "—"}
        </td>
        <td className="hidden lg:table-cell">
          {item.pastor ? `${item.pastor.name} ${item.pastor.surname}` : "—"}
        </td>
        <td className="hidden lg:table-cell">
          <div>
            <p>{dayOfWeek}</p>
            <p className="text-xs text-gray-400">{startTime}</p>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "super_admin" || role === "pastor") && (
              <>
                <FormContainer table="service" type="update" data={item} />
                <FormContainer table="service" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.ServiceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "ministryId":
            query.ministryId = parseInt(value);
            break;
          case "cellGroupId":
            query.cellGroupId = parseInt(value);
            break;
          case "pastorId":
            query.pastorId = value;
            break;
          case "dayOfWeek":
            query.dayOfWeek = value as any;
            break;
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { location: { contains: value, mode: "insensitive" } },
              { ministry: { name: { contains: value, mode: "insensitive" } } },
              { cellGroup: { name: { contains: value, mode: "insensitive" } } },
              { pastor: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.service.findMany({
      where: query,
      include: {
        ministry: { select: { name: true } },
        cellGroup: { select: { name: true } },
        pastor: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        startTime: 'asc',
      },
    }),
    prisma.service.count({ where: query }),
  ]);

  // Get counts for badges
  const totalServices = await prisma.service.count();
  const sundayServices = await prisma.service.count({
    where: { dayOfWeek: "SUNDAY" },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="hidden md:block text-lg font-semibold text-gray-700">
            Church Services
          </h1>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Total: {totalServices}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Sunday: {sundayServices}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {(role === "admin" || role === "super_admin" || role === "pastor") && (
              <FormContainer table="service" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ServiceListPage;
