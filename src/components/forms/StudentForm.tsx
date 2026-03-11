"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  memberSchema,
  MemberSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createMember,
  updateMember,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const MemberForm = ({
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
  } = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createMember : updateMember,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Submitting member data:", data);
    formAction({ ...data, profileImg: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Member has been ${type === "create" ? "registered" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { families, ministries, cellGroups, levels } = relatedData;

  // Generate member number suggestion
  const generateMemberNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FLE-${year}-${random}`;
  };

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-gray-700 border-b pb-2">
        {type === "create" ? "Register New Member" : "Update Member Information"}
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
          placeholder="member@example.com"
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
        {/* Member Number (auto-generated for create, editable for update) */}
        {type === "create" ? (
          <InputField
            label="Member Number"
            name="memberNumber"
            defaultValue={generateMemberNumber()}
            register={register}
            error={errors?.memberNumber}
            placeholder="Auto-generated"
            required
          />
        ) : (
          <InputField
            label="Member Number"
            name="memberNumber"
            defaultValue={data?.memberNumber}
            register={register}
            error={errors?.memberNumber}
            disabled
          />
        )}

        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
          required
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
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
          label="Date of Birth"
          name="dateOfBirth"
          defaultValue={data?.dateOfBirth?.toISOString().split("T")[0]}
          register={register}
          error={errors.dateOfBirth}
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

        {/* Marital Status */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600">Marital Status</label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("maritalStatus")}
            defaultValue={data?.maritalStatus || "SINGLE"}
          >
            <option value="SINGLE">Single</option>
            <option value="MARRIED">Married</option>
            <option value="DIVORCED">Divorced</option>
            <option value="WIDOWED">Widowed</option>
            <option value="SEPARATED">Separated</option>
          </select>
        </div>

        <InputField
          label="Occupation"
          name="occupation"
          defaultValue={data?.occupation}
          register={register}
          error={errors.occupation}
          placeholder="e.g., Teacher, Engineer"
        />

        {/* Baptism Date */}
        <InputField
          label="Baptism Date"
          name="baptismDate"
          defaultValue={data?.baptismDate?.toISOString().split("T")[0]}
          register={register}
          error={errors.baptismDate}
          type="date"
        />

        <InputField
          label="Baptism Church"
          name="baptismChurch"
          defaultValue={data?.baptismChurch}
          register={register}
          error={errors.baptismChurch}
          placeholder="Church where baptized"
        />

        {/* Join Date (auto for create) */}
        {type === "create" ? (
          <InputField
            label="Join Date"
            name="joinDate"
            defaultValue={new Date().toISOString().split("T")[0]}
            register={register}
            error={errors.joinDate}
            type="date"
          />
        ) : (
          <InputField
            label="Join Date"
            name="joinDate"
            defaultValue={data?.joinDate?.toISOString().split("T")[0]}
            register={register}
            error={errors.joinDate}
            type="date"
          />
        )}

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

        {/* Family */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600">Family</label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("familyId")}
            defaultValue={data?.familyId}
          >
            <option value="">Select family (optional)</option>
            {families?.map((family: { id: string; familyName: string }) => (
              <option value={family.id} key={family.id}>
                {family.familyName}
              </option>
            ))}
          </select>
        </div>

        {/* Spouse (conditional - show if married) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600">Spouse</label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("spouseId")}
            defaultValue={data?.spouseId}
          >
            <option value="">Select spouse (optional)</option>
            {families?.map((member: any) => (
              <option value={member.id} key={member.id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Ministry/Department */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-600">Primary Ministry</label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("ministryId")}
            defaultValue={data?.ministryId}
          >
            <option value="">Select ministry (optional)</option>
            {ministries?.map((ministry: { id: number; name: string }) => (
              <option value={ministry.id} key={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cell Group */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-xs font-medium text-gray-600">Cell Group</label>
          <select
            className="ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-400 outline-none"
            {...register("cellGroupId")}
            defaultValue={data?.cellGroupId}
          >
            <option value="">Select cell group (optional)</option>
            {cellGroups?.map((group: { id: number; name: string; capacity: number; _count: { members: number } }) => (
              <option value={group.id} key={group.id}>
                {group.name} - {group._count.members}/{group.capacity} members
              </option>
            ))}
          </select>
        </div>

        {/* Skills/Talents (as comma-separated) */}
        <InputField
          label="Skills & Talents"
          name="skills"
          defaultValue={data?.skills?.join(', ')}
          register={register}
          error={errors.skills}
          placeholder="e.g., Singing, Teaching, Ushering (comma separated)"
        />
      </div>

      {/* Spiritual Information */}
      <div className="bg-purple-50 p-3 rounded-md">
        <p className="text-xs text-purple-600 flex items-center gap-2">
          <span>🙏</span>
          <span>Welcome to the family! A member number has been generated for you.</span>
        </p>
      </div>

      {state.error && (
        <div className="bg-red-50 p-3 rounded-md">
          <span className="text-sm text-red-500">
            Something went wrong! Please check all fields and try again.
          </span>
        </div>
      )}

      <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium self-end w-full md:w-auto">
        {type === "create" ? "Register Member" : "Update Member"}
      </button>
    </form>
  );
};

export default MemberForm;
