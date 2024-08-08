"use client";

import ProjectForm from "@/components/create_form";

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Create a New Project
        </h1>
        <div className="rounded-lg shadow-lg p-8 ">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
