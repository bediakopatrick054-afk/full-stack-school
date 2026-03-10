import { z } from "zod";

// MINISTRY SCHEMA (formerly SUBJECT)
export const ministrySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Ministry name is required!" }),
  description: z.string().optional(),
  meetingSchedule: z.string().optional(),
  meetingLocation: z.string().optional(),
  leaderId: z.string().optional(),
  memberIds: z.array(z.string()).optional(), // member ids
});

export type MinistrySchema = z.infer<typeof ministrySchema>;

// CELL GROUP SCHEMA (formerly CLASS)
export const cellGroupSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Cell group name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
  levelId: z.coerce.number().min(1, { message: "Membership level is required!" }),
  leaderId: z.string().optional(),
  meetingDay: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]).optional(),
  meetingTime: z.coerce.date().optional(),
  location: z.string().optional(),
});

export type CellGroupSchema = z.infer<typeof cellGroupSchema>;

// PASTOR SCHEMA (formerly TEACHER)
export const pastorSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required!" }),
  ordinationDate: z.coerce.date().optional(),
  role: z.enum(["PASTOR", "MINISTRY_LEADER", "CELL_LEADER"], { message: "Role is required!" }).default("PASTOR"),
  ministryIds: z.array(z.string()).optional(),
  cellGroupIds: z.array(z.string()).optional(),
});

export type PastorSchema = z.infer<typeof pastorSchema>;

// MEMBER SCHEMA (formerly STUDENT)
export const memberSchema = z.object({
  id: z.string().optional(),
  memberNumber: z.string().min(1, { message: "Member number is required!" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  profileImg: z.string().optional(),
  dateOfBirth: z.coerce.date({ message: "Date of birth is required!" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required!" }),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"], { 
    message: "Marital status is required!" 
  }).default("SINGLE"),
  occupation: z.string().optional(),
  baptismDate: z.coerce.date().optional(),
  baptismChurch: z.string().optional(),
  joinDate: z.coerce.date().default(() => new Date()),
  membershipStatus: z.enum(["ACTIVE", "INACTIVE", "TRANSFERRED", "DECEASED"], {
    message: "Membership status is required!"
  }).default("ACTIVE"),
  familyId: z.string().optional(),
  spouseId: z.string().optional(),
  ministryId: z.coerce.number().optional(),
  skills: z.array(z.string()).optional(),
});

export type MemberSchema = z.infer<typeof memberSchema>;

// SERVICE SCHEMA (formerly EXAM)
export const serviceSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Service name is required!" }),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], {
    message: "Day of week is required!"
  }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  location: z.string().min(1, { message: "Location is required!" }),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

// CONTRIBUTION SCHEMA (new)
export const contributionSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().min(1, { message: "Member is required!" }),
  type: z.enum(["TITHE", "OFFERING", "FIRST_FRUITS", "VOW", "DONATION", "MISSION", "BUILDING_FUND", "THANKSGIVING"], {
    message: "Contribution type is required!"
  }),
  amount: z.coerce.number().min(1, { message: "Amount must be greater than 0!" }),
  currency: z.string().default("GHS"),
  paymentMethod: z.enum(["CASH", "CHECK", "BANK_TRANSFER", "MOBILE_MONEY", "CARD"], {
    message: "Payment method is required!"
  }),
  description: z.string().optional(),
  date: z.coerce.date().default(() => new Date()),
  receiptNumber: z.string().optional(),
  fundId: z.coerce.number().optional(),
});

export type ContributionSchema = z.infer<typeof contributionSchema>;

// EVENT SCHEMA (enhanced)
export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Event title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  eventType: z.enum(["SUNDAY_SERVICE", "BIBLE_STUDY", "PRAYER_MEETING", "CELL_MEETING", "CONFERENCE", "OUTREACH", "WEDDING", "FUNERAL", "BAPTISM", "DEDICATION"], {
    message: "Event type is required!"
  }),
  startDate: z.coerce.date({ message: "Start date is required!" }),
  endDate: z.coerce.date({ message: "End date is required!" }),
  location: z.string().min(1, { message: "Location is required!" }),
  organizerId: z.string().optional(),
  cellGroupId: z.coerce.number().optional(),
  ministryId: z.coerce.number().optional(),
  expectedAttendees: z.coerce.number().optional(),
  budget: z.coerce.number().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

// PRAYER REQUEST SCHEMA (new)
export const prayerRequestSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().min(1, { message: "Member is required!" }),
  title: z.string().min(1, { message: "Prayer request title is required!" }),
  description: z.string().min(1, { message: "Prayer request description is required!" }),
  isPublic: z.boolean().default(false),
  status: z.enum(["PENDING", "ANSWERED", "IN_PROGRESS"], {
    message: "Status is required!"
  }).default("PENDING"),
  testimony: z.string().optional(),
});

export type PrayerRequestSchema = z.infer<typeof prayerRequestSchema>;

// FAMILY SCHEMA (new)
export const familySchema = z.object({
  id: z.string().optional(),
  familyName: z.string().min(1, { message: "Family name is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  homePhone: z.string().optional(),
  headOfFamily: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
});

export type FamilySchema = z.infer<typeof familySchema>;

// MEMBERSHIP LEVEL SCHEMA (formerly GRADE)
export const membershipLevelSchema = z.object({
  id: z.coerce.number().optional(),
  level: z.coerce.number().min(1, { message: "Level number is required!" }),
  name: z.string().min(1, { message: "Level name is required!" }),
  description: z.string().optional(),
});

export type MembershipLevelSchema = z.infer<typeof membershipLevelSchema>;

// ANNOUNCEMENT SCHEMA
export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Announcement title is required!" }),
  content: z.string().min(1, { message: "Content is required!" }),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"], {
    message: "Priority is required!"
  }).default("NORMAL"),
  createdBy: z.string().min(1, { message: "Creator is required!" }),
  targetAudience: z.enum(["EVERYONE", "MEMBERS_ONLY", "CELL_GROUP", "MINISTRY", "LEADERSHIP"], {
    message: "Target audience is required!"
  }).default("EVERYONE"),
  cellGroupId: z.coerce.number().optional(),
  ministryId: z.coerce.number().optional(),
  startDate: z.coerce.date().default(() => new Date()),
  endDate: z.coerce.date().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

// ATTENDANCE SCHEMA
export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  memberId: z.string().min(1, { message: "Member is required!" }),
  serviceId: z.coerce.number().min(1, { message: "Service is required!" }),
  date: z.coerce.date().default(() => new Date()),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"], {
    message: "Attendance status is required!"
  }).default("PRESENT"),
  notes: z.string().optional(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;
