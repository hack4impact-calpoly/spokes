import JobCard from "@/components/JobCard";
import React from "react";
import JobsFilter from "@/components/JobsFilter";
import JobsHeader from "@/components/JobsHeader";

// fake data
const jobs = [
  {
    title: "Frontend Developer",
    companyName: "MacroSoft",
    datePosted: "2024-12-28",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam reprehenderit rerum repudiandae ipsam velit beatae itaque explicabo molestiae dolores laudantium, dolore, voluptatum necessitatibus doloribus perferendis quis tempore culpa, dicta exercitationem?",
    tags: ["React", "JavaScript", "Full-time"],
    applyUrl: "#",
  },
  {
    title: "Backend Developer",
    companyName: "Innovate Inc.",
    datePosted: "2024-12-20",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam reprehenderit rerum repudiandae ipsam velit beatae itaque explicabo molestiae dolores laudantium, dolore, voluptatum necessitatibus doloribus perferendis quis tempore culpa, dicta exercitationem?",
    tags: ["Node.js", "Express", "MongoDB"],
    applyUrl: "#",
  },
  {
    title: "Full Stack Developer",
    companyName: "CodeXYZ",
    datePosted: "2024-12-23",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam reprehenderit rerum repudiandae ipsam velit beatae itaque explicabo molestiae dolores laudantium, dolore, voluptatum necessitatibus doloribus perferendis quis tempore culpa, dicta exercitationem?",
    tags: ["React", "Node.js", "Paid"],
    applyUrl: "#",
  },
  {
    title: "UI/UX Designer",
    companyName: "FutureDesign",
    datePosted: "2024-12-25",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam reprehenderit rerum repudiandae ipsam velit beatae itaque explicabo molestiae dolores laudantium, dolore, voluptatum necessitatibus doloribus.",
    tags: ["Figma", "Wireframing", "Prototyping"],
    applyUrl: "#",
  },
  {
    title: "Data Scientist",
    companyName: "DataStream",
    datePosted: "2024-12-23",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam reprehenderit rerum repudiandae ipsam velit beatae itaque explicabo molestiae dolores laudantium, dolore, voluptatum necessitatibus doloribus perferendis quis tempore culpa, dicta exercitationem.",
    tags: ["Python", "Data Analysis"],
    applyUrl: "#",
  },
];

export default function JobsPage() {
  return (
    <section className="flex flex-col gap-12 pb-8">
      <JobsHeader />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 xl:px-12 2xl:px-0 flex flex-col lg:flex-row md:justify-between gap-8">
        <JobsFilter />
        <div>
          <h2 className="text-3xl font-medium mb-6">Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 flex-wrap gap-8 ">
            {jobs.map((job, index) => (
              <JobCard
                key={index}
                title={job.title}
                description={job.description}
                tags={job.tags}
                companyName={job.companyName}
                datePosted={job.datePosted}
                applyUrl={job.applyUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
