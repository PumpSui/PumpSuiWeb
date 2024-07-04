// components/Comment.tsx
import React from "react";

interface CommentProps {
  author: string;
  date: string;
  content: string;
  replies?: CommentProps[];
  isRelpy?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  author,
  date,
  content,
  replies,
  isRelpy
}) => {
  return (
    <div className="bg-secondary border p-4 rounded-lg mb-2">
      <p>
        <strong>@{author}</strong> {date} {!isRelpy&&"[reply]"}
      </p>
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
