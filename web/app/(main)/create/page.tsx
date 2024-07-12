'use client';

import ProjectForm from "@/components/create_form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
    return (
      <div className="py-8">
        <div className="bg-gradient-to-r from-cyan-400 to-light-blue-500 h-24 flex items-center">
          <div className="pl-5">
            <h1 className="text-4xl text-white">Create a New Project</h1>
          </div>
        </div>
        <div className="flex justify-center gap-x-10 p-4">
          <Card className="p-4 min-w-96 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Explanation</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="p-4 shadow-md w-[450px]">
            <CardHeader>
              <CardTitle className="text-2xl">Create a New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm/>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}

export default Page;