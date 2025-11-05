import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onePassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefix,
      leftIcon,
      rightIcon,
      onePassword = true,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex items-center border border-input rounded-md bg-background focus-within:border-current',
          ariaInvalid === true && 'border-destructive bg-destructive/10',
          className,
        )}
      >
        {leftIcon && (
          <span className="pl-3 pr-2 flex items-center text-muted-foreground">
            {leftIcon}
          </span>
        )}
        {prefix && (
          <span className="pl-3 py-2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            'flex-1 py-2 h-10 w-full bg-transparent text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            prefix || leftIcon ? 'pr-3' : 'px-3',
            rightIcon && 'pr-3',
          )}
          ref={ref}
          aria-invalid={ariaInvalid}
          {...(onePassword
            ? {
                'data-1p-ignore': true,
                'data-1p-ignore-focus': true,
              }
            : {})}
          {...props}
        />
        {rightIcon && (
          <span className="pr-3 flex items-center text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
