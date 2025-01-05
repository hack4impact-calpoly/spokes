import Image from "next/image";

export default function JobsHeader() {
  return (
    <header className="w-screen h-[500px] relative">
      <Image
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        width={1200}
        height={1200}
        className="w-full h-full object-cover"
      />
      {/* overlay */}
      <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-white/0 to-black/80"></div>

      <div className="z-20 absolute top-0 bottom-0 left-0 right-0 m-auto max-w-[1440px] h-[70%] flex items-end px-6 sm:px-8 xl:px-12">
        <h1 className="text-5xl font-semibold tracking-wide text-white">Job Board</h1>
      </div>
    </header>
  );
}
