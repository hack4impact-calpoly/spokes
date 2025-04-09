"use client";
import React from "react";
import { IJob } from "@/database/jobSchema";
import { useRouter } from "next/navigation";
import { Box, Heading, Button, Flex, Text, Link } from "@chakra-ui/react";

// Mock data, to be replaced
const mockJob: IJob = {
  _id: "67f63757eb010c929ff8a1ec",
  organizationName: "The Community Foundation",
  organizationIndustry: ["Humanitarian Aid", "Philanthropic Foundation"],
  title: "Philanthropy Assistant",
  postDate: new Date("2025-03-06T06:48:01.998+00:00"),
  approvedDate: new Date("2025-03-10T06:48.01.998+00:00"),
  jobDescription:
    "The Philanthropy Assistant, reporting to the Director of Philanthropy, is a key member of the donor services team. This position focuses on the administrative functions of the Foundation's donor services team, delivering excellent customer service to fund holders and prospective donors while assisting with fund administration and reporting. This role requires meticulous attention to detail, outstanding organizational skills, and proficiency with computer systems. This is a full-time, non-exempt position that offers comprehensive benefits.",
  employmentType: "full-time",
  compensationType: "salary",
  jobStatus: "pending",
  contactName: "John Doe",
  contactPhone: "n/a",
  contactEmail: "job@cfsloco.org",
  detailURL: "https://www.cfsloco.org/",
  applyNowURL: "",
};

export default function JobDetails() {
  const job = mockJob;
  const router = useRouter();

  function handleEditApplicationButton(e: React.ChangeEvent<any>) {
    e.preventDefault();
    router.push(`/jobform?jobId=${job._id}`);
  }

  return (
    <Box mt="50px" p={{ base: 8, md: 16, lg: 20 }} width="100%">
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4} w="full">
        <Heading size="lg">{job.title}</Heading>
        <Button
          fontWeight="medium"
          size={{ base: "xs", sm: "sm", md: "md" }}
          colorScheme="blue"
          bg="#045F87"
          w={{ base: "full", md: "auto" }}
          onClick={handleEditApplicationButton}
        >
          Edit
        </Button>
      </Flex>
      <Heading size="md" mt="5">
        {job.organizationName} • {job.organizationIndustry.join(", ")}
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="stretch" gap={8} w="full" mt="5">
        <Box flex="1">
          <Text fontSize="md">{job.jobDescription}</Text>
          <Button
            as="a"
            href={job.detailURL}
            target="_blank"
            rel="noopener noreferrer"
            fontWeight="medium"
            size={{ base: "xs", sm: "sm", md: "md" }}
            colorScheme="blue"
            borderRadius="xl"
            bg="#045F87"
            w={{ base: "full", md: "auto" }}
            mt={5}
          >
            Click Here to Go to Job Listing
          </Button>
          <Heading size="md" mt="5">
            Person of Contact
          </Heading>
          <Text fontSize="md" mt="5">
            Name: {job.contactName}
          </Text>
          <Text fontSize="md" mt="1">
            Phone Number: {job.contactPhone}
          </Text>
          <Text fontSize="md" mt="1">
            Email:{" "}
            <Link href={`mailto:${job.contactEmail}`} textDecoration="underline">
              {job.contactEmail}
            </Link>
          </Text>
        </Box>
        <Box w={{ base: "full", md: "auto" }} bg="#F0F0F0" borderRadius="lg" p="8" flex="1">
          <Heading size="md">Position Type</Heading>
          <Text fontSize="md" textTransform="capitalize" mt={1}>
            {job.employmentType}
          </Text>
          <Heading size="md" mt="4">
            Analytics
          </Heading>
          <Text fontSize="md" mt="1">
            {/* To be implementd later */}
            Last updated: 3/10/2025
          </Text>
          <Text fontSize="md" mt="1">
            Job posted: {job.postDate.toLocaleDateString()}
          </Text>
          <Text fontSize="md" mt="1">
            {/* To be implemented later */}
            Job deadline: 3/31/2025
          </Text>
          <Text fontSize="md" mt="1">
            Views: 120
          </Text>
          <Text fontSize="md" mt="1">
            Clicks: 57
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
