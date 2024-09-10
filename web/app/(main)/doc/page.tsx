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
    <div className="mt-40 p-20 bg-[url('/docbg.png')] bg-cover bg-center h-[calc(100vh-10rem)]">
      <p className="text-yellow-500 text-3xl font-bold uppercase">Deploy Tips</p>
      <div className="mt-10 rounded-xl bg-white p-5 bg-gradient-to-b from-blue-100 to-blue-300 from-60%">
        <div
          className="markdown-body"
          style={{ padding: "20px", backgroundColor: "transparent", color: "black" }}
        >
          <Doc />
        </div>
      </div>

    </div>
  );
};

export default Page;
