'use client';

import ProjectForm from "@/components/create_form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
    return (
      <div className="py-8">
        <div className="bg-gradient-to-r from-cyan-400 to-light-blue-500 h-24 flex items-center">
          <div className="pl-5">            
          </div>
        </div>
        <div className="flex justify-center w-full p-5">
          <Card className="p-4 shadow-md max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Create a New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
}

export default Page;