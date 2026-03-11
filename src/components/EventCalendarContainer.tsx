import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  
  return (
    <div className="bg-white p-4 rounded-md">
      {/* Calendar Section */}
      <EventCalendar />
      
      {/* Events Header */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-xl font-semibold">Church Events</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      
      {/* Events List */}
      <div className="flex flex-col gap-4 mt-2">
        <EventList dateParam={date} />
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Sunday Service
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Bible Study
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Prayer Meeting
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendarContainer;
