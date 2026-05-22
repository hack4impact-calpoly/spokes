import { Badge, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { twMerge } from "tailwind-merge";

type EventStatusBadgeProps = {
  className?: string;
  eventStatus: string;
};

export default function EventStatusBadge({ eventStatus, className }: EventStatusBadgeProps) {
  let badgeColor;
  let textColor = "black";
  let tooltipText = "";

  switch (eventStatus) {
    case "approved":
      badgeColor = "#FFFBD4";
      textColor = "#FFC555";
      tooltipText = "This event is live and visible to the public.";
      break;
    case "pending":
      badgeColor = "#E2F5FF";
      textColor = "#59A8D4";
      tooltipText = "This event is awaiting approval by the Spokes administrator team.";
      break;
    case "expired":
      badgeColor = "#FFE5E5";
      textColor = "#D45959";
      tooltipText = "This event has passed.";
      break;
    case "rejected":
      badgeColor = "#FFE5E5";
      textColor = "#D45959";
      tooltipText = "This event was not approved. Please review the feedback and resubmit.";
      break;
    default:
      badgeColor = "#e6e6e6";
      tooltipText = "Event status information unavailable.";
      break;
  }

  const badgeName = eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1);

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
