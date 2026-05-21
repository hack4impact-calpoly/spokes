import { Badge } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

type JobBadgeProps = {
  badgeType: String;
  className?: string;
};

interface FormatBadgeName {
  (badgeName: String | null): String | null;
}

export const formatBadgeName: FormatBadgeName = (badgeName) => {
  if (!badgeName) return null;
  return badgeName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
    .join("-");
};

export default function JobBadge({ badgeType, className }: JobBadgeProps) {
  let badgeColor;
  // Will need to have a standard typing style for these options or make a parse for it when ready
  switch (badgeType) {
    case "part-time":
      badgeColor = "#FFE297"; // yellow
      break;
    case "volunteer":
      badgeColor = "#C6D3FF"; // blue
      break;
    case "full-time":
      badgeColor = "#F8B1B8"; // red
      break;
    case "remote":
      badgeColor = "#F8B1B8"; // red
      break;
    case "in-person":
      badgeColor = "#C6D3FF"; // blue
      break;
    case "salary":
      badgeColor = "#BDEABD"; // green
      break;
    case "hourly":
      badgeColor = "#87CEFA"; // light blue
      break;
    case "contract":
      badgeColor = "#FAC791"; // orange
      break;
    default:
      badgeColor = "#e6e6e6"; // grey
      break;
  }

  const badgeName = formatBadgeName(badgeType);

  return (
    <Badge
      className={twMerge("text-center w-fit", className)}
      rounded="md"
      px="2"
      py="1"
      textTransform="none"
      fontWeight="normal"
      bg={badgeColor}
    >
      {badgeName}
    </Badge>
  );
}
