"use client";

import cn from "clsx";
import React, { forwardRef, ButtonHTMLAttributes } from "react";

import { LoadingDots } from "@/ui/loading";

import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "slim" | "flat";
  active?: boolean;
  width?: number;
  loading?: boolean;
  Component?: React.ComponentType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, buttonRef) => {
    const {
      className,
      variant = "flat",
      children,
      active,
      width,
      loading = false,
      disabled = false,
      style = {},
      Component = "button",
      ...rest
    } = props;
    const rootClassName = cn(
      styles.root,
      {
        [styles.slim]: variant === "slim",
        [styles.loading]: loading,
        [styles.disabled]: disabled,
      },
      className,
    );
    return (
      <Component
        aria-pressed={active}
        data-variant={variant}
        ref={buttonRef}
        className={rootClassName}
        disabled={disabled}
        style={{
          width,
          ...style,
        }}
        {...rest}
      >
        {children}
        {loading && (
          <i className="flex pl-2 m-0">
            <LoadingDots />
          </i>
        )}
      </Component>
    );
  },
);

Button.displayName = "Button";
