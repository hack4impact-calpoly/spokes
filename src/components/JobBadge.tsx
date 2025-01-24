import { Badge } from "@chakra-ui/react";

type JobBadgeProps = {
  badgeType: String;
};

export default function JobBadge({ badgeType }: JobBadgeProps) {
  let badgeColor;
  // Will need to have a standard typing style for these options or make a parse for it when ready
  switch (badgeType) {
    case "part-time":
      badgeColor = "#FFE297"; // yellow
      break;
    case "volunteer":
      badgeColor = "#FFE297"; // blue
      break;
    case "full-time":
      badgeColor = "#F8B1B8"; // red
      break;
    case "paid":
      badgeColor = "#b1f8bd"; // green
      break;
    case "non-paid":
      badgeColor = "#d2b1f8"; // purple
      break;
    case "approved":
      badgeColor = "#b1f8bd"; // green
      break;
    case "pending":
      badgeColor = "#e6e6e6"; // grey
      break;
    default:
      badgeColor = "#e6e6e6"; // grey
      break;
  }

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
      {badgeType}
    </Badge>
  );
}
