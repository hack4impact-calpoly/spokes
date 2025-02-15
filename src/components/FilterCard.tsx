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
    const [salaryChecked, setSalaryChecked] = useState(false);
    const [hourlyChecked, setHourlyChecked] = useState(false);
    const [volunteerChecked, setVolunteerChecked] = useState(false);

    return (
      <div className="sticky top-[155px]">
        <div
          ref={ref}
          className={twMerge(
            "bg-[#F7F7F7] px-8 py-6 rounded flex flex-col gap-2 min-[430px]:flex-row min-[430px]:gap-16 lg:flex-col lg:gap-4",
            className,
          )}
          {...props}
        >
          <div>
            <div className="mb-1 text-lg font-semibold text-black select-none">Employment</div>
            <div className="flex flex-col gap-[2px]">
              <Checkbox
                label="Full-Time"
                checked={fullTimeChecked}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFullTimeChecked(event.target.checked);
                  onFilterChange("employment", "full-time");
                }}
              ></Checkbox>
              <Checkbox
                label="Part-Time"
                checked={partTimeChecked}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPartTimeChecked(event.target.checked);
                  onFilterChange("employment", "part-time");
                }}
              ></Checkbox>
            </div>
          </div>
          <div className="lg:mb-8">
            <div className="mb-1 text-lg font-semibold text-black select-none">Compensation</div>
            <div className="flex flex-col gap-[2px]">
              <Checkbox
                label="Salary"
                checked={salaryChecked}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSalaryChecked(event.target.checked);
                  onFilterChange("compensation", "salary");
                }}
              ></Checkbox>
              <Checkbox
                label="Hourly"
                checked={hourlyChecked}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setHourlyChecked(event.target.checked);
                  onFilterChange("compensation", "hourly");
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
      </div>
    );
  },
);
FilterCard.displayName = "FilterCard";
