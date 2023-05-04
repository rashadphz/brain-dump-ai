import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import "../bearstyle.css";

const Previewer = ({ html }: { html: string }) => {
  useEffect(() => {
    hljs.configure({
      cssSelector: "code",
    });
    hljs.highlightAll();
  }, [html]);

  return (
    <Box
      className="markdown-style"
      mx={20}
      fontFamily={"Avenir Next, system-ui, sans-serif"}
      dangerouslySetInnerHTML={{ __html: html }}
      backgroundColor="transparent"
    />
  );
};

export default Previewer;
