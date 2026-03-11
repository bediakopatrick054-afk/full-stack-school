"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  serviceSchema,
  ServiceSchema,
} from "@/lib/formValidationSchemas";
import {
  createService,
  updateService,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ServiceForm = ({
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
  } = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createService : updateService,
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
      toast.success(`Service has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { pastors, ministries } = relatedData;

  // Days of week options
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
        {type === "create" ? "Schedule New Church Service" : "Update Service Details"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Name */}
        <InputField
          label="Service Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
          placeholder="e.g., Sunday Morning Service, Bible Study"
          required
        />

        {/* Day of Week */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Day of Week <span className="text-red-500">*</span>
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("dayOfWeek")}
            defaultValue={data?.dayOfWeek}
          >
            <option value="">Select day</option>
            {daysOfWeek.map((day) => (
              <option 
                key={day} 
                value={day}
                selected={data && day === data.dayOfWeek}
              >
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.dayOfWeek?.message && (
            <p className="text-xs text-red-400">
              {errors.dayOfWeek.message.toString()}
            </p>
          )}
        </div>

        {/* Start Time */}
        <InputField
          label="Start Time"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
          required
        />

        {/* End Time */}
        <InputField
          label="End Time"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
          required
        />

        {/* Location */}
        <InputField
          label="Location"
          name="location"
          defaultValue={data?.location}
          register={register}
          error={errors?.location}
          placeholder="e.g., Main Sanctuary, Fellowship Hall"
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

        {/* Officiating Pastor (formerly Lesson) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Officiating Pastor
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("pastorId")}
            defaultValue={data?.pastorId}
          >
            <option value="">Select pastor</option>
            {pastors?.map((pastor: { id: string; name: string; surname: string }) => (
              <option 
                value={pastor.id} 
                key={pastor.id}
                selected={data && pastor.id === data.pastorId}
              >
                {pastor.name} {pastor.surname}
              </option>
            ))}
          </select>
          {errors.pastorId?.message && (
            <p className="text-xs text-red-400">
              {errors.pastorId.message.toString()}
            </p>
          )}
        </div>

        {/* Ministry (optional) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Responsible Ministry
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("ministryId")}
            defaultValue={data?.ministryId}
          >
            <option value="">Select ministry (optional)</option>
            {ministries?.map((ministry: { id: number; name: string }) => (
              <option 
                value={ministry.id} 
                key={ministry.id}
                selected={data && ministry.id === data.ministryId}
              >
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recurring Service Option */}
        <div className="flex items-center gap-2 w-full md:col-span-2">
          <input
            type="checkbox"
            id="recurring"
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-400"
            {...register("recurring")}
            defaultChecked={data?.recurring}
          />
          <label htmlFor="recurring" className="text-sm text-gray-600">
            This is a recurring service (weekly/monthly)
          </label>
        </div>
      </div>

      {/* Service Note */}
      <div className="bg-purple-50 p-3 rounded-md">
        <p className="text-xs text-purple-600 flex items-center gap-2">
          <span>⛪</span>
          <span>Regular services help build church community and spiritual growth.</span>
        </p>
      </div>

      {state.error && (
        <div className="bg-red-50 p-3 rounded-md">
          <span className="text-sm text-red-500">
            Something went wrong! Please check the details and try again.
          </span>
        </div>
      )}

      <button className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium self-end w-full md:w-auto">
        {type === "create" ? "Schedule Service" : "Update Service"}
      </button>
    </form>
  );
};

export default ServiceForm;
