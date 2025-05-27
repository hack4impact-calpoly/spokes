import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef } from "react";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "./JobStatusBadge";
import JobPostedDate from "./JobPostedDate";
import JobBadge from "./JobBadge";
import {
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { FiEdit, FiMessageSquare } from "react-icons/fi";
import { useRouter } from "next/navigation";
import JobDateInfo, { JobDateKind } from "./JobDateInfo";

export interface OrgCardProps extends ComponentProps<"div"> {
  className?: string;
  job: IJob;
  types: JobDateKind[];
}

function getJobDate(job: IJob, type: JobDateKind) {
  switch (type) {
    case "submitted":
      return new Date(job.postDate);

    case "posted":
      return job.approvedDate ? new Date(job.approvedDate) : undefined;

    case "updated":
      return job.modifiedDate ? new Date(job.modifiedDate) : undefined;

    case "expires":

    case "expired":
      let date = job.approvedDate ? new Date(job.approvedDate) : undefined;
      if (date) {
        date.setDate(date.getDate() + 31);
      }
      return date;

    default:
      return undefined;
  }
}

export const OrgCard = forwardRef<HTMLDivElement, OrgCardProps>(
  ({ children, className, job, types, ...props }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();

    function handleEditApplicationButton(e: React.ChangeEvent<any>) {
      e.preventDefault();
      router.push(`/jobform?jobId=${job._id}`);
    }

    return (
      <>
        <div
          ref={ref}
          className={twMerge("w-full flex flex-col gap-3 py-4 px-5 rounded-md bg-[#f7f7f7]", className)}
          {...props}
        >
          <div className="w-full h-fit flex flex-row items-center">
            <div className="text-lg font-semibold">{job.title}</div>
            <JobStatusBadge jobStatus={job.jobStatus} className="ml-auto"></JobStatusBadge>
          </div>

          <div className="w-full h-fit flex flex-col sm:flex-row sm:gap-4">
            {types.map((type, index) => (
              <JobDateInfo key={index} date={getJobDate(job, type)} type={type}></JobDateInfo>
            ))}
          </div>

          <div className="w-full h-fit flex flex-col items-start gap-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center gap-2">
              <JobBadge badgeType={job.employmentType} />
              {job.compensationType && <JobBadge badgeType={job.compensationType} />}
            </div>
            <div className="flex flex-row items-center gap-2 self-center md:ml-auto mt-5">
              {job.jobStatus === "rejected" && (
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size={{ base: "xs", md: "sm" }}
                  onClick={onOpen}
                  className="flex flex-row items-center gap-2"
                >
                  <FiMessageSquare />
                  View Feedback
                </Button>
              )}
              <Button
                aria-label="Edit Application"
                size={{ base: "xs", md: "sm" }}
                borderColor="black"
                onClick={handleEditApplicationButton}
                className="flex flex-row items-center gap-2"
              >
                <FiEdit />
                Edit
              </Button>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontWeight={"bold"}>Application Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="text-lg text-black font-semibold">Reason for Rejection:</div>
                <Text className="text-sm text-gray-800 font-normal bg-gray-100 px-2 py-3 rounded-md">
                  Your Job is wack
                </Text>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleEditApplicationButton} size="sm">
                Edit Application
              </Button>
              <Button variant="ghost" onClick={onClose} size="sm">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

OrgCard.displayName = "OrgCard";
