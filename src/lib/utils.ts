// IT APPEARS THAT BIG CALENDAR SHOWS THE LAST WEEK WHEN THE CURRENT DAY IS A WEEKEND.
// FOR THIS REASON WE'LL GET THE LAST WEEK AS THE REFERENCE WEEK.
// IN THE TUTORIAL WE'RE TAKING THE NEXT WEEK AS THE REFERENCE WEEK.

const getLatestSunday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceSunday = dayOfWeek; // Sunday is 0, Monday is 1, etc.
  const latestSunday = today;
  latestSunday.setDate(today.getDate() - daysSinceSunday);
  return latestSunday;
};

export const adjustScheduleToCurrentWeek = (
  churchEvents: { title: string; start: Date; end: Date; type?: string; location?: string }[]
): { title: string; start: Date; end: Date; type?: string; location?: string }[] => {
  const latestSunday = getLatestSunday();

  return churchEvents.map((event) => {
    const eventDayOfWeek = event.start.getDay();

    const daysFromSunday = eventDayOfWeek; // Sunday is 0, so days from Sunday is the dayOfWeek

    const adjustedStartDate = new Date(latestSunday);

    adjustedStartDate.setDate(latestSunday.getDate() + daysFromSunday);
    adjustedStartDate.setHours(
      event.start.getHours(),
      event.start.getMinutes(),
      event.start.getSeconds()
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      event.end.getHours(),
      event.end.getMinutes(),
      event.end.getSeconds()
    );

    return {
      title: event.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
      ...(event.type && { type: event.type }),
      ...(event.location && { location: event.location }),
    };
  });
};

// Helper function to format event type for display
export const getEventTypeColor = (type?: string): string => {
  switch (type) {
    case "SUNDAY_SERVICE":
      return "bg-purple-100 text-purple-800";
    case "BIBLE_STUDY":
      return "bg-blue-100 text-blue-800";
    case "PRAYER_MEETING":
      return "bg-green-100 text-green-800";
    case "CELL_MEETING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFERENCE":
      return "bg-red-100 text-red-800";
    case "OUTREACH":
      return "bg-orange-100 text-orange-800";
    case "WEDDING":
      return "bg-pink-100 text-pink-800";
    case "BAPTISM":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get church events for a specific date
export const getEventsForDate = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string }[],
  date: Date
): { title: string; start: Date; end: Date; type?: string; location?: string }[] => {
  return events.filter((event) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

// Helper function to get upcoming church events
export const getUpcomingEvents = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string }[],
  daysAhead: number = 7
): { title: string; start: Date; end: Date; type?: string; location?: string }[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);

  return events
    .filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= today && eventDate <= futureDate;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Helper function to group events by day
export const groupEventsByDay = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string }[]
): Map<string, { title: string; start: Date; end: Date; type?: string; location?: string }[]> => {
  const groupedEvents = new Map();

  events.forEach((event) => {
    const dateKey = event.start.toDateString();
    if (!groupedEvents.has(dateKey)) {
      groupedEvents.set(dateKey, []);
    }
    groupedEvents.get(dateKey).push(event);
  });

  return groupedEvents;
};
