import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import "../bearstyle.css";
import Markdown from "marked-react";

const Previewer = ({ markdown }: { markdown: string }) => {
  useEffect(() => {
    hljs.configure({
      cssSelector: "code",
    });
    hljs.highlightAll();
  }, [markdown]);

  return (
    <Box
      className="markdown-style"
      mx={20}
      fontFamily={"Avenir Next, system-ui, sans-serif"}
      backgroundColor="transparent"
    >
      <Markdown>{markdown}</Markdown>
    </Box>
  );
};

export default Previewer;
