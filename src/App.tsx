import { useState } from "react";
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

function App() {
  const [markText, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const [showPreview, setShowPreview] = useState(false);

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

  return (
    <Box
      className="markdown-body"
      bg={bgColor}
      height="full"
      flex={1}
      fontSize="md"
      minH="100vh"
      textAlign="left"
      p={4}
      overflow="auto"
    >
      <VStack spacing={4} mb={6}>
        <HStack
          w={"100%"}
          mx="auto"
          spacing={6}
          height="100%"
          justifyContent="space-evenly"
        >
          <Box w="full">
            <CodeMirror
              value={markText}
              onChange={handleMarkdownChange}
              theme="dark"
              basicSetup={{
                lineNumbers: false,
              }}
              extensions={[
                markdown({
                  base: markdownLanguage,
                  codeLanguages: languages,
                }),
              ]}
            />
          </Box>
          <Box
            w="full"
            borderRadius="md"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            borderWidth="1px"
            p={4}
            bg={bgColor}
          >
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Box>
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
