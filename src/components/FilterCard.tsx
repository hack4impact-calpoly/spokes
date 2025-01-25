import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef, useState } from "react";
import { Checkbox } from "./Checkbox";

export interface FilterCardProps extends ComponentProps<"div"> {
  className?: string;
}

export const FilterCard = forwardRef<HTMLDivElement, FilterCardProps>(({ children, className, ...props }, ref) => {
  const [fullTimeChecked, setFullTimeChecked] = useState(false);
  const [halfTimeChecked, setHalfTimeChecked] = useState(false);
  const [paidChecked, setPaidChecked] = useState(false);
  const [volunteerChecked, setVolunteerChecked] = useState(false);
  return (
    <div
      ref={ref}
      className={twMerge(
        "bg-[#F7F7F7] px-8 py-6 rounded flex flex-col gap-2 min-[430px]:flex-row min-[430px]:gap-16 lg:flex-col lg:gap-4",
        className,
      )}
      {...props}
    >
      <div>
        <div className="text-black font-semibold text-lg mb-1 select-none">Employment</div>
        <div className="flex flex-col gap-[2px]">
          <Checkbox
            label="Full-Time"
            checked={fullTimeChecked}
            changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
              // Later add filtering functionality
              setFullTimeChecked(event.target.checked);
            }}
          ></Checkbox>
          <Checkbox
            label="Half-Time"
            checked={halfTimeChecked}
            changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
              // Later add filtering functionality
              setHalfTimeChecked(event.target.checked);
            }}
          ></Checkbox>
        </div>
      </div>
      <div className="lg:mb-8">
        <div className="text-black font-semibold text-lg mb-1 select-none">Compensation</div>
        <div className="flex flex-col gap-[2px]">
          <Checkbox
            label="Paid"
            checked={paidChecked}
            changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
              // Later add filtering functionality
              setPaidChecked(event.target.checked);
            }}
          ></Checkbox>
          <Checkbox
            label="Volunteer"
            checked={volunteerChecked}
            changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
              // Later add filtering functionality
              setVolunteerChecked(event.target.checked);
            }}
          ></Checkbox>
        </div>
      </div>
    </div>
  );
});
FilterCard.displayName = "FilterCard";
