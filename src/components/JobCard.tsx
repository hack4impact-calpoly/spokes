import { Button, Card, Container, Stack, VStack } from "@chakra-ui/react";

import { Badge } from "@chakra-ui/react";
import Link from "next/link";

type JobCardProps = {
  title: string;
  description: string;
  companyName: string;
  datePosted: string;
  tags: string[];
  applyUrl: string;
};

export default function JobCard({ title, companyName, description, datePosted, tags, applyUrl }: JobCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg max-w-[520px] px-6 md:px-10 py-6 md:py-10 flex flex-col gap-8">
      <Stack direction="column">
        <div className="flex flex-col items-start sm:flex-row md:items-center justify-between">
          <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
          <span className="text-sm sm:text-sm">{datePosted.replaceAll("-", "/")}</span>
        </div>
        <p className="font-medium text-lg">{companyName}</p>
      </Stack>
      <p className="text-base">{description}</p>
      <Stack direction="row">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            size="solid"
            variant="subtle"
            borderRadius={5}
            paddingX={2}
            paddingY={1}
            bgColor="#d6d6d6"
            color="#000"
            fontWeight={400}
            textTransform="capitalize"
          >
            {tag}
          </Badge>
        ))}
      </Stack>
      <Stack direction="row" gap={4}>
        <Button
          variant="outline"
          bgColor="inherit"
          borderColor="#000"
          borderWidth={2}
          paddingY={4}
          fontWeight={400}
          width="50%"
          _hover={{ bgColor: "#c5c5c5" }}
        >
          See More
        </Button>

        <Container width="50%" padding={0} margin={0}>
          <Link href={applyUrl}>
            <Button
              variant="solid"
              bgColor="#000"
              color="#fff"
              borderColor="#000"
              borderWidth={2}
              paddingY={4}
              fontWeight={400}
              width="100%"
              _hover={{ bgColor: "#464646" }}
            >
              Apply Now
            </Button>
          </Link>
        </Container>
      </Stack>
    </div>
  );
}
