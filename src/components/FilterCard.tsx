import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef, useState } from "react";
import { Checkbox } from "./Checkbox";

interface FilterCategories {
  [key: string]: string[];
}

export interface FilterCardProps extends ComponentProps<"div"> {
  className?: string;
  categories: FilterCategories;
  onFilterChange: (categoryName: string, option: string) => void;
}

export const FilterCard = forwardRef<HTMLDivElement, FilterCardProps>(
  ({ onFilterChange, children, className, ...props }, ref) => {
    const [fullTimeChecked, setFullTimeChecked] = useState(false);
    const [partTimeChecked, setPartTimeChecked] = useState(false);
    const [volunteerChecked, setVolunteerChecked] = useState(false);
    const [paidChecked, setPaidChecked] = useState(false);
    return (
      <div
        ref={ref}
        className={twMerge("bg-[#F7F7F7] px-8 py-6 rounded flex lg:flex-col gap-16 lg:gap-4", className)}
        {...props}
      >
        <div>
          <div className="text-black font-semibold text-lg mb-1 select-none">Employment</div>
          <div className="flex flex-col gap-[2px]">
            <Checkbox
              label="Full-time"
              checked={fullTimeChecked}
              changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFullTimeChecked(event.target.checked);
                onFilterChange("employment", "full-time");
              }}
            ></Checkbox>
            <Checkbox
              label="Part-time"
              checked={partTimeChecked}
              changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPartTimeChecked(event.target.checked);
                onFilterChange("employment", "part-time");
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
                setPaidChecked(event.target.checked);
                onFilterChange("compensation", "paid");
              }}
            ></Checkbox>
            <Checkbox
              label="Volunteer"
              checked={volunteerChecked}
              changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                setVolunteerChecked(event.target.checked);
                onFilterChange("compensation", "volunteer");
              }}
            ></Checkbox>
          </div>
        </div>
      </div>
    );
  },
);
FilterCard.displayName = "FilterCard";
