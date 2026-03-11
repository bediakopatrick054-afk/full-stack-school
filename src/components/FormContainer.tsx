import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "pastor"
    | "member"
    | "familyHead"
    | "ministry"
    | "cellGroup"
    | "service"
    | "contribution"
    | "event"
    | "prayerRequest"
    | "announcement"
    | "attendance";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "ministry":
        const ministryLeaders = await prisma.pastor.findMany({
          select: { id: true, name: true, surname: true },
        });
        const ministryMembers = await prisma.member.findMany({
          where: { membershipStatus: "ACTIVE" },
          select: { id: true, firstName: true, lastName: true },
        });
        relatedData = { leaders: ministryLeaders, members: ministryMembers };
        break;

      case "cellGroup":
        const cellLevels = await prisma.membershipLevel.findMany({
          select: { id: true, level: true, name: true },
        });
        const cellLeaders = await prisma.pastor.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { levels: cellLevels, leaders: cellLeaders };
        break;

      case "pastor":
        const pastorMinistries = await prisma.ministry.findMany({
          select: { id: true, name: true },
        });
        const pastorCellGroups = await prisma.cellGroup.findMany({
          select: { id: true, name: true },
        });
        relatedData = { ministries: pastorMinistries, cellGroups: pastorCellGroups };
        break;

      case "member":
        const memberFamilies = await prisma.family.findMany({
          select: { id: true, familyName: true },
        });
        const memberMinistries = await prisma.ministry.findMany({
          select: { id: true, name: true },
        });
        const memberCellGroups = await prisma.cellGroup.findMany({
          include: { _count: { select: { members: true } } },
        });
        const memberLevels = await prisma.membershipLevel.findMany({
          select: { id: true, level: true, name: true },
        });
        relatedData = { 
          families: memberFamilies, 
          ministries: memberMinistries,
          cellGroups: memberCellGroups,
          levels: memberLevels
        };
        break;

      case "familyHead":
        const families = await prisma.family.findMany({
          select: { id: true, familyName: true },
        });
        const familyMembers = await prisma.member.findMany({
          where: { membershipStatus: "ACTIVE" },
          select: { id: true, firstName: true, lastName: true },
        });
        relatedData = { families, members: familyMembers };
        break;

      case "contribution":
        const contributionFunds = await prisma.fund.findMany({
          where: { status: "ACTIVE" },
          select: { id: true, name: true },
        });
        const contributionMembers = await prisma.member.findMany({
          where: { membershipStatus: "ACTIVE" },
          select: { id: true, firstName: true, lastName: true, memberNumber: true },
        });
        relatedData = { funds: contributionFunds, members: contributionMembers };
        break;

      case "event":
        const eventOrganizers = await prisma.member.findMany({
          where: { membershipStatus: "ACTIVE" },
          select: { id: true, firstName: true, lastName: true },
        });
        const eventMinistries = await prisma.ministry.findMany({
          select: { id: true, name: true },
        });
        const eventCellGroups = await prisma.cellGroup.findMany({
          select: { id: true, name: true },
        });
        relatedData = { 
          organizers: eventOrganizers, 
          ministries: eventMinistries,
          cellGroups: eventCellGroups 
        };
        break;

      case "prayerRequest":
        const prayerMembers = await prisma.member.findMany({
          where: { membershipStatus: "ACTIVE" },
          select: { id: true, firstName: true, lastName: true },
        });
        relatedData = { members: prayerMembers };
        break;

      case "attendance":
        const attendanceServices = await prisma.service.findMany({
          select: { id: true, name: true, dayOfWeek: true, startTime: true },
        });
        const attendanceMembers = await prisma.member.findMany({
          where: { membershipStatus: "ACTIVE" },
          select: { id: true, firstName: true, lastName: true },
        });
        relatedData = { services: attendanceServices, members: attendanceMembers };
        break;

      case "announcement":
        const announcementCreators = await prisma.member.findMany({
          where: { 
            OR: [
              { membershipStatus: "ACTIVE" },
              { role: { in: ["PASTOR", "MINISTRY_LEADER", "CELL_LEADER"] } }
            ]
          },
          select: { id: true, firstName: true, lastName: true },
        });
        const announcementMinistries = await prisma.ministry.findMany({
          select: { id: true, name: true },
        });
        const announcementCellGroups = await prisma.cellGroup.findMany({
          select: { id: true, name: true },
        });
        relatedData = { 
          creators: announcementCreators,
          ministries: announcementMinistries,
          cellGroups: announcementCellGroups 
        };
        break;

      case "service":
        const servicePastors = await prisma.pastor.findMany({
          select: { id: true, name: true, surname: true },
        });
        const serviceMinistries = await prisma.ministry.findMany({
          select: { id: true, name: true },
        });
        relatedData = { pastors: servicePastors, ministries: serviceMinistries };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
