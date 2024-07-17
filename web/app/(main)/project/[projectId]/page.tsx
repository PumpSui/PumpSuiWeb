// pages/index.tsx
"use client";
import ProjectCard from "@/components/project_card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "@/components/comment";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import NewComment from "@/components/new_comment";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";
import useComments from "@/hooks/useComments";
import useSubmitComment from "@/hooks/useSubmitComment";

const Page = () => {
  const router = useRouter();
  const { selectedProject } = useProject();
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const { comments, fetchComments } = useComments(selectedProject?.thread);
  const { submitComment } = useSubmitComment();

  if (!selectedProject) {
    router.push("/");
    return null;
  }

  const handleNewCommentSubmit = async (content: string) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    await submitComment(
      selectedProject.id,
      content,
      "",
      async () => {
        await fetchComments();
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message.toString(),
        });
      }
    );
  };

  const handleReplySubmit = async (comment: string, id: string) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    await submitComment(
      selectedProject.id,
      comment,
      id,
      async () => {
        await fetchComments();
        toast({
          title: "Success",
          description: "Reply added successfully",
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message.toString(),
        });
      }
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
        <ProjectImage imageUrl={selectedProject.image_url} height={320} />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between gap-x-10">
          <Card className="p-4 min-w-96 w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Description</CardTitle>
            </CardHeader>
            <CardContent>{selectedProject.description}</CardContent>
          </Card>
          <div className="min-w-96">
            <ProjectCard isDetail {...selectedProject} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <Comment key={index} {...comment} onReplySubmit={handleReplySubmit} />
        ))}
        <NewComment onSubmit={handleNewCommentSubmit} />
      </div>
    </div>
  );
};

export default Page;
