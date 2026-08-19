import { twMerge } from "tailwind-merge";

function formatDate(date: Date | undefined) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (!date) {
    return "Invalid Date";
  }
  return new Date(date).toLocaleDateString(undefined, options);
}

export type JobDateKind = "submitted" | "posted" | "updated" | "resolved";

export default function JobDateInfo({
  date,
  type,
  className,
}: {
  date: Date | undefined;
  type: JobDateKind;
  className?: string;
}) {
  let label = "";

  switch (type) {
    case "submitted":
      label = "Submitted: ";
      break;
    case "posted":
      label = "Posted: ";
      break;
    case "updated":
      label = "Updated: ";
      break;
    case "resolved":
      label = "Resolved: ";
      break;
  }

  return (
    <p className={twMerge("text-sm text-gray-500", className)}>
      {label}
      {formatDate(date)}
    </p>
  );
}
