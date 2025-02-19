import { Button, IconButton } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "@/components/JobCard/JobStatusBadge";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";
import { useState } from "react";
import JobCardModal from "./JobCardModal";

interface JobCardProps {
  job: IJob;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => void;
}

export default function AdminCard({ job, onUpdateJob }: JobCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | "renew" | null>(null);

  // Opens modal with the appropriate action
  const openModal = (action: "approve" | "reject" | "renew") => {
    setSelectedAction(action);
    setModalOpen(true);
  };

  // Closes modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedAction(null);
  };

  // Handles confirmation action if action was approved
  const handleConfirm = () => {
    if (selectedAction && onUpdateJob) {
      onUpdateJob(job._id, selectedAction === "reject" ? "rejected" : "approved", new Date());
    }
    closeModal();
  };

  const isExpired =
    job.jobStatus != "approved" &&
    job.postDate &&
    new Date(job.postDate) < new Date(new Date().setDate(new Date().getDate() - 30));

  return (
    <div className="max-w-[100%]">
      <div className="relative bg-[#f7f7f7] rounded-3xl px-8 py-5 shadow-sm">
        <IconButton
          aria-label="Edit Application"
          // eslint-disable-next-line react/jsx-no-undef
          icon={<FiEdit />}
          size="sm"
          variant="outline"
          borderColor="black"
          position="absolute"
          className="absolute top-4 right-[1rem]"
        />
        <div className="flex justify-between mb-5">
          <JobStatusBadge jobStatus={job.jobStatus} />
        </div>
        <JobCardInformation job={job} />
        <div className="flex flex-wrap justify-between min-[1000px]:flex-row flex-col min-[1000px]:gap-4 gap-2 mt-5">
          <div className="flex flex-wrap gap-2">
            <JobBadge badgeType={job.employmentType} />
            <JobBadge badgeType={job.compensationType} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-end">
          {job.jobStatus === "pending" && !isExpired && (
            <>
              <Button
                px="10"
                colorScheme="green"
                width="120px"
                fontSize="small"
                fontWeight="normal"
                borderColor="black"
                onClick={() => openModal("approve")}
              >
                Approve
              </Button>
              <Button
                px="10"
                colorScheme="red"
                width="120px"
                fontSize="small"
                fontWeight="normal"
                borderColor="black"
                onClick={() => openModal("reject")}
              >
                Deny
              </Button>
            </>
          )}

          {isExpired && (
            <Button
              px="10"
              colorScheme="yellow"
              width="120px"
              fontSize="small"
              fontWeight="normal"
              borderColor="black"
              onClick={() => openModal("renew")}
            >
              Renew
            </Button>
          )}
        </div>

        <div className="mt-5">
          <JobPostedDate date={job.postDate} />
        </div>
      </div>
      {selectedAction && (
        <JobCardModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirm} action={selectedAction} />
      )}
    </div>
  );
}
