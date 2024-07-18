// components/Comment.tsx
import { CommentProps } from "@/type";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Comment: React.FC<CommentProps> = ({
  id,
  author,
  date,
  content,
  replies,
  isReply,
  islike,
  likeCount,
  index,
  onReplySubmit,
  onLikeSubmit,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  function handleLikeClick(): void {
    if (onLikeSubmit) {
      onLikeSubmit(islike, index);
    }
  }

  function handleReplyClick(): void {
    setShowReplyInput(!showReplyInput);
  }

  function handleReplySubmit(): void {
    if (onReplySubmit && id) {
      onReplySubmit(replyContent, id);
      setReplyContent("");
      setShowReplyInput(false);
    }
  }

  return (
    <div className="bg-secondary border px-4 py-2 rounded-lg mb-2">
      <div className="flex items-center">
        <p className="truncate max-w-36 font-bold text-cyan-300">@{author}</p>
        <span className="ml-2 text-gray-500">{date}</span>
        {!islike ? (
          <FaRegHeart
            onClick={handleLikeClick}
            className="hover:scale-150 hover:cursor-pointer ml-4 text-red-400"
          />
        ) : (
          <FaHeart
            onClick={handleLikeClick}
            className="hover:scale-150 hover:cursor-pointer ml-4 text-red-400"
          />
        )}
        <p className="ml-2 text-red-400">{likeCount}</p>
        {!isReply && (
          <Button
            onClick={handleReplyClick}
            className="text-cyan-300"
            variant={"link"}
          >
            [ Reply ]
          </Button>
        )}
      </div>
      <p className="break-words">{content}</p>
      {showReplyInput && (
        <div className="mt-2 relative">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Write your reply..."
            style={{ minHeight: "80px" }} // Optional: to ensure sufficient height for textarea
          />
          <Button
            onClick={handleReplySubmit}
            className="absolute bottom-4 right-4"
            variant={"secondary"}
            disabled={!replyContent}
          >
            Submit
          </Button>
        </div>
      )}
      {replies && replies.length > 0 && (
        <div className="mt-1 ml-4">
          {replies.map((reply, index) => (
            <Comment
              key={index}
              {...reply}
              isReply={true}
              onReplySubmit={onReplySubmit}
              onLikeSubmit={onLikeSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
