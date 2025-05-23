import { Badge, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { formatBadgeName } from "@/components/JobCard/JobBadge";
import { twMerge } from "tailwind-merge";

type JobStatusBadgeProps = {
  className?: string;
  jobStatus: String;
};

export default function JobStatusBadge({ jobStatus, className }: JobStatusBadgeProps) {
  let badgeColor;
  let textColor = "black"; // default text color to black
  let tooltipText = "";

  // Will need to have a standard typing style for these options or make a parse for it when ready
  switch (jobStatus) {
    case "approved":
      badgeColor = "#FFFBD4"; // yellow
      textColor = "#FFC555";
      tooltipText = "This job posting is live and visible to potential applicants.";

      break;
    case "pending":
      badgeColor = "#E2F5FF"; // blue
      textColor = "#59A8D4";
      tooltipText = "This job posting is awaiting approval by the Spokes administrator team.";
      break;
    case "expired":
      badgeColor = "#FFE5E5"; // red
      textColor = "#D45959";
      tooltipText = "This job posting is no longer active. Renew to make it visible to potential applicants again.";
      break;
    default:
      badgeColor = "#e6e6e6"; // grey
      tooltipText = "Job Status Information Unavailable";
      break;
  }

  const badgeName = formatBadgeName(jobStatus.toString());

  return (
    <ChakraTooltip
      label={tooltipText}
      hasArrow
      placement="left"
      bg="#2B2B2B"
      color="white"
      fontSize="sm"
      borderRadius="md"
      padding="2"
      boxShadow="md"
    >
      <Badge
        className={twMerge("text-center", className)}
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
    </ChakraTooltip>
  );
}
