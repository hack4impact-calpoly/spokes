import { IconButton } from "@chakra-ui/react";
import { FiEdit, FiMail } from "react-icons/fi";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "@/components/jobs/JobCard/JobStatusBadge";
import JobBadge from "@/components/jobs/JobCard/JobBadge";
import JobCardInformation from "@/components/jobs/JobCard/JobCardInformation";
import JobPostedDate from "@/components/jobs/JobCard/JobPostedDate";
import { useState, useEffect } from "react";
import JobCardModal from "./JobCardModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";
import ActionButton from "./ActionButton";
import { isExpired } from "@/lib/utils";

interface JobCardProps {
  job: IJob;
  innerRef?: (node?: Element | null | undefined) => void;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date, rejectionReason?: string) => void;
}

export default function AdminCard({ job, onUpdateJob, innerRef }: JobCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | "renew" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isNewIndicatorDismissed, setIsNewIndicatorDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const toast = useToast();

  // Check localStorage for dismissed state on component mount
  useEffect(() => {
    const dismissedState = localStorage.getItem(`new-indicator-${job._id}`);
    if (dismissedState === "true") {
      setIsNewIndicatorDismissed(true);
    }
  }, [job._id]);

  const dismissNewIndicator = () => {
    if (!isNewIndicatorDismissed) {
      setIsNewIndicatorDismissed(true);
      localStorage.setItem(`new-indicator-${job._id}`, "true");
    }
  };

  // Opens modal with the appropriate action
  const openModal = (action: "approve" | "reject" | "renew") => {
    dismissNewIndicator();
    setSelectedAction(action);
    setModalOpen(true);
  };

  // Closes modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedAction(null);
  };

  // Handles confirmation action if action was approved
  const handleConfirm = async () => {
    if (selectedAction === "reject") {
      setIsLoading("reject");
      await sendRejectionEmail(job, rejectionReason);
      if (onUpdateJob) {
        await onUpdateJob(job._id, "rejected", new Date(), rejectionReason);
      }
    } else if (selectedAction === "approve") {
      setIsLoading("approve");
      if (onUpdateJob) {
        await onUpdateJob(job._id, "approved", new Date());
      }
    } else if (selectedAction === "renew") {
      setIsLoading("approve");
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

        // Update the job status in the UI
        if (onUpdateJob) {
          await onUpdateJob(job._id, "approved", new Date());
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
    setIsLoading(null);
    closeModal();
  };

  async function sendRejectionEmail(job: IJob, reason: string) {
    const formattedData = {
      ...job,
      rejectionReason: reason,
    };

    try {
      const emailResponse = await fetch(`/api/send/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!emailResponse.ok) {
        console.error("Failed toe send notification email");
      }
    } catch (error) {
      console.error("Faild to send rejection email:", error);
    }
  }

  const isActuallyExpired = isExpired(job.jobStatus, job.approvedDate);

  function handleEditApplicationButton(e: React.ChangeEvent<any>) {
    e.preventDefault();
    dismissNewIndicator();
    router.push(`/jobs/list?jobId=${job._id}&returnURL=/jobs/admin`);
  }

  return (
    <div className="w-full h-full" ref={innerRef}>
      <div className="relative bg-[#f7f7f7] rounded-3xl px-8 py-5 shadow-sm h-full flex flex-col">
        {new Date(job.postDate).getTime() > Date.now() - 24 * 60 * 60 * 1000 && !isNewIndicatorDismissed && (
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={dismissNewIndicator}
            title="Dismiss new indicator"
          >
            <div className="w-3 h-3 bg-[#045F87] rounded-full shadow-sm"></div>
          </div>
        )}
        <IconButton
          aria-label="Edit Application"
          icon={<FiEdit />}
          size="sm"
          borderColor="black"
          position="absolute"
          className="absolute top-4 right-[1rem]"
          onClick={handleEditApplicationButton}
        />
        <div className="flex justify-between mb-5">
          <JobStatusBadge jobStatus={job.jobStatus} />
        </div>
        <JobCardInformation job={job} />
        <div className="flex flex-row gap-2 mb-2">
          <Link
            href={job.detailURL}
            className="text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200 w-fit"
            target="_blank"
            onClick={dismissNewIndicator}
          >
            View Job Details
          </Link>

          {job.applyNowURL ? (
            <Link
              href={job.applyNowURL}
              className="text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200 w-fit"
              target="_blank"
              onClick={dismissNewIndicator}
            >
              Apply Now
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md text-gray-600 bg-[#f7f7f7] w-fit">
              <FiMail className="w-5 h-5" />
              <span>Email Apply</span>
            </div>
          )}
        </div>

        <div className="flex-grow"></div>
        <div className="flex flex-wrap justify-between flex-row min-[1000px]:gap-4 gap-2 items-center">
          <div className="flex flex-wrap gap-2">
            <JobBadge badgeType={job.employmentType} />
            {job.compensationType && <JobBadge badgeType={job.compensationType} />}
          </div>

          <div className="flex flex-wrap gap-2 justify min-[1000px]:mt-0 mt-5">
            {job.jobStatus === "pending" && !isActuallyExpired && (
              <>
                <ActionButton
                  action="approve"
                  isLoading={isLoading === "approve"}
                  onClick={() => openModal("approve")}
                />
                <ActionButton action="reject" isLoading={isLoading === "reject"} onClick={() => openModal("reject")} />
              </>
            )}

            {isActuallyExpired && <ActionButton action="renew" onClick={() => openModal("renew")} />}
          </div>
        </div>

        <div className="mt-5">
          <JobPostedDate date={job.postDate} />
        </div>
      </div>
      {selectedAction &&
        isModalOpen &&
        (selectedAction === "reject" ? (
          <JobCardModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleConfirm}
            action={selectedAction}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            isLoading={isLoading !== null}
          />
        ) : (
          <JobCardModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleConfirm}
            action={selectedAction}
            isLoading={isLoading !== null}
          />
        ))}
    </div>
  );
}
