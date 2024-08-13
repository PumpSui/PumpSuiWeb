"use client";
import Doc from "../markdown/doc.mdx";
import "github-markdown-css/github-markdown.css";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    // 设置深色模式
    document.documentElement.setAttribute("data-color-mode", "dark");
    document.documentElement.setAttribute("data-dark-theme", "dark");
  }, []);

  return (
    <div
      className="markdown-body p-20"
      style={{ padding: "50px", backgroundColor: "#0d1117", color: "#c9d1d9" }}
    >
      <Doc />
    </div>
  );
};

export default Page;
