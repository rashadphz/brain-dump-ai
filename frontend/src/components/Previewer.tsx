import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import { useEffect } from "react";

const Previewer = ({ html }: { html: string }) => {
  useEffect(() => {
    hljs.configure({
      cssSelector: "code",
    });
    hljs.highlightAll();
  }, [html]);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Previewer;
