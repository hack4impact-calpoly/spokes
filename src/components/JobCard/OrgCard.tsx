import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef } from "react";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "./JobStatusBadge";
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
import { isMoreThanThirtyDaysAgo } from "@/lib/utils";

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
        date.setDate(date.getDate() + 30);
      }
      return date;

    default:
      return undefined;
  }
}

export const OrgCard = forwardRef<HTMLDivElement, OrgCardProps>(
  ({ children, className, job, types, ...props }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isActuallyExpired = isMoreThanThirtyDaysAgo(job.approvedDate);
    const router = useRouter();

    function handleEditApplicationButton(e: React.ChangeEvent<any>) {
      e.preventDefault();
      router.push(`/jobform?jobId=${job._id}&returnURL=/dashboard`);
    }

    return (
      <>
        <div
          ref={ref}
          className={twMerge(
            "w-full flex flex-col gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-5 rounded-md bg-[#f7f7f7]",
            className,
          )}
          {...props}
        >
          <div className="w-full h-fit flex flex-row items-center gap-2">
            <div className="text-base sm:text-lg font-semibold truncate flex-1">{job.title}</div>
            <JobStatusBadge
              jobStatus={isActuallyExpired ? "expired" : job.jobStatus}
              className="flex-shrink-0"
            ></JobStatusBadge>
          </div>

          <div className="w-full h-fit flex flex-col sm:flex-row sm:gap-4">
            {types.map((type, index) => (
              <JobDateInfo
                key={index}
                date={getJobDate(job, type)}
                type={type}
                className="hidden sm:block"
              ></JobDateInfo>
            ))}
            {/* Show only the most important date on mobile */}
            {types.length > 0 && (
              <JobDateInfo date={getJobDate(job, types[0])} type={types[0]} className="sm:hidden"></JobDateInfo>
            )}
          </div>

          <div className="w-full h-fit flex flex-col items-start gap-2 md:flex-row md:items-center">
            <div className="flex flex-row self-end gap-2 md:hidden mt-3">
              {job.jobStatus === "rejected" && (
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size={{ base: "xs", md: "sm" }}
                  onClick={onOpen}
                  className="flex flex-row items-center gap-1 sm:gap-2"
                >
                  <FiMessageSquare className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">View Feedback</span>
                  <span className="sm:hidden">Feedback</span>
                </Button>
              )}
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center gap-1 sm:gap-2 flex-wrap">
                <JobBadge badgeType={job.employmentType} />
                {job.compensationType && <JobBadge badgeType={job.compensationType} className="hidden sm:block" />}
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="hidden md:flex flex-row items-center gap-1 sm:gap-2">
                  {job.jobStatus === "rejected" && (
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size={{ base: "xs", md: "sm" }}
                      onClick={onOpen}
                      className="hidden md:flex flex-row items-center gap-1 sm:gap-2"
                    >
                      <FiMessageSquare className="text-sm sm:text-base" />
                      <span>View Feedback</span>
                    </Button>
                  )}
                </div>
                <Button
                  aria-label="Edit Application"
                  size={{ base: "xs", md: "sm" }}
                  borderColor="black"
                  onClick={handleEditApplicationButton}
                  className="flex flex-row items-center gap-1 sm:gap-2"
                >
                  <FiEdit className="text-sm sm:text-base" />
                  Edit
                </Button>
              </div>
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
                  {job.rejectionMessage || "No feedback provided."}
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
