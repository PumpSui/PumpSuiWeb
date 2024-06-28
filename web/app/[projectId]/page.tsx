const Page = ({ params }: { params: { projectId: string } }) => {
  return <h1>My Page {params.projectId}</h1>;
};

export default Page;
