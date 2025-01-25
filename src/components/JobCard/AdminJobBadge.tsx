import { Badge } from "@chakra-ui/react";
import { formatBadgeName } from "@/components/JobCard/JobBadge";

type AdminJobBadgeProps = {
  jobStatus: String;
};

export default function AdminJobBadge({ jobStatus }: AdminJobBadgeProps) {
  let badgeColor;
  let textColor = "black"; // default text color to black

  // Will need to have a standard typing style for these options or make a parse for it when ready
  switch (jobStatus) {
    case "approved":
      badgeColor = "#FFFBD4"; // yellow
      textColor = "#FFC555";
      break;
    case "pending":
      badgeColor = "#E2F5FF"; // blue
      textColor = "#59A8D4";
      break;
    default:
      badgeColor = "#e6e6e6"; // grey
      break;
  }

  const badgeName = formatBadgeName(jobStatus.toString());

  return (
    <Badge
      className="text-center"
      rounded="md"
      p="1"
      px="2"
      h="min-content"
      textTransform="none"
      fontWeight="normal"
      bg={badgeColor}
      color={textColor}
    >
      {badgeName}
    </Badge>
  );
}
