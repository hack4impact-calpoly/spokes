import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef, useState } from "react";
import { Checkbox } from "./Checkbox";
import { FiChevronDown } from "react-icons/fi";
import { FiChevronUp } from "react-icons/fi";

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
    const [salaryChecked, setSalaryChecked] = useState(false);
    const [hourlyChecked, setHourlyChecked] = useState(false);
    const [contractChecked, setContractChecked] = useState(false);

    const [industryOpen, setIndustryOpen] = useState(false);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

    const industries = [
      "Arts",
      "Civil Rights",
      "Community Development",
      "Education",
      "Environment",
      "Faith",
      "Health",
      "Humanitarian Aid",
      "Social Services",
      "Youth",
    ];

    const handleIndustryChange = (industry: string) => {
      setSelectedIndustries((prev) =>
        prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry],
      );
      onFilterChange("industry", industry);
    };

    function handleClearFilters() {
      setFullTimeChecked(false);
      setPartTimeChecked(false);
      setVolunteerChecked(false);
      setSalaryChecked(false);
      setHourlyChecked(false);
      setContractChecked(false);
      setIndustryOpen(false);
      setSelectedIndustries([]);

      onFilterChange("clear-all", "");
    }

    return (
      <div className="sticky top-[155px]">
        <div
          ref={ref}
          className={twMerge(
            "bg-[#F7F7F7] px-6 py-5 rounded flex flex-col gap-4 min-w-[270px]",
            "md:flex-row md:gap-8 lg:flex-col lg:gap-4",
            className,
          )}
          {...props}
        >
          <div>
            <div className="flex justify-between">
              <div className="mb-1 text-lg font-semibold text-black select-none">Employment</div>
              <button
                onClick={handleClearFilters}
                className="text-md font-medium px-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200 mb-1"
              >
                Clear
              </button>
            </div>
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
              <Checkbox
                label="Volunteer"
                checked={volunteerChecked}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setVolunteerChecked(event.target.checked);
                  onFilterChange("employment", "volunteer");
                }}
              ></Checkbox>
            </div>
          </div>
          <div>
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
                label="Contract"
                checked={contractChecked}
                changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setContractChecked(event.target.checked);
                  onFilterChange("compensation", "contract");
                }}
              ></Checkbox>
            </div>
          </div>
          <div>
            <div
              className="flex gap-1 items-center mb-1 text-lg font-semibold text-black select-none whitespace-nowrap hover:underline cursor-pointer"
              onClick={() => setIndustryOpen(!industryOpen)}
            >
              Industry
              {industryOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                industryOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-[2px] pt-1">
                {industries.map((industry) => (
                  <Checkbox
                    key={industry}
                    label={industry}
                    checked={selectedIndustries.includes(industry)}
                    changeHandler={() => handleIndustryChange(industry)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
FilterCard.displayName = "FilterCard";
