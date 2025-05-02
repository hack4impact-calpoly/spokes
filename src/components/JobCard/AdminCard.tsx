import { Button, IconButton } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { IJob } from "@/database/jobSchema";
import JobStatusBadge from "@/components/JobCard/JobStatusBadge";
import JobBadge from "@/components/JobCard/JobBadge";
import JobCardInformation from "@/components/JobCard/JobCardInformation";
import JobPostedDate from "@/components/JobCard/JobPostedDate";
import { useState } from "react";
import JobCardModal from "./JobCardModal";
import { useRouter } from "next/navigation";
import RejectButton from "@/components/RejectButton";

interface JobCardProps {
  job: IJob;
  innerRef?: (node?: Element | null | undefined) => void;
  onUpdateJob?: (jobId: string, status: "approved" | "rejected", approvedDate?: Date) => void;
}

export default function AdminCard({ job, onUpdateJob, innerRef }: JobCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | "renew" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const router = useRouter();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
  const handleConfirm = async () => {
    if (selectedAction === "reject") {
      await sendRejectionEmail(job, rejectionReason);
      if (onUpdateJob) {
        onUpdateJob(job._id, "rejected", new Date());
      }
    }
    if (selectedAction && onUpdateJob) {
      onUpdateJob(job._id, selectedAction === "reject" ? "rejected" : "approved", new Date());
    }
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

  const isExpired = job.approvedDate && new Date(job.approvedDate) < thirtyDaysAgo;

  function handleEditApplicationButton(e: React.ChangeEvent<any>) {
    e.preventDefault();
    router.push(`/jobform?jobId=${job._id}`);
  }

  return (
    <div className="w-full h-full" ref={innerRef}>
      <div className="relative bg-[#f7f7f7] rounded-3xl px-8 py-5 shadow-sm h-full flex flex-col">
        <IconButton
          aria-label="Edit Application"
          // eslint-disable-next-line react/jsx-no-undef
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
        <div className="flex-grow"></div>
        <div className="flex flex-wrap justify-between flex-row min-[1000px]:gap-4 gap-2 items-center">
          <div className="flex flex-wrap gap-2">
            <JobBadge badgeType={job.employmentType} />
            {job.compensationType && <JobBadge badgeType={job.compensationType} />}
          </div>

          <div className="flex flex-wrap gap-2 justify min-[1000px]:mt-0 mt-5">
            {job.jobStatus === "pending" && !isExpired && (
              <>
                <Button
                  className="border"
                  px="10"
                  width="120px"
                  fontSize="small"
                  fontWeight="normal"
                  borderColor="black"
                  backgroundColor={"#f7f7f7"}
                  sx={{
                    _hover: {
                      backgroundColor: "green.300",
                    },
                  }}
                  onClick={() => openModal("approve")}
                >
                  Approve
                </Button>
                <RejectButton
                  className="px-9 w-[120px] text-[14px] text-[#2D3748] border rounded-md border-black bg-[#f7f7f7] hover:bg-red-400"
                  onClick={() => openModal("reject")}
                />
              </>
            )}

            {isExpired && (
              <Button
                className="border"
                px="10"
                width="120px"
                fontSize="small"
                fontWeight="normal"
                borderColor="black"
                backgroundColor={"#f7f7f7"}
                onClick={() => openModal("renew")}
                sx={{
                  _hover: {
                    backgroundColor: "#FFE297",
                  },
                }}
              >
                Renew
              </Button>
            )}
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
          />
        ) : (
          <JobCardModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirm} action={selectedAction} />
        ))}
    </div>
  );
}
