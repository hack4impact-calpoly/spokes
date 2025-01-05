import JobCard from "@/components/JobCard";
import { HStack, Button } from "@chakra-ui/react";
import { div } from "framer-motion/client";
import { isPagesAPIRouteMatch } from "next/dist/server/future/route-matches/pages-api-route-match";

export default function Home() {
  return (
    <div>
      <HStack wrap="wrap" gap="10">
        <Button size="xs">Button (xs)</Button>
        <Button size="sm">Button (sm)</Button>
        <Button size="md">Button (md)</Button>
        <Button size="lg">Button (lg)</Button>
        <p className="text-3xl text-blue-500">Tailwind styled</p>
      </HStack>
    </div>
  );
}
