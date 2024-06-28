'use client';
import { useParams } from "next/navigation";

const Page = () => {
  const { projectId } = useParams();
  return <h1>Edit {projectId}</h1>;
};

export default Page;
