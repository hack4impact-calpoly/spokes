import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef } from "react";
import { Spinner } from "@chakra-ui/react";

export interface LoaderProps extends ComponentProps<"div"> {
  className?: string;
  label?: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(({ children, className, label, size, ...props }, ref) => {
  const fontSize = `text-${size}`;
  return (
    <div ref={ref} className={twMerge(className, "flex flex-col gap-6 justify-center items-center")} {...props}>
      <Spinner className="text-black" size={size}></Spinner>
      {label && <div className={twMerge(fontSize, "font-medium text-black")}>{label}</div>}
    </div>
  );
});
Loader.displayName = "Loader";
