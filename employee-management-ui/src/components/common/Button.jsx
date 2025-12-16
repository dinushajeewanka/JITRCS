import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${
        disabled || loading ? "btn-disabled" : ""
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
