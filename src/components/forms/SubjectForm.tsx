"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { ministrySchema, MinistrySchema } from "@/lib/formValidationSchemas";
import { createMinistry, updateMinistry } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MinistryForm = ({
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
  } = useForm<MinistrySchema>({
    resolver: zodResolver(ministrySchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createMinistry : updateMinistry,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Submitting ministry data:", data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Ministry has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { leaders, members } = relatedData;

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-gray-700 border-b pb-2">
        {type === "create" ? "Create New Ministry" : "Update Ministry Details"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ministry Name */}
        <InputField
          label="Ministry Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
          placeholder="e.g., Worship Ministry, Prayer Ministry"
          required
        />

        {/* Description */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <textarea
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none min-h-[80px]"
            {...register("description")}
            defaultValue={data?.description}
            placeholder="Describe the purpose and activities of this ministry..."
          />
          {errors.description?.message && (
            <p className="text-xs text-red-400">{errors.description.message.toString()}</p>
          )}
        </div>

        {/* Meeting Schedule */}
        <InputField
          label="Meeting Schedule"
          name="meetingSchedule"
          defaultValue={data?.meetingSchedule}
          register={register}
          error={errors?.meetingSchedule}
          placeholder="e.g., Every Sunday 9AM, Every Wednesday 7PM"
        />

        {/* Meeting Location */}
        <InputField
          label="Meeting Location"
          name="meetingLocation"
          defaultValue={data?.meetingLocation}
          register={register}
          error={errors?.meetingLocation}
          placeholder="e.g., Room 101, Fellowship Hall"
        />

        {/* Hidden ID for updates */}
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

        {/* Ministry Leader (formerly Teacher) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Ministry Leader
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("leaderId")}
            defaultValue={data?.leaderId}
          >
            <option value="">Select a leader (optional)</option>
            {leaders?.map((leader: { id: string; name: string; surname: string }) => (
              <option value={leader.id} key={leader.id}>
                {leader.name} {leader.surname}
              </option>
            ))}
          </select>
          {errors.leaderId?.message && (
            <p className="text-xs text-red-400">{errors.leaderId.message.toString()}</p>
          )}
        </div>

        {/* Ministry Members (multiple select) */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Ministry Members
            <span className="text-gray-400 font-normal text-xs">(Hold Ctrl/Cmd to select multiple)</span>
          </label>
          <select
            multiple
            size={5}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("memberIds")}
            defaultValue={data?.members?.map((m: any) => m.id)}
          >
            {members?.map((member: { id: string; firstName: string; lastName: string }) => (
              <option value={member.id} key={member.id} className="py-1">
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
          {errors.memberIds?.message && (
            <p className="text-xs text-red-400">{errors.memberIds.message.toString()}</p>
          )}
        </div>
      </div>

      {/* Ministry Info Note */}
      <div className="bg-purple-50 p-3 rounded-md">
        <p className="text-xs text-purple-600 flex items-center gap-2">
          <span>🙏</span>
          <span>Ministries are the heartbeat of our church. Each ministry serves a unique purpose in building the body of Christ.</span>
        </p>
      </div>

      {state.error && (
        <div className="bg-red-50 p-3 rounded-md">
          <span className="text-sm text-red-500">
            Something went wrong! Please check all fields and try again.
          </span>
        </div>
      )}

      <button className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium self-end w-full md:w-auto">
        {type === "create" ? "Create Ministry" : "Update Ministry"}
      </button>
    </form>
  );
};

export default MinistryForm;
