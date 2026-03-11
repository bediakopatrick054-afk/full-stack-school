"use client";

import {
  deletePastor,
  deleteMember,
  deleteFamilyHead,
  deleteMinistry,
  deleteCellGroup,
  deleteService,
  deleteContribution,
  deleteEvent,
  deletePrayerRequest,
  deleteAnnouncement,
  deleteAttendance,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  pastor: deletePastor,
  member: deleteMember,
  familyHead: deleteFamilyHead,
  ministry: deleteMinistry,
  cellGroup: deleteCellGroup,
  service: deleteService,
  contribution: deleteContribution,
  event: deleteEvent,
  prayerRequest: deletePrayerRequest,
  announcement: deleteAnnouncement,
  attendance: deleteAttendance,
};

// LAZY LOADING FOR CHURCH FORMS
const PastorForm = dynamic(() => import("./forms/PastorForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MemberForm = dynamic(() => import("./forms/MemberForm"), {
  loading: () => <h1>Loading...</h1>,
});
const FamilyHeadForm = dynamic(() => import("./forms/FamilyHeadForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MinistryForm = dynamic(() => import("./forms/MinistryForm"), {
  loading: () => <h1>Loading...</h1>,
});
const CellGroupForm = dynamic(() => import("./forms/CellGroupForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ServiceForm = dynamic(() => import("./forms/ServiceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ContributionForm = dynamic(() => import("./forms/ContributionForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const PrayerRequestForm = dynamic(() => import("./forms/PrayerRequestForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  pastor: (setOpen, type, data, relatedData) => (
    <PastorForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  member: (setOpen, type, data, relatedData) => (
    <MemberForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  familyHead: (setOpen, type, data, relatedData) => (
    <FamilyHeadForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  ministry: (setOpen, type, data, relatedData) => (
    <MinistryForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  cellGroup: (setOpen, type, data, relatedData) => (
    <CellGroupForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  service: (setOpen, type, data, relatedData) => (
    <ServiceForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  contribution: (setOpen, type, data, relatedData) => (
    <ContributionForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  prayerRequest: (setOpen, type, data, relatedData) => (
    <PrayerRequestForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <AttendanceForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast.success(`${table} has been deleted successfully!`);
        setOpen(false);
        router.refresh();
      } else if (state.error) {
        toast.error(`Error deleting ${table}. Please try again.`);
      }
    }, [state, router, table]);

    // Get display name for the delete confirmation
    const getDisplayName = () => {
      switch(table) {
        case "pastor": return "Pastor";
        case "member": return "Member";
        case "familyHead": return "Family Head";
        case "ministry": return "Ministry";
        case "cellGroup": return "Cell Group";
        case "service": return "Service";
        case "contribution": return "Contribution";
        case "event": return "Event";
        case "prayerRequest": return "Prayer Request";
        case "announcement": return "Announcement";
        case "attendance": return "Attendance Record";
        default: return table;
      }
    };

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <div className="text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <span className="font-medium text-gray-700">
            Are you sure you want to delete this {getDisplayName()}?
          </span>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>
        <button className="bg-red-600 text-white py-2 px-6 rounded-md border-none w-max self-center hover:bg-red-700 transition-colors">
          Confirm Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? (
        forms[table](setOpen, type, data, relatedData)
      ) : (
        <div className="p-4 text-center text-red-500">
          Form for {table} not found!
        </div>
      )
    ) : (
      <div className="p-4 text-center text-gray-500">Invalid form type!</div>
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor} hover:opacity-80 transition-opacity`}
        onClick={() => setOpen(true)}
        title={`${type} ${table}`}
      >
        <Image src={`/${type}.png`} alt={type} width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-md relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <Form />
            <button
              className="absolute top-4 right-4 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
