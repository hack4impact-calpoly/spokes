import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef } from "react";
import { Spinner } from "@chakra-ui/react";

export interface LoaderProps extends ComponentProps<"div"> {
  className?: string;
  label?: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(({ children, className, label, size, ...props }, ref) => {
  return (
    <div ref={ref} className={twMerge("flex flex-col gap-6 justify-center items-center", className)} {...props}>
      <Spinner className="text-black" size={size}></Spinner>
      {label && <div className="text-lg font-medium text-black">{label}</div>}
    </div>
  );
});
Loader.displayName = "Loader";
