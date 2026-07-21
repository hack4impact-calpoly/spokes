import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton() {
  return (
    <Box overflowX="auto" className="px-2">
      <Table className="my-5 min-w-[600px] w-full" variant="simple" borderColor="gray.300">
        <Thead>
          <Tr>
            <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300" pl={0}>
              Name
            </Th>
            <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300">
              Email
            </Th>
            <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300">
              Organization
            </Th>
            <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300" pr={0}>
              Member status
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...Array(5)].map((_, index) => (
            <Tr key={index} className="transition-colors hover:bg-gray-50" borderColor="gray.300">
              <Td className="w-1/4" borderColor="gray.300" pl={0}>
                <Skeleton height={24} width="75%" />
              </Td>
              <Td className="w-1/3" borderColor="gray.300">
                <Skeleton height={24} width="80%" />
              </Td>
              <Td className="w-1/4" borderColor="gray.300">
                <Skeleton height={24} width="66%" />
              </Td>
              <Td className="w-1/6" borderColor="gray.300" pr={0}>
                <div className="flex items-center justify-between py-2 pr-2">
                  <Skeleton height={24} width={96} />
                  <Skeleton height={24} width={48} />
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
