import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import {
  Box,
  HStack,
  IconButton,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiMoon, FiSun } from "react-icons/fi";
import "github-markdown-css/github-markdown-dark.css";
import CodeMirror from "@uiw/react-codemirror";
import {
  markdown,
  markdownLanguage,
} from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";
import { EditorView } from "codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import HelperSidebar from "./components/HelperSidebar";

type ViewMode = "markdown" | "preview" | "split";

type EditorProps = {
  markText: string;
  setMarkdown: (value: string) => void;
};

const Editor = ({ markText, setMarkdown }: EditorProps) => {
  return (
    <CodeMirror
      value={markText}
      onChange={setMarkdown}
      theme={githubDark}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
      }}
      extensions={[
        vim(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        EditorView.lineWrapping,
      ]}
    />
  );
};

function App() {
  const [markText, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  useEffect(() => {
    hljs.configure({
      cssSelector: "code",
    });
    hljs.highlightAll();
  }, [html]);

  const handleMarkdownChange = async (
    value: string | undefined,
    event: any
  ) => {
    setMarkdown(value || "");

    try {
      const html = await invoke<string>("parse_markdown", {
        markdown: value,
      });
      setHTML(html);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleMarkdownChange(markText, null);
  }, [markText]);

  return (
    <Box
      className="markdown-body"
      bg={bgColor}
      height="full"
      fontSize="md"
      minH="100vh"
      textAlign="left"
      w="100%"
      p={4}
      overflow="auto"
    >
      <VStack spacing={4} mb={6}>
        <HStack
          mx="auto"
          spacing={6}
          height="100%"
          justifyContent="space-evenly"
          alignItems="flex-start"
          w="100%"
        >
          <Box w="50%">
            <Editor markText={markText} setMarkdown={setMarkdown} />
          </Box>
          <HelperSidebar />
          {/* <Box w="50%" p={4} bg={bgColor}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Box> */}
        </HStack>
        <Box w="100%" textAlign="right">
          <IconButton
            icon={showPreview ? <FiEyeOff /> : <FiEye />}
            onClick={() => setShowPreview(!showPreview)}
            aria-label="Toggle preview"
            variant="ghost"
            size="md"
            mr={4}
          />
          <IconButton
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            aria-label="Toggle dark mode"
            variant="ghost"
            size="md"
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default App;
