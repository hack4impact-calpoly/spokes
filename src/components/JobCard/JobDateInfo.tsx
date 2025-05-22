function formatDate(date: Date | undefined) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (!date) {
    console.log("INVALID DATE: ", date);
    return "Invalid Date";
  }
  console.log("DATE: ", date);
  return new Date(date).toLocaleDateString(undefined, options);
}

export type JobDateKind = "submitted" | "posted" | "updated" | "expires" | "expired";

export default function JobDateInfo({ date, type }: { date: Date | undefined; type: JobDateKind }) {
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
    case "expires":
      label = "Expires: ";
      break;
    case "expired":
      label = "Expired: ";
      break;
  }

  return (
    <p className="text-sm text-gray-500">
      {label}
      {formatDate(date)}
    </p>
  );
}
