"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import Image from "next/image";

const localizer = momentLocalizer(moment);

// Custom event component to display church event types with icons
const EventComponent = ({ event }: { event: any }) => {
  const getEventIcon = (type?: string) => {
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
      case "PRAYER_REQUEST":
        return "🙏";
      default:
        return "📅";
    }
  };

  const getEventColor = (type?: string) => {
    switch (type) {
      case "SUNDAY_SERVICE":
        return "bg-purple-100 border-purple-600 text-purple-800";
      case "BIBLE_STUDY":
        return "bg-blue-100 border-blue-600 text-blue-800";
      case "PRAYER_MEETING":
        return "bg-green-100 border-green-600 text-green-800";
      case "CELL_MEETING":
        return "bg-yellow-100 border-yellow-600 text-yellow-800";
      case "CONFERENCE":
        return "bg-red-100 border-red-600 text-red-800";
      case "OUTREACH":
        return "bg-orange-100 border-orange-600 text-orange-800";
      case "WEDDING":
        return "bg-pink-100 border-pink-600 text-pink-800";
      case "BAPTISM":
        return "bg-indigo-100 border-indigo-600 text-indigo-800";
      case "PRAYER_REQUEST":
        return "bg-teal-100 border-teal-600 text-teal-800";
      default:
        return "bg-gray-100 border-gray-600 text-gray-800";
    }
  };

  return (
    <div className={`h-full p-1 rounded border-l-4 ${getEventColor(event.type)}`}>
      <div className="flex items-center gap-1">
        <span className="text-sm">{getEventIcon(event.type)}</span>
        <span className="text-xs font-medium truncate">{event.title}</span>
      </div>
      {event.location && (
        <div className="text-xs text-gray-600 truncate mt-0.5">
          📍 {event.location}
        </div>
      )}
      {event.leader && (
        <div className="text-xs text-gray-600 truncate">
          👤 {event.leader}
        </div>
      )}
    </div>
  );
};

// Custom toolbar component
const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
      <div className="flex gap-2">
        <button
          onClick={goToBack}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
        >
          ←
        </button>
        <button
          onClick={goToToday}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
        >
          Today
        </button>
        <button
          onClick={goToNext}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
        >
          →
        </button>
      </div>
      <h2 className="text-lg font-semibold">
        {moment(toolbar.date).format('MMMM YYYY')}
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => toolbar.onView('month')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'month' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border hover:bg-gray-100'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => toolbar.onView('week')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'week' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border hover:bg-gray-100'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => toolbar.onView('day')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'day' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border hover:bg-gray-100'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => toolbar.onView('agenda')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'agenda' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border hover:bg-gray-100'
          }`}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

const BigCalendar = ({
  data,
  eventType,
}: {
  data: { 
    title: string; 
    start: Date; 
    end: Date; 
    type?: string;
    location?: string;
    leader?: string;
    ministry?: string;
    cellGroup?: string;
    description?: string;
  }[];
  eventType?: string;
}) => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  // Custom day prop getter to highlight Sundays and special days
  const dayPropGetter = (date: Date) => {
    const day = date.getDay();
    const isSunday = day === 0;
    const isToday = moment(date).isSame(moment(), 'day');
    
    if (isSunday) {
      return {
        className: 'sunday-cell',
        style: {
          backgroundColor: '#f3e8ff',
        },
      };
    }
    if (isToday) {
      return {
        className: 'today-cell',
        style: {
          backgroundColor: '#e6f7ff',
        },
      };
    }
    return {};
  };

  // Custom event prop getter
  const eventPropGetter = (event: any) => {
    let className = '';
    switch (event.type) {
      case 'SUNDAY_SERVICE':
        className = 'sunday-service';
        break;
      case 'PRAYER_MEETING':
        className = 'prayer-meeting';
        break;
      case 'BIBLE_STUDY':
        className = 'bible-study';
        break;
      case 'CELL_MEETING':
        className = 'cell-meeting';
        break;
      default:
        className = 'default-event';
    }
    
    return {
      className,
    };
  };

  return (
    <div className="h-full bg-white rounded-lg p-4">
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day", "agenda"]}
        view={view}
        style={{ height: "calc(100% - 20px)" }}
        onView={handleOnChangeView}
        min={new Date(2025, 1, 0, 6, 0, 0)} // Earlier start for morning prayers
        max={new Date(2025, 1, 0, 21, 0, 0)} // Later end for evening services
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventComponent,
          toolbar: CustomToolbar,
        }}
        popup
        selectable
        longPressThreshold={1}
      />
      
      {/* Legend for event types */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-100 border-l-4 border-purple-600 rounded"></div>
          <span>Sunday Service</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 border-l-4 border-blue-600 rounded"></div>
          <span>Bible Study</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border-l-4 border-green-600 rounded"></div>
          <span>Prayer Meeting</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border-l-4 border-yellow-600 rounded"></div>
          <span>Cell Meeting</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border-l-4 border-red-600 rounded"></div>
          <span>Conference</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-teal-100 border-l-4 border-teal-600 rounded"></div>
          <span>Prayer Request</span>
        </div>
      </div>
    </div>
  );
};

export default BigCalendar;
