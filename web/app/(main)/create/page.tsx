'use client';

import ProjectForm from "@/components/create_form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
    return (
      <div className="py-8">
        <div className="container max-w-lg mx-auto p-4">
          <Card className="p-4 shadow-md">
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