import React from "react";

type TextInputProps = {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-white text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:bg-gray-700 active:bg-gray-700 sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextInput;
