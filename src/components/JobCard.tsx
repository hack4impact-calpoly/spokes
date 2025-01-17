import { Button } from "@/components/ui/button";
import { Badge } from "@chakra-ui/react";
import { IJob } from "@/database/jobSchema";

enum BadgeColors {
  Volunteer = "#C6D3FF",
  PartTime = "#FFE297",
  FullTime = "#F8B1B8",
}

export default function JobCard() {
  return (
    <div className="max-w-[30%]">
      <div className="bg-[#f7f7f7] rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-2">
          <div className="flex lg:flex-row flex-col lg:gap-10 gap-2 mb-2">
            <h1 className="text-2xl font-bold">Senior Frontend Developer</h1>
            <p className="my-auto">12/20/24</p>
          </div>
          <p className="text-gray-700 font-semibold">Company Name</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 italic">keyword 1, keyword 2</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quod perspiciatis est quisquam doloremque
            quidem vero, veniam quae, nobis, quam nam ratione ducimus minima consequatur illum illo molestias sequi
            sunt.
          </p>
        </div>
        <div className="flex lg:flex-row flex-col gap-2">
          <Badge
            className="text-center"
            rounded="md"
            p="1"
            px="2"
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
            textTransform="none"
            fontWeight="normal"
            bg={BadgeColors.FullTime}
          >
            Full-time
          </Badge>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 my-5">
          <Button className="lg:w-[50%] w-full" fontWeight="normal" variant="outline" borderColor="black">
            See More
          </Button>
          <Button className="lg:w-[50%] w-full" fontWeight="normal" variant="outline" bg="black" textColor="white">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
