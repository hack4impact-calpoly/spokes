import React from "react";
import { Box, Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";

const JobFormPage: React.FC = () => {
  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={4}>
        <strong>Create new listing</strong>
      </Heading>
      <Heading as="h2" size="lg" mb={6}>
        Job Information
      </Heading>
      <Heading as="h2" size="md" mb={2}>
        Organization name
      </Heading>
      <Input placeholder="Enter your response" mb={6} />
      <Heading as="h2" size="md" mb={2}>
        Organization Industry
      </Heading>
      <Input placeholder="Enter your response" mb={6} />
      <Heading as="h2" size="md" mb={2}>
        Job title
      </Heading>
      <Input placeholder="Enter your response" mb={6} />
      <Heading as="h2" size="md" mb={2}>
        Select all that apply
      </Heading>
      <Stack spacing={2} direction="row" mb={4}>
        <Button bg="green.200" color="black" p={2} borderWidth="1px" borderRadius="md">
          Paid
        </Button>
        <Button bg="red.200" color="black" p={2} borderWidth="1px" borderRadius="md">
          Not Paid
        </Button>
        <Button bg="blue.200" color="black" p={2} borderWidth="1px" borderRadius="md">
          Volunteer
        </Button>
        <Button bg="red.200" color="black" p={2} borderWidth="1px" borderRadius="md">
          Part-time
        </Button>
        <Button bg="yellow.200" color="black" p={2} borderWidth="1px" borderRadius="md">
          Full-time
        </Button>
      </Stack>
      <Flex mb={6}>
        <Box flex="1" mr={2}>
          <Heading as="h2" size="md" mb={6}>
            Posting Date
          </Heading>
          <Input placeholder="xx/xx/xxxx" />
        </Box>
        <Box flex="1" ml={2}>
          <Heading as="h2" size="md" mb={6}>
            Expiration Date
          </Heading>
          <Input placeholder="xx/xx/xxxx" />
        </Box>
      </Flex>
      <Heading as="h2" size="md" mb={2}>
        Job Description
      </Heading>
      <Input placeholder="Enter your response" mb={6} />
      <Heading as="h2" size="md" mb={2}>
        Link to job listing
      </Heading>
      <Input placeholder="xxxx.com" mb={6} />
      <Heading as="h2" size="md" mb={6}>
        Personal Information
      </Heading>
      <Flex mb={4}>
        <Box flex="1" mr={2}>
          <Heading as="h2" size="md" mb={2}>
            Name
          </Heading>
          <Input placeholder="First and Last Name" mb={6} />
        </Box>
        <Box flex="1" ml={2}>
          <Heading as="h2" size="md" mb={2}>
            Phone Number
          </Heading>
          <Input placeholder="Phone Number" />
        </Box>
      </Flex>
      <Heading as="h2" size="md" mb={2}>
        Email
      </Heading>
      <Input placeholder="xxxxx@example.com" mb={4} />
      <Flex justify="center" mt={4}>
        <Button colorScheme="blackAlpha" size="lg">
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default JobFormPage;
