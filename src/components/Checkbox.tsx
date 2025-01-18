import { twMerge } from "tailwind-merge";
import { ComponentProps, ChangeEventHandler, forwardRef } from "react";

export interface CheckboxProps extends ComponentProps<"div"> {
  className?: string;
  label: string;
  checked: boolean;
  changeHandler: ChangeEventHandler;
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  ({ children, className, label, checked, changeHandler, disabled, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge("w-fit flex flex-row", className)} {...props}>
        <label htmlFor={label + "_checkbox"} className="flex items-center cursor-pointer relative">
          <input
            id={label + "_checkbox"}
            type="checkbox"
            checked={checked}
            onChange={changeHandler}
            disabled={disabled}
            className="bg-transparent border-black group-hover:border-black peer appearance-none cursor-pointer size-[15px] border-[1.5px] outline-none focus-visible:border-black focus-visible:group-hover:border-black rounded ring-0 checked:bg-black checked:group-hover:border-dex-green checked:border-dex-green checked:disabled:group-hover:border-dex-green disabled:group-hover:border-black disabled:cursor-not-allowed"
          ></input>
          <span className="absolute cursor-pointer pointer-events-none text-white opacity-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[11px] w-[11px] cursor-pointer pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                className="pointer-events-none"
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
        <label
          htmlFor={label + "_checkbox"}
          className="font-normal cursor-pointer text-base ml-2.5 mt-[0.5px] text-black select-none"
        >
          {label}
        </label>
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
