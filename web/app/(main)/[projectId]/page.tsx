import ProjectCard from "@/components/project_card";
import Comment from "@/components/comment";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = ({ params }: { params: { projectId: string } }) => {
  const project = {
    creator: "alice",
    name: "Project 01",
    progress: 50,
    startDate: "2024/06/05 12:00:00",
    endDate: "2024/08/08 12:00:00",
    description: "This project is to do something",
  };
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
      <div className="rounded-lg overflow-hidden max-h-64">
        <Image
          src={"/images/DemoProject.png"}
          alt="image"
          width={0}
          height={0}
          layout="responsive"
        ></Image>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between gap-x-10">
          <Card className="p-4 min-w-96 w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Description</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <div className="min-w-96">
            <ProjectCard
              creator={project.creator}
              name={project.name}
              progress={project.progress}
              startDate={project.startDate}
              endDate={project.endDate}
              description={project.description}
            ></ProjectCard>
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
