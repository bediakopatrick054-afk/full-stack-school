import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string | number;
  error?: FieldError;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  required,
  disabled,
  placeholder,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-1 w-full"}>
      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        className={`ring-1 ring-gray-300 p-2.5 rounded-md text-sm w-full transition-all focus:ring-2 focus:ring-lamaPurple focus:outline-none ${
          disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
        } ${error ? 'ring-red-400' : ''}`}
        {...inputProps}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
      />
      {error?.message && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <span>⚠️</span>
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;
