import { Checkbox } from "@chakra-ui/react";
import React from "react";

export default function JobsFilter() {
  return (
    <div>
      <h2 className="text-3xl font-medium mb-6">Filters</h2>
      <div className="p-4 bg-gray-100 w-full sm:w-[260px] flex flex-col gap-4 px-10 py-8 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">Employment</p>
          <div className="flex flex-col gap-2">
            <Checkbox variant="outline" size="md" iconColor="white" borderColor="#000" colorScheme="gray">
              Full-Time
            </Checkbox>
            <Checkbox variant="outline" size="md" iconColor="white" borderColor="#000" colorScheme="gray">
              Part-Time
            </Checkbox>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">Compensation</p>
          <div className="flex flex-col gap-2">
            <Checkbox variant="outline" size="md" iconColor="white" borderColor="#000" colorScheme="gray">
              Paid
            </Checkbox>
            <Checkbox variant="outline" size="md" iconColor="white" borderColor="#000" colorScheme="gray">
              Volunteer
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
}
