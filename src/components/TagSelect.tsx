import { Label } from "@/components/TagsMultiselect/label";
import MultipleSelector, { Option } from "@/components/TagsMultiselect/multiselect";
import { useRef } from "react";

const industries: Option[] = [
  {
    value: "Arts & Culture",
    label: "Arts & Culture",
  },
  {
    value: "Education & Research",
    label: "Education & Research",
  },
  {
    value: "Health & Human Services",
    label: "Health & Human Services",
  },
  {
    value: "Human & Social Services",
    label: "Human & Social Services",
  },
  {
    value: "Community & Economic Development",
    label: "Community & Economic Development",
  },
  {
    value: "Environment & Animals",
    label: "Environment & Animals",
  },
  {
    value: "Youth Development & Recreation",
    label: "Youth Development & Recreation",
  },
  {
    value: "Faith-Based & Spiritual",
    label: "Faith-Based & Spiritual",
  },
  {
    value: "Organizations",
    label: "Organizations",
  },
  {
    value: "Civil Rights & Advocacy",
    label: "Civil Rights & Advocacy",
  },
  {
    value: "International Development & Humanitarian Aid",
    label: "International Development & Humanitarian Aid",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export default function TagSelect({
  value,
  name,
  onChange,
  onMax,
  checkMax,
}: {
  value: Option[];
  name: String;
  onChange: (values: Option[]) => void;
  onMax: () => void;
  checkMax: (length: number) => void;
}) {
  return (
    <div id="tagSelectContainer" className="*:not-first:mt-2">
      <MultipleSelector
        commandProps={{
          label: "Select industries",
        }}
        onChange={onChange}
        name={name}
        value={value}
        defaultOptions={industries}
        placeholder="Select industries"
        hideClearAllButton
        hidePlaceholderWhenSelected
        maxSelected={3}
        checkMax={checkMax}
        onMaxSelected={onMax}
        emptyIndicator={<p className="text-center text-sm p-0 h-fit">No results found</p>}
      />
    </div>
  );
}
