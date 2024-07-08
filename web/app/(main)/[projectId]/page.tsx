'use client';
import ProjectCard from "@/components/project_card";
import Comment from "@/components/comment";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectRecord } from "@/type";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";

const Page = ({ params }: { params: string }) => {
  const router = useRouter();
  const { selectedProject } = useProject();
  useEffect(() => {
    if (!selectedProject) {
      router.push("/");
    }
  }, [selectedProject, router]);
  const comments = [
    {
      author: "bob",
      date: "2024/06/22 12:50:25",
      content: "This is a great Job!",
      replies: [
        {
          author: "Jason",
          date: "2024/06/22 12:50:25",
          content: "Sure!",
        },
        {
          author: "Delon",
          date: "2024/06/23 12:50:25",
          content: "Nice!",
        },
      ],
    },
    {
      author: "bob",
      date: "2024/06/22 12:50:25",
      content: "This is a great Job!",
    },
    {
      author: "bob",
      date: "2024/06/22 12:50:25",
      content: "This is a great Job!",
    },
  ];
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
        <Image
          src={selectedProject?.image_url!}
          alt="image"
          fill={true}
          objectFit="cover"
        ></Image>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between gap-x-10">
          <Card className="p-4 min-w-96 w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Description</CardTitle>
            </CardHeader>
            <CardContent>{selectedProject?.description}</CardContent>
          </Card>
          <div className="min-w-96">
            <ProjectCard isDetail {...selectedProject!}></ProjectCard>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <Comment key={index} {...comment} />
        ))}
      </div>
    </div>
  );
};

export default Page;
