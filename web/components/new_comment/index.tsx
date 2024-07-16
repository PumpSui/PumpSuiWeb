// components/NewComment.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";

const NewComment: React.FC<{ onSubmit: (content: string) => void }> = ({
  onSubmit,
}) => {
  const [content, setContent] = useState("");

  function handleSubmit(): void {
    onSubmit(content);
    setContent("");
  }

  return (
    <div className="mt-2 relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-md"
        placeholder="Add a new comment..."
        style={{ minHeight: "80px" }} // Optional: to ensure sufficient height for textarea
      />
      <Button
        onClick={handleSubmit}
        className="absolute bottom-4 right-4"
        variant={"secondary"}
        disabled={!content}
      >
        Submit
      </Button>
    </div>
  );
};

export default NewComment;
