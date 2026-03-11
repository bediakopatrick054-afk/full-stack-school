"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { pastorSchema, PastorSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createPastor, updatePastor } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const PastorForm = ({
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
  } = useForm<PastorSchema>({
    resolver: zodResolver(pastorSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createPastor : updatePastor,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Submitting pastor data:", data);
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Pastor has been ${type === "create" ? "added" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { ministries, cellGroups } = relatedData;

  // Ordination years for dropdown
  const currentYear = new Date().getFullYear();
  const ordinationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-gray-700 border-b pb-2">
        {type === "create" ? "Add New Pastor" : "Update Pastor Information"}
      </h1>

      {/* Authentication Information */}
      <div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
          Account Information
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
          placeholder="Choose a username"
          required
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
          placeholder="pastor@floodoflife.org"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
          placeholder={type === "create" ? "Create password" : "Leave blank to keep current"}
        />
      </div>

      {/* Personal Information */}
      <div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
          Personal Information
        </span>
      </div>

      {/* Photo Upload */}
      <CldUploadWidget
        uploadPreset="church"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors"
              onClick={() => open()}
            >
              <Image src="/upload.png" alt="Upload" width={28} height={28} />
              <span>{img ? "Change photo" : "Upload a profile photo"}</span>
              {img && <span className="text-green-600">✓ Uploaded</span>}
            </div>
          );
        }}
      </CldUploadWidget>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          required
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
          required
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
          placeholder="+233 XX XXX XXXX"
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
          required
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
          placeholder="e.g., O+, A-"
          required
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday?.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
          required
        />

        {/* Gender */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("gender")}
            defaultValue={data?.gender}
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>
          )}
        </div>

        {/* Role/Position */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600">Role</label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("role")}
            defaultValue={data?.role || "PASTOR"}
          >
            <option value="PASTOR">Pastor</option>
            <option value="MINISTRY_LEADER">Ministry Leader</option>
            <option value="CELL_LEADER">Cell Group Leader</option>
          </select>
        </div>

        {/* Ordination Date */}
        <InputField
          label="Ordination Date"
          name="ordinationDate"
          defaultValue={data?.ordinationDate?.toISOString().split("T")[0]}
          register={register}
          error={errors.ordinationDate}
          type="date"
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

        {/* Ministries (multiple select) */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Ministries
            <span className="text-gray-400 font-normal text-xs">(Hold Ctrl/Cmd to select multiple)</span>
          </label>
          <select
            multiple
            size={4}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("ministryIds")}
            defaultValue={data?.ministries?.map((m: any) => m.id.toString())}
          >
            {ministries?.map((ministry: { id: number; name: string }) => (
              <option value={ministry.id} key={ministry.id} className="py-1">
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cell Groups (multiple select) */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            Cell Groups
            <span className="text-gray-400 font-normal text-xs">(Hold Ctrl/Cmd to select multiple)</span>
          </label>
          <select
            multiple
            size={4}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("cellGroupIds")}
            defaultValue={data?.cellGroups?.map((c: any) => c.id.toString())}
          >
            {cellGroups?.map((group: { id: number; name: string }) => (
              <option value={group.id} key={group.id} className="py-1">
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pastoral Note */}
      <div className="bg-purple-50 p-3 rounded-md">
        <p className="text-xs text-purple-600 flex items-center gap-2">
          <span>🙏</span>
          <span>Pastors and leaders are shepherds of God's flock. Their dedication helps the church grow spiritually.</span>
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
        {type === "create" ? "Add Pastor" : "Update Pastor"}
      </button>
    </form>
  );
};

export default PastorForm;
