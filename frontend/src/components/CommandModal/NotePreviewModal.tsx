import { Box } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import hljs from "highlight.js";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { baseTheme } from "../Previewer";
import remarkGfm from "remark-gfm";

type NotePreviewModalProps = {
  content: string;
};

const NotePreviewModal = ({ content }: NotePreviewModalProps) => {
  useEffect(() => {
    hljs.configure({
      cssSelector: "code",
    });
    hljs.highlightAll();
  }, [content]);

  return (
    <Box
      className="markdown-style"
      px={2}
      fontFamily={"Avenir Next, system-ui, sans-serif"}
      backgroundColor="transparent"
      overflowY="auto"
      height="200"
      pb={200}
      fontSize="sm"
      boxShadow="2xl"
    >
      <ReactMarkdown
        components={ChakraUIRenderer({
          ...baseTheme,
        })}
        children={content}
        remarkPlugins={[remarkGfm]}
      />
    </Box>
  );
};

export default NotePreviewModal;
