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
  churchEvents: { 
    title: string; 
    start: Date; 
    end: Date; 
    type?: string; 
    location?: string;
    ministry?: string;
    leader?: string;
  }[]
): { 
  title: string; 
  start: Date; 
  end: Date; 
  type?: string; 
  location?: string;
  ministry?: string;
  leader?: string;
}[] => {
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
      ...(event.ministry && { ministry: event.ministry }),
      ...(event.leader && { leader: event.leader }),
    };
  });
};

// Helper function to format event type for display with church-appropriate styling
export const getEventTypeColor = (type?: string): string => {
  switch (type) {
    case "SUNDAY_SERVICE":
      return "bg-purple-100 text-purple-800 border-l-4 border-purple-600";
    case "BIBLE_STUDY":
      return "bg-blue-100 text-blue-800 border-l-4 border-blue-600";
    case "PRAYER_MEETING":
      return "bg-green-100 text-green-800 border-l-4 border-green-600";
    case "CELL_MEETING":
      return "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600";
    case "CONFERENCE":
      return "bg-red-100 text-red-800 border-l-4 border-red-600";
    case "OUTREACH":
      return "bg-orange-100 text-orange-800 border-l-4 border-orange-600";
    case "WEDDING":
      return "bg-pink-100 text-pink-800 border-l-4 border-pink-600";
    case "BAPTISM":
      return "bg-indigo-100 text-indigo-800 border-l-4 border-indigo-600";
    case "DEDICATION":
      return "bg-teal-100 text-teal-800 border-l-4 border-teal-600";
    case "FELLOWSHIP":
      return "bg-amber-100 text-amber-800 border-l-4 border-amber-600";
    case "CHOIR_PRACTICE":
      return "bg-cyan-100 text-cyan-800 border-l-4 border-cyan-600";
    case "COUNSELING":
      return "bg-emerald-100 text-emerald-800 border-l-4 border-emerald-600";
    case "MEN'S_FELLOWSHIP":
      return "bg-slate-100 text-slate-800 border-l-4 border-slate-600";
    case "WOMEN'S_FELLOWSHIP":
      return "bg-rose-100 text-rose-800 border-l-4 border-rose-600";
    case "YOUTH_SERVICE":
      return "bg-violet-100 text-violet-800 border-l-4 border-violet-600";
    case "CHILDREN'S_CHURCH":
      return "bg-fuchsia-100 text-fuchsia-800 border-l-4 border-fuchsia-600";
    default:
      return "bg-gray-100 text-gray-800 border-l-4 border-gray-600";
  }
};

// Helper function to get event type icon
export const getEventTypeIcon = (type?: string): string => {
  switch (type) {
    case "SUNDAY_SERVICE":
      return "⛪";
    case "BIBLE_STUDY":
      return "📖";
    case "PRAYER_MEETING":
      return "🙏";
    case "CELL_MEETING":
      return "👥";
    case "CONFERENCE":
      return "🎤";
    case "OUTREACH":
      return "🤝";
    case "WEDDING":
      return "💒";
    case "BAPTISM":
      return "💧";
    case "DEDICATION":
      return "👶";
    case "FELLOWSHIP":
      return "🍽️";
    case "CHOIR_PRACTICE":
      return "🎵";
    case "COUNSELING":
      return "💬";
    case "MEN'S_FELLOWSHIP":
      return "👨";
    case "WOMEN'S_FELLOWSHIP":
      return "👩";
    case "YOUTH_SERVICE":
      return "🔥";
    case "CHILDREN'S_CHURCH":
      return "🧸";
    default:
      return "📅";
  }
};

// Helper function to get church events for a specific date
export const getEventsForDate = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[],
  date: Date
): { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[] => {
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
  events: { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[],
  daysAhead: number = 7
): { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  futureDate.setHours(23, 59, 59, 999);

  return events
    .filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= today && eventDate <= futureDate;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Helper function to group events by day
export const groupEventsByDay = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[]
): Map<string, { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[]> => {
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

// Helper function to get events by ministry
export const getEventsByMinistry = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[],
  ministry: string
): { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[] => {
  return events
    .filter((event) => event.ministry === ministry)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Helper function to get events by leader
export const getEventsByLeader = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[],
  leader: string
): { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[] => {
  return events
    .filter((event) => event.leader === leader)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Helper function to check for scheduling conflicts
export const checkScheduleConflicts = (
  events: { title: string; start: Date; end: Date; type?: string; location?: string; ministry?: string; leader?: string }[],
  newEvent: { start: Date; end: Date }
): { conflict: boolean; conflictingEvents: { title: string; start: Date; end: Date }[] } => {
  const conflictingEvents = events.filter((event) => {
    return (
      (newEvent.start >= event.start && newEvent.start < event.end) ||
      (newEvent.end > event.start && newEvent.end <= event.end) ||
      (newEvent.start <= event.start && newEvent.end >= event.end)
    );
  });

  return {
    conflict: conflictingEvents.length > 0,
    conflictingEvents: conflictingEvents.map(({ title, start, end }) => ({ title, start, end }))
  };
};

// Helper function to format event time
export const formatEventTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Helper function to check if an event is happening now
export const isEventHappeningNow = (event: { start: Date; end: Date }): boolean => {
  const now = new Date();
  return now >= event.start && now <= event.end;
};

// Helper function to get next service time
export const getNextServiceTime = (
  events: { title: string; start: Date; end: Date; type?: string }[]
): { title: string; start: Date; type: string } | null => {
  const now = new Date();
  const upcomingServices = events
    .filter(event => 
      event.start > now && 
      (event.type === "SUNDAY_SERVICE" || event.type === "BIBLE_STUDY" || event.type === "PRAYER_MEETING")
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return upcomingServices.length > 0 
    ? { title: upcomingServices[0].title, start: upcomingServices[0].start, type: upcomingServices[0].type || "SERVICE" }
    : null;
};
