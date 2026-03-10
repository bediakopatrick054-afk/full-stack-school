"use server";

import { revalidatePath } from "next/cache";
import {
  MinistrySchema,
  ServiceSchema,
  MemberSchema,
  PastorSchema,
  CellGroupSchema,
  ContributionSchema,
  EventSchema,
  PrayerRequestSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

// MINISTRY ACTIONS (formerly SUBJECT)
export const createMinistry = async (
  currentState: CurrentState,
  data: MinistrySchema
) => {
  try {
    await prisma.ministry.create({
      data: {
        name: data.name,
        description: data.description,
        meetingSchedule: data.meetingSchedule,
        meetingLocation: data.meetingLocation,
        leader: data.leaderId ? {
          connect: { id: data.leaderId }
        } : undefined,
        members: {
          connect: data.memberIds?.map((memberId) => ({ id: memberId })),
        },
      },
    });

    revalidatePath("/ministries");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateMinistry = async (
  currentState: CurrentState,
  data: MinistrySchema
) => {
  try {
    await prisma.ministry.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        meetingSchedule: data.meetingSchedule,
        meetingLocation: data.meetingLocation,
        leader: data.leaderId ? {
          connect: { id: data.leaderId }
        } : { disconnect: true },
        members: {
          set: data.memberIds?.map((memberId) => ({ id: memberId })),
        },
      },
    });

    revalidatePath("/ministries");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteMinistry = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.ministry.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/ministries");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// CELL GROUP ACTIONS (formerly CLASS)
export const createCellGroup = async (
  currentState: CurrentState,
  data: CellGroupSchema
) => {
  try {
    await prisma.cellGroup.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        meetingDay: data.meetingDay,
        meetingTime: data.meetingTime,
        location: data.location,
        levelId: data.levelId,
        leaderId: data.leaderId,
      },
    });

    revalidatePath("/cell-groups");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateCellGroup = async (
  currentState: CurrentState,
  data: CellGroupSchema
) => {
  try {
    await prisma.cellGroup.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        capacity: data.capacity,
        meetingDay: data.meetingDay,
        meetingTime: data.meetingTime,
        location: data.location,
        levelId: data.levelId,
        leaderId: data.leaderId,
      },
    });

    revalidatePath("/cell-groups");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteCellGroup = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.cellGroup.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/cell-groups");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// PASTOR ACTIONS (formerly TEACHER)
export const createPastor = async (
  currentState: CurrentState,
  data: PastorSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "pastor" }
    });

    await prisma.pastor.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        ordinationDate: data.ordinationDate,
        role: data.role,
        ministries: {
          connect: data.ministryIds?.map((id: string) => ({
            id: parseInt(id),
          })),
        },
        cellGroups: {
          connect: data.cellGroupIds?.map((id: string) => ({
            id: parseInt(id),
          })),
        },
      },
    });

    revalidatePath("/pastors");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updatePastor = async (
  currentState: CurrentState,
  data: PastorSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.pastor.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        ordinationDate: data.ordinationDate,
        role: data.role,
        ministries: {
          set: data.ministryIds?.map((id: string) => ({
            id: parseInt(id),
          })),
        },
        cellGroups: {
          set: data.cellGroupIds?.map((id: string) => ({
            id: parseInt(id),
          })),
        },
      },
    });
    revalidatePath("/pastors");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deletePastor = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.pastor.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/pastors");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// MEMBER ACTIONS (formerly STUDENT)
export const createMember = async (
  currentState: CurrentState,
  data: MemberSchema
) => {
  console.log(data);
  try {
    const cellGroup = await prisma.cellGroup.findUnique({
      where: { id: data.cellGroupId },
      include: { _count: { select: { members: true } } },
    });

    if (cellGroup && cellGroup.capacity === cellGroup._count.members) {
      return { success: false, error: true };
    }

    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: "member" }
    });

    await prisma.member.create({
      data: {
        id: user.id,
        memberNumber: data.memberNumber,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        profileImg: data.profileImg || null,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        occupation: data.occupation,
        baptismDate: data.baptismDate,
        baptismChurch: data.baptismChurch,
        joinDate: data.joinDate,
        membershipStatus: data.membershipStatus,
        familyId: data.familyId,
        spouseId: data.spouseId,
        departmentId: data.ministryId,
        skills: data.skills || [],
      },
    });

    revalidatePath("/members");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateMember = async (
  currentState: CurrentState,
  data: MemberSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });

    await prisma.member.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        memberNumber: data.memberNumber,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        profileImg: data.profileImg || null,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        occupation: data.occupation,
        baptismDate: data.baptismDate,
        baptismChurch: data.baptismChurch,
        joinDate: data.joinDate,
        membershipStatus: data.membershipStatus,
        familyId: data.familyId,
        spouseId: data.spouseId,
        departmentId: data.ministryId,
        skills: data.skills || [],
      },
    });
    revalidatePath("/members");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteMember = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.member.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/members");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// SERVICE ACTIONS (formerly EXAM)
export const createService = async (
  currentState: CurrentState,
  data: ServiceSchema
) => {
  try {
    await prisma.service.create({
      data: {
        name: data.name,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
      },
    });

    revalidatePath("/services");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateService = async (
  currentState: CurrentState,
  data: ServiceSchema
) => {
  try {
    await prisma.service.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
      },
    });

    revalidatePath("/services");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteService = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.service.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/services");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// CONTRIBUTION ACTIONS
export const createContribution = async (
  currentState: CurrentState,
  data: ContributionSchema
) => {
  try {
    await prisma.contribution.create({
      data: {
        memberId: data.memberId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        description: data.description,
        date: data.date,
        receiptNumber: data.receiptNumber,
        fundId: data.fundId,
      },
    });

    // Update fund current amount
    if (data.fundId) {
      await prisma.fund.update({
        where: { id: data.fundId },
        data: {
          currentAmount: {
            increment: data.amount
          }
        }
      });
    }

    revalidatePath("/contributions");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// EVENT ACTIONS
export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        organizerId: data.organizerId,
        cellGroupId: data.cellGroupId,
        ministryId: data.ministryId,
        expectedAttendees: data.expectedAttendees,
        budget: data.budget,
      },
    });

    revalidatePath("/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        organizerId: data.organizerId,
        cellGroupId: data.cellGroupId,
        ministryId: data.ministryId,
        expectedAttendees: data.expectedAttendees,
        budget: data.budget,
      },
    });

    revalidatePath("/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// PRAYER REQUEST ACTIONS
export const createPrayerRequest = async (
  currentState: CurrentState,
  data: PrayerRequestSchema
) => {
  try {
    await prisma.prayerRequest.create({
      data: {
        memberId: data.memberId,
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        status: data.status || "PENDING",
      },
    });

    revalidatePath("/prayer-requests");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updatePrayerRequest = async (
  currentState: CurrentState,
  data: PrayerRequestSchema
) => {
  try {
    await prisma.prayerRequest.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        status: data.status,
        answeredDate: data.status === "ANSWERED" ? new Date() : null,
        testimony: data.testimony,
      },
    });

    revalidatePath("/prayer-requests");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deletePrayerRequest = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.prayerRequest.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/prayer-requests");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
