"use client";

import ProjectForm from "@/components/create_form";

const Page = () => {
  return (
    <div className="min-h-screen mt-52 bg-[url('/createbg.png')] bg-cover bg-center">
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold text-white mb-8 pl-8">
          Create a New Project
        </h1>
        <div className="rounded-lg p-8 ">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
