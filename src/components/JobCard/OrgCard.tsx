import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef, useState } from "react";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "./JobStatusBadge";
import JobBadge from "./JobBadge";
import {
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
  useToast,
} from "@chakra-ui/react";
import { FiEdit, FiEyeOff, FiMessageSquare, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import JobDateInfo, { JobDateKind } from "./JobDateInfo";
import { isExpired } from "@/lib/utils";

export interface OrgCardProps extends ComponentProps<"div"> {
  className?: string;
  job: IJob;
  types: JobDateKind[];
  onJobStatusUpdate?: (job: IJob) => void;
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
  ({ children, className, job, types, onJobStatusUpdate, ...props }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [actionText, setActionText] = useState("");
    const isActuallyExpired = isExpired(job.jobStatus, job.approvedDate);
    const router = useRouter();
    const toast = useToast();

    function handleEditApplicationButton(e: React.ChangeEvent<any>) {
      e.preventDefault();
      router.push(`/jobform?jobId=${job._id}&returnURL=/dashboard`);
    }

    async function handleRenewJob() {
      try {
        const response = await fetch(`/api/jobs/${job._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRenewal: true,
            previousStatus: job.jobStatus,
            newStatus: "approved",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to renew job");
        }

        const data = await response.json();

        // Show success toast
        toast({
          title: "Job Renewed",
          description: `Successfully renewed "${job.title}"`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        // Call the callback if provided
        if (onJobStatusUpdate) {
          onJobStatusUpdate(data.job);
        } else {
          // Fallback to page refresh if no callback provided
          window.location.reload();
        }
      } catch (error) {
        console.error("Error renewing job:", error);
        toast({
          title: "Error",
          description: "Failed to renew job. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    }

    function handleConfirmationModal(action: "unpublish" | "renew") {
      setActionText(action === "unpublish" ? "Unpublish" : "Renew");
      setIsConfirmationModalOpen(true);
    }

    async function handleUnpublishJob() {
      try {
        const response = await fetch(`/api/jobs/${job._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isUnpublish: true,
            previousStatus: job.jobStatus,
            newStatus: "expired",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to unpublish job");
        }
        console.log("response", response);

        const data = await response.json();
        console.log("Unpublished job:", data);
        // Show success toast
        toast({
          title: "Job Unpublished",
          description: `Successfully unpublished "${job.title}"`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        // Call the callback if provided
        if (onJobStatusUpdate) {
          onJobStatusUpdate(data.job);
        } else {
          // Fallback to page refresh if no callback provided
          window.location.reload();
        }
      } catch (error) {
        console.error("Error unpublishing job:", error);
        toast({
          title: "Error",
          description: "Failed to unpublish job. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
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
              {job.jobStatus === "approved" && !isActuallyExpired && (
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size={{ base: "xs", md: "sm" }}
                  onClick={() => handleConfirmationModal("unpublish")}
                  className="flex flex-row items-center gap-1 sm:gap-2"
                >
                  <FiEyeOff className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">Unpublish Job</span>
                  <span className="sm:hidden">Unpublish</span>
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
                  {job.jobStatus === "approved" && !isActuallyExpired && (
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size={{ base: "xs", md: "sm" }}
                      onClick={() => handleConfirmationModal("unpublish")}
                      className="hidden md:flex flex-row items-center gap-1 sm:gap-2"
                    >
                      <FiEyeOff className="text-sm sm:text-base" />
                      <span>Unpublish Job</span>
                    </Button>
                  )}
                </div>
                {isActuallyExpired && (
                  <Button
                    aria-label="Renew Job"
                    size={{ base: "xs", md: "sm" }}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => handleConfirmationModal("renew")}
                    className="flex flex-row items-center gap-1 sm:gap-2"
                  >
                    <FiRefreshCw className="text-sm sm:text-base" />
                    Renew
                  </Button>
                )}
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
        <Modal isOpen={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm {actionText} Job </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you would like to {actionText.toLowerCase()} this job posting?
              {actionText == "Unpublish" && " Unpublishing a job will mark it as expired, you can renew it later"}
            </ModalBody>
            <ModalFooter className="flex flex-wrap gap-2 mt-4 justify-end">
              <Button
                px="10"
                width="120px"
                fontSize="small"
                fontWeight="normal"
                borderColor="black"
                onClick={() => {
                  if (actionText === "Unpublish") {
                    handleUnpublishJob();
                  } else if (actionText === "Renew") {
                    handleRenewJob();
                  }
                  setIsConfirmationModalOpen(false);
                }}
                sx={{
                  _hover: {
                    backgroundColor: "green.300",
                  },
                }}
              >
                Confirm
              </Button>
              <Button
                px="10"
                width="120px"
                fontSize="small"
                fontWeight="normal"
                borderColor="black"
                onClick={() => setIsConfirmationModalOpen(false)}
                sx={{
                  _hover: {
                    backgroundColor: "red.300",
                  },
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

OrgCard.displayName = "OrgCard";
