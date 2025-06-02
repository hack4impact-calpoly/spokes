import { Badge, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";

type MembershipBadgeProps = {
  isMember: boolean;
  className?: string;
  skeleton?: boolean;
};

export default function MembershipBadge({ isMember, className, skeleton }: MembershipBadgeProps) {
  if (skeleton) {
    return (
      <Skeleton
        width={70}
        height={28}
        borderRadius="0.375rem"
        className={className}
        style={{ display: "inline-block" }}
      />
    );
  }

  return (
    <ChakraTooltip
      label={
        isMember
          ? "You're receiving Spokes member benefits"
          : "You're not receiving Spokes member benefits. Join now to have your jobs featured"
      }
      hasArrow
      placement="bottom"
      bg="#2B2B2B"
      color="white"
      fontSize="sm"
      borderRadius="md"
      padding="2"
      boxShadow="md"
      offset={[0, 5]}
      openDelay={400}
    >
      <Badge
        className={`cursor-default ${className || ""}`}
        rounded="md"
        p="1"
        px="2"
        h="min-content"
        textTransform="none"
        fontWeight="normal"
        bg={isMember ? "#D4F5E6" : "#FFE5E5"}
        color={isMember ? "#22C55E" : "#EF4444"}
      >
        {isMember ? "Member" : "Non-member"}
      </Badge>
    </ChakraTooltip>
  );
}
