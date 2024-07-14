"use client";
import ProjectCard from "@/components/project_card";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "@/components/comment";
import { CommentProps} from "@/type";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";
import { getAllCommentsGraphQl } from "@/api/suifund";
import { useSuiClient } from "@mysten/dapp-kit";
import { getRealDate } from "@/lib/utils";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { selectedProject } = useProject();
  const [comments, setComments] = useState<CommentProps[]>([]);
  useEffect(() => {
    if (!selectedProject) {
      router.push("/");
    }
    getAllCommentsGraphQl(selectedProject?.thread!).then((result) => {
      const comments: CommentProps[] = result.map((comment) => {
        return {
          content: comment.content,
          date: getRealDate(comment.timestamp),
          isRelpy:comment.reply?true:false,
          author:comment.creator
        };
      });
      setComments(comments);
    });
  }, [selectedProject, router]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
        <ProjectImage imageUrl={selectedProject?.image_url!} height={320} />
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
        <div>
          <Button className="w-full h-20" variant={"ghost"}>New Comment</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
