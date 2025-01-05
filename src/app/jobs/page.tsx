import JobCard from "@/components/JobCard";
import React from "react";

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
    <div className="container mx-auto px-4 mt-12 flex flex-wrap gap-8 ">
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
  );
}
