"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  cellGroupSchema,
  CellGroupSchema,
} from "@/lib/formValidationSchemas";
import {
  createCellGroup,
  updateCellGroup,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CellGroupForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CellGroupSchema>({
    resolver: zodResolver(cellGroupSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createCellGroup : updateCellGroup,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Cell Group has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { leaders, levels } = relatedData;

  // Days of week for meeting day selection
  const daysOfWeek = [
    "SUNDAY",
    "MONDAY", 
    "TUESDAY", 
    "WEDNESDAY", 
    "THURSDAY", 
    "FRIDAY", 
    "SATURDAY"
  ];

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-gray-700 border-b pb-2">
        {type === "create" ? "Create New Cell Group" : "Update Cell Group"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cell Group Name */}
        <InputField
          label="Cell Group Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
          placeholder="e.g., Cell Group A, Victory Group"
          required
        />

        {/* Capacity */}
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
          placeholder="Maximum members"
          required
        />

        {/* Hidden ID field for updates */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* Meeting Day */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Meeting Day
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("meetingDay")}
            defaultValue={data?.meetingDay}
          >
            <option value="">Select meeting day</option>
            {daysOfWeek.map((day) => (
              <option 
                key={day} 
                value={day}
                selected={data && day === data.meetingDay}
              >
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.meetingDay?.message && (
            <p className="text-xs text-red-400">
              {errors.meetingDay.message.toString()}
            </p>
          )}
        </div>

        {/* Meeting Time */}
        <InputField
          label="Meeting Time"
          name="meetingTime"
          type="time"
          defaultValue={data?.meetingTime ? new Date(data.meetingTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : ""}
          register={register}
          error={errors?.meetingTime}
        />

        {/* Location */}
        <InputField
          label="Meeting Location"
          name="location"
          defaultValue={data?.location}
          register={register}
          error={errors?.location}
          placeholder="e.g., Room 101, Fellowship Hall"
        />

        {/* Cell Group Leader (Supervisor) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Cell Group Leader
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("leaderId")}
            defaultValue={data?.leaderId}
          >
            <option value="">Select a leader</option>
            {leaders?.map((leader: { id: string; name: string; surname: string }) => (
              <option
                value={leader.id}
                key={leader.id}
                selected={data && leader.id === data.leaderId}
              >
                {leader.name} {leader.surname}
              </option>
            ))}
          </select>
          {errors.leaderId?.message && (
            <p className="text-xs text-red-400">
              {errors.leaderId.message.toString()}
            </p>
          )}
        </div>

        {/* Membership Level (Grade) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Membership Level <span className="text-red-500">*</span>
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("levelId")}
            defaultValue={data?.levelId}
          >
            <option value="">Select level</option>
            {levels?.map((level: { id: number; level: number; name: string }) => (
              <option
                value={level.id}
                key={level.id}
                selected={data && level.id === data.levelId}
              >
                Level {level.level}: {level.name}
              </option>
            ))}
          </select>
          {errors.levelId?.message && (
            <p className="text-xs text-red-400">
              {errors.levelId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-purple-50 p-3 rounded-md">
        <p className="text-xs text-purple-600">
          <span className="font-semibold">💡 Note:</span> Cell groups meet regularly for fellowship, prayer, and Bible study. Assign a leader and set a regular meeting time.
        </p>
      </div>

      {state.error && (
        <div className="bg-red-50 p-3 rounded-md">
          <span className="text-sm text-red-500">
            Something went wrong! Please try again.
          </span>
        </div>
      )}

      <button className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium self-end w-full md:w-auto">
        {type === "create" ? "Create Cell Group" : "Update Cell Group"}
      </button>
    </form>
  );
};

export default CellGroupForm;
