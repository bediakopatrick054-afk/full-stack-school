import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Contribution, Fund, Member, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ContributionList = Contribution & {
  member: Member;
  fund: Fund | null;
};

const ContributionListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Member Name",
      accessor: "member",
    },
    {
      header: "Contribution Type",
      accessor: "type",
      className: "hidden md:table-cell",
    },
    {
      header: "Amount",
      accessor: "amount",
      className: "hidden md:table-cell",
    },
    {
      header: "Fund",
      accessor: "fund",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    {
      header: "Receipt",
      accessor: "receipt",
      className: "hidden xl:table-cell",
    },
    ...(role === "admin" || role === "super_admin" || role === "financeLeader"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ContributionList) => {
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: item.currency || 'GHS',
        minimumFractionDigits: 2,
      }).format(amount);
    };

    // Format contribution type
    const formatType = (type: string) => {
      return type.split('_').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ');
    };

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50 transition-colors"
      >
        <td className="p-4">
          <div>
            <p className="font-medium">{item.member.firstName} {item.member.lastName}</p>
            <p className="text-xs text-gray-400 md:hidden mt-1">
              {formatType(item.type)} • {formatCurrency(item.amount)}
            </p>
          </div>
        </td>
        <td className="hidden md:table-cell">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.type === "TITHE" ? "bg-green-100 text-green-700" :
            item.type === "OFFERING" ? "bg-blue-100 text-blue-700" :
            item.type === "MISSION" ? "bg-purple-100 text-purple-700" :
            item.type === "BUILDING_FUND" ? "bg-orange-100 text-orange-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {formatType(item.type)}
          </span>
        </td>
        <td className="hidden md:table-cell font-medium">
          {formatCurrency(item.amount)}
        </td>
        <td className="hidden lg:table-cell">
          {item.fund?.name || "—"}
        </td>
        <td className="hidden lg:table-cell">
          {new Intl.DateTimeFormat("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).format(item.date)}
        </td>
        <td className="hidden xl:table-cell">
          {item.receiptNumber ? (
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {item.receiptNumber}
            </span>
          ) : "—"}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "super_admin" || role === "financeLeader") && (
              <>
                <FormContainer table="contribution" type="update" data={item} />
                <FormContainer table="contribution" type="delete" id={item.id} />
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
  const query: Prisma.ContributionWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "memberId":
            query.memberId = value;
            break;
          case "fundId":
            query.fundId = parseInt(value);
            break;
          case "type":
            query.type = value as any;
            break;
          case "startDate":
            query.date = { gte: new Date(value) };
            break;
          case "endDate":
            query.date = { ...(query.date as any), lte: new Date(value) };
            break;
          case "search":
            query.OR = [
              { member: { firstName: { contains: value, mode: "insensitive" } } },
              { member: { lastName: { contains: value, mode: "insensitive" } } },
              { receiptNumber: { contains: value, mode: "insensitive" } },
              { fund: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
    case "super_admin":
    case "financeLeader":
      // Can see all contributions
      break;
    case "pastor":
      // Pastors can see all contributions but maybe limited view
      break;
    case "member":
      // Members can only see their own contributions
      query.memberId = currentUserId!;
      break;
    case "familyHead":
      // Family heads can see contributions from their family members
      query.member = {
        family: {
          members: {
            some: {
              id: currentUserId!
            }
          }
        }
      };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.contribution.findMany({
      where: query,
      include: {
        member: { 
          select: { 
            firstName: true, 
            lastName: true,
            memberNumber: true 
          } 
        },
        fund: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        date: 'desc',
      },
    }),
    prisma.contribution.count({ where: query }),
  ]);

  // Calculate totals for summary
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const titheTotal = data.filter(item => item.type === "TITHE").reduce((sum, item) => sum + item.amount, 0);
  const offeringTotal = data.filter(item => item.type === "OFFERING").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="hidden md:block text-lg font-semibold text-gray-700">
            Contributions & Offerings
          </h1>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Total: {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(totalAmount)}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {data.length} Transactions
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
            {(role === "admin" || role === "super_admin" || role === "financeLeader") && (
              <FormContainer table="contribution" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards (visible on larger screens) */}
      <div className="hidden md:grid grid-cols-3 gap-4 my-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Tithes</p>
          <p className="text-lg font-bold text-green-600">
            {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(titheTotal)}
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Offerings</p>
          <p className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(offeringTotal)}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Other</p>
          <p className="text-lg font-bold text-purple-600">
            {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(totalAmount - titheTotal - offeringTotal)}
          </p>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ContributionListPage;
