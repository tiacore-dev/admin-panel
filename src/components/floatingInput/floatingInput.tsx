import React, { useState } from "react";
import "./floatingInput.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
interface Props {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}

export const FloatingInput: React.FC<Props> = ({
  id,
  name = " ",
  type = "text",
  value,
  onChange,
  placeholder = " ",
  disabled,
  hint,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="input-group" data-hint={hint}>
      <input
        id={id}
        type={inputType}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id} className="input-label">
        {name}
      </label>

      {isPassword && (
        <button
          type="button"
          className="toggle-password"
          onClick={togglePassword}
          tabIndex={-1}
        >
          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      )}
    </div>
  );
};
