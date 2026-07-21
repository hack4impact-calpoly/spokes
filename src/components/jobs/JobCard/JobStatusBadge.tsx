import { Badge, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { formatBadgeName } from "@/components/jobs/JobCard/JobBadge";
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
    case "rejected":
      badgeColor = "#FFE5E5"; // red
      textColor = "#D45959";
      tooltipText =
        "This job posting was not approved. Please review the provided feedback and implement necessary changes.";
      break;
    default:
      badgeColor = "#e6e6e6"; // grey
      tooltipText = "Job status information unvailable.";
      break;
  }

  const badgeName = formatBadgeName(jobStatus.toString());

  return (
    <ChakraTooltip
      label={tooltipText}
      hasArrow
      placement="top"
      bg="#2B2B2B"
      color="white"
      fontSize="sm"
      borderRadius="md"
      padding="2"
      boxShadow="md"
      offset={[0, 5]}
      maxW="220px"
      openDelay={400}
    >
      <Badge
        className={twMerge("text-center cursor-default", className)}
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
