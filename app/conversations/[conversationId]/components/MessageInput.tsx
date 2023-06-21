"use client";

import {
  FieldErrors,
  FieldValue,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface MessageinputProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required: boolean;
  placeholder: string;
}

const MessageInput: React.FC<MessageinputProps> = ({
  id,
  register,
  errors,
  placeholder,
  required,
}) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type="text"
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outlline-none"
      />
    </div>
  );
};

export default MessageInput;
