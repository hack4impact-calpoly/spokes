import { Badge, Button, Stack } from "@chakra-ui/react";
export default function JobCard() {
  return (
    <div className="w-full h-full bg-gray-100 m-4 p-8 rounded-md sm:p-12 sm:w-full sm:h-auto md:w-full md:h-1/4 lg:w-2/5 ">
      <div className="md:flex md:justify-between ">
        <div className="text-3xl font-semibold">Job Title</div>
        <div className="text-xl font-medium mt-1">05/01/2025</div>
      </div>
      <div className="text-xl font-semibold mt-4">Organization Name</div>
      <div className="text-xl font-medium mt-4">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui nihil voluptatem illum totam magni voluptatum
        accusamus, veniam sint provident odit repellat quisquam ipsa deleniti beatae quibusdam, quo numquam perferendis
        nulla assumenda impedit optio laboriosam iste libero! Libero.
      </div>
      <div className="mt-4">
        <Badge bg="blackAlpha.400" color="black" borderRadius="md" px={3} py={1} mr={4}>
          Paid
        </Badge>
        <Badge bg="blackAlpha.400" color="black" borderRadius="md" px={3} py={1}>
          Full-Time
        </Badge>
      </div>
      <div className="mt-6 sm:flex sm:justify-start">
        <Button colorScheme="black" variant="outline" px={{ base: 4, sm: 8, md: 12, lg: 16 }} my={1} mr={4}>
          See More
        </Button>
        <Button color="white" bg="black" variant="solid" px={{ base: 4, sm: 8, md: 12, lg: 16 }} my={1}>
          Apply Now
        </Button>
      </div>
    </div>
  );
}
