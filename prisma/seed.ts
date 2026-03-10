import { Day, PrismaClient, Gender, MaritalStatus, Role, Status, ContributionType, PaymentMethod, AttendanceStatus, EventType, PrayerStatus, Audience, DayOfWeek, Priority } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // GRADE (Converted to MEMBERSHIP LEVELS)
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS (Converted to CELL GROUPS)
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `Cell Group ${i}A`, 
        gradeId: i, 
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT (Converted to MINISTRIES)
  const subjectData = [
    { name: "Worship Ministry" },
    { name: "Prayer Ministry" },
    { name: "Evangelism Ministry" },
    { name: "Children's Ministry" },
    { name: "Youth Ministry" },
    { name: "Media Ministry" },
    { name: "Ushering Ministry" },
    { name: "Hospitality Ministry" },
    { name: "Counseling Ministry" },
    { name: "Intercessory Ministry" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER (Converted to PASTORS/MINISTRY LEADERS)
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `pastor${i}`,
        username: `pastor${i}`,
        name: `Pastor${i}`,
        surname: `LastName${i}`,
        email: `pastor${i}@floodoflife.org`,
        phone: `233-${i.toString().padStart(9, '0')}`,
        address: `P.O. Box ${i}, Accra`,
        bloodType: "O+",
        sex: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] }, 
        classes: { connect: [{ id: (i % 6) + 1 }] }, 
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 35)),
      },
    });
  }

  // LESSON (Converted to SERVICE SCHEDULES)
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Service ${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: new Date(new Date().setHours(9, 0)), 
        endTime: new Date(new Date().setHours(11, 0)), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `pastor${(i % 15) + 1}`, 
      },
    });
  }

  // PARENT (Converted to FAMILY HEADS)
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `familyHead${i}`,
        username: `familyHead${i}`,
        name: `FamilyHead${i}`,
        surname: `Surname${i}`,
        email: `family${i}@floodoflife.org`,
        phone: `233-55-${i.toString().padStart(6, '0')}`,
        address: `Family Address ${i}, Accra`,
      },
    });
  }

  // STUDENT (Converted to CHURCH MEMBERS)
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `member${i}`, 
        username: `member${i}`, 
        name: `Member${i}`,
        surname: `Surname${i}`,
        email: `member${i}@floodoflife.org`,
        phone: `233-54-${i.toString().padStart(6, '0')}`,
        address: `Member Address ${i}, Accra`,
        bloodType: "O-",
        sex: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        parentId: `familyHead${Math.ceil(i / 2) % 25 || 25}`, 
        gradeId: (i % 6) + 1, 
        classId: (i % 6) + 1, 
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 25)),
      },
    });
  }

  // EXAM (Converted to SOUL WINNING TARGETS)
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Soul Winning Target ${i}`, 
        startTime: new Date(new Date().setDate(new Date().getDate() + 1)), 
        endTime: new Date(new Date().setDate(new Date().getDate() + 30)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // ASSIGNMENT (Converted to OUTREACH PROGRAMS)
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Outreach Program ${i}`, 
        startDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // RESULT (Converted to SOULS WON RECORDS)
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 5, 
        studentId: `member${i}`, 
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
      },
    });
  }

  // ATTENDANCE (Converted to CHURCH SERVICE ATTENDANCE)
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `member${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // EVENT (Converted to CHURCH EVENTS)
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Flood of Life Event ${i}`, 
        description: `Description for Flood of Life Event ${i}`, 
        startTime: new Date(new Date().setDate(new Date().getDate() + 7)), 
        endTime: new Date(new Date().setDate(new Date().getDate() + 8)), 
        classId: (i % 5) + 1, 
      },
    });
  }

  // ANNOUNCEMENT (Converted to CHURCH ANNOUNCEMENTS)
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Flood of Life Announcement ${i}`, 
        description: `Description for Flood of Life Announcement ${i}`, 
        date: new Date(), 
        classId: (i % 5) + 1, 
      },
    });
  }

  console.log("Flood of Life Embassy Church Management System seeding completed successfully.");
  console.log("✅ Welcome to the House of God!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
