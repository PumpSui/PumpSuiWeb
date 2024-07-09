// components/Comment.tsx
import { CommentProps } from "@/type";
import React from "react";
import { Button } from "../ui/button";
import { FaHeart } from "react-icons/fa";

const Comment: React.FC<CommentProps> = ({
  author,
  date,
  content,
  replies,
  isRelpy,
}) => {
  function handleLikeClick(): void {
    console.log("like")
  }

  function handleReplyClick(): void {
    console.log("reply")
  }

  return (
    <div className="bg-secondary border px-4 py-2 rounded-lg mb-2">
      <div className="flex items-center">
        <p className="truncate max-w-36 font-bold text-cyan-300">@{author}</p>{" "}
        {date}
        <FaHeart onClick={handleLikeClick} className="hover:scale-150 hover:cursor-pointer ml-4 text-red-400" />
        <p className="ml-2 text-red-400">0</p>
        {!isRelpy && (
          <Button onClick={handleReplyClick} className="text-cyan-300" variant={"link"}>
            [ Reply ]
          </Button>
        )}
      </div>
      <p>{content}</p>
      {replies && replies.length > 0 && (
        <div className="mt-1 ml-4">
          {replies.map((reply, index) => (
            <Comment key={index} {...reply} isRelpy={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
