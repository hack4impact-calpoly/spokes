import { Badge, Button, Icon } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";

enum BadgeColors {
  Volunteer = "#C6D3FF",
  PartTime = "#FFE297",
  FullTime = "#F8B1B8",
  Paid = "#BDEABD",
}

interface JobCardProps {
  job: IJob;
}

export default function AdminCard({ job }: JobCardProps) {
  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded-lg px-8 pt-2 pb-8 mb-4">
        <div className="my-5">
          <div className="flex flex-row-reverse mb-5">
            <Icon viewBox="0 0 200 200" color="#A1E3CB">
              <path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" />
            </Icon>
          </div>
          <div className="flex justify-between">
            <Badge
              className="text-center"
              rounded="xl"
              p="1"
              px="2"
              size="small"
              h="min-content"
              textTransform="none"
              fontWeight="normal"
              bg="#E2F5FF"
              color="#59A8D4"
            >
              Pending
            </Badge>
            <Badge
              className="text-center"
              rounded="md"
              p="1"
              px="2"
              h="min-content"
              textTransform="none"
              fontWeight="normal"
              bg={BadgeColors.Paid}
            >
              Paid
            </Badge>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between lg:flex-row flex-col lg:gap-10 gap-2 mb-2">
            <h1 className="text-2xl font-bold">Development Director</h1>
            <p className="my-auto">12/20/24</p>
          </div>
          <p className="text-gray-700 font-semibold">{job.organizationName}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 italic">{job.jobDescription}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">{job.jobDescription}</p>
        </div>
        <div className="flex flex-wrap justify-between min-[1000px]:flex-row flex-col min-[1000px]:gap-4 gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              className="text-center"
              rounded="md"
              p="1"
              px="2"
              h="min-content"
              textTransform="none"
              fontWeight="normal"
              bg={BadgeColors.Volunteer}
            >
              Volunteer
            </Badge>
            <Badge
              className="text-center"
              rounded="md"
              p="1"
              px="2"
              h="min-content"
              textTransform="none"
              fontWeight="normal"
              bg={BadgeColors.PartTime}
            >
              Part-time
            </Badge>
            <Badge
              className="text-center"
              rounded="md"
              p="1"
              px="2"
              h="min-content"
              textTransform="none"
              fontWeight="normal"
              bg={BadgeColors.FullTime}
            >
              Full-time
            </Badge>
          </div>
          <div>
            <Button
              px="2"
              py="1"
              h="min-content"
              fontSize="small"
              fontWeight="normal"
              variant="outline"
              borderColor="black"
            >
              Edit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
