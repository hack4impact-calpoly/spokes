import JobCard from "@/components/JobCard";

export default function Page() {
  return (
    <div>
      <div className="flex flex-row gap-5 w-full">
        <JobCard></JobCard>
        <JobCard></JobCard>
        <JobCard></JobCard>
      </div>
    </div>
  );
}
