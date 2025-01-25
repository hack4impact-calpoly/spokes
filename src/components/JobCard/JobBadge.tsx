import { Badge } from "@chakra-ui/react";

type JobBadgeProps = {
  badgeType: String;
};

interface FormatBadgeName {
  (badgeName: String): String;
}

export const formatBadgeName: FormatBadgeName = (badgeName) => {
  return badgeName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
    .join("-");
};

export default function JobBadge({ badgeType }: JobBadgeProps) {
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
    case "paid":
      badgeColor = "#BDEABD"; // green
      break;
    case "non-paid":
      badgeColor = "#e6e6e6"; // grey
      break;
    case "member":
      badgeColor = "#BDEABD"; // green
      break;
    case "non-member":
      badgeColor = "#F8B1B8"; // red
      break;
    default:
      badgeColor = "#e6e6e6"; // grey
      break;
  }

  const badgeName = formatBadgeName(badgeType);

  return (
    <Badge
      className="text-center w-fit"
      rounded="md"
      p="1"
      px="2"
      textTransform="none"
      fontWeight="normal"
      bg={badgeColor}
    >
      {badgeName}
    </Badge>
  );
}
