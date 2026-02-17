import React from "react";
import "../../styles/Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const classes = `btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
