import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import "./titlebar.css";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useColorMode,
  useColorModeValue,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiMoon, FiSun } from "react-icons/fi";
import { FaMarkdown } from "react-icons/fa";
import "github-markdown-css/github-markdown-dark.css";

import HelperSidebar from "./components/HelperSidebar";
import NotesSidebar from "./components/NotesSidebar";

type ViewMode = "markdown" | "preview" | "split";

type EditorProps = {
  markText: string;
  setMarkdown: (value: string) => void;
};
import { Prec } from "@codemirror/state";
import React from "react";
import { Note, NotesService } from "./db/dbservice";
import Editor from "./components/Editor";
import Previewer from "./components/Previewer";
import usePrevious from "./hooks/usePrevious";

const debounce = (func: any, wait: number) => {
  let timeout: any;
  return function executedFunction(...args: any) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function App() {
  const [markText, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const notesService = new NotesService();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const prevSelectedNote = usePrevious(selectedNote);

  const saveNoteToDB = debounce((note: Note) => {
    if (!note._id) {
      return;
    }
    notesService.update(note._id, note.content);
  }, 5000);

  useEffect(() => {
    notesService.getAll().then((notes) => {
      setNotes(notes);
      setSelectedNote(notes[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedNote) return;

    setMarkdown(selectedNote.content);
    if (prevSelectedNote) {
      saveNoteToDB({
        ...prevSelectedNote,
        content: markText,
      });
    }
  }, [selectedNote]);

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
    if (selectedNote) {
      saveNoteToDB({
        ...selectedNote,
        content: markText,
      });
    }
  }, [markText]);

  const CustomTab = React.forwardRef(
    (props: any, ref: React.Ref<any>) => {
      const tabProps = useTab({ ...props, ref });
      const styles = useMultiStyleConfig("Tabs", tabProps);
      const index = props.index;
      const isSelected = !!tabProps["aria-selected"];

      return (
        <Button
          leftIcon={index == 0 ? <FaMarkdown /> : <FiEye />}
          __css={styles.tab}
          borderRadius="0"
          border={0}
          borderBottom={isSelected ? "2px solid" : "none"}
          {...tabProps}
        >
          {tabProps.children}
        </Button>
      );
    }
  );

  return (
    <Box
      bg={bgColor}
      height="full"
      fontSize="md"
      minH="100vh"
      textAlign="left"
      w="100%"
      pt={10}
      pr={5}
      overflow="auto"
    >
      <Flex mx="auto" height="100%" alignItems="flex-start">
        <Box
          w="30%"
          borderRight="1px solid"
          borderColor="gray.700"
          background="gray.900"
          height="100vh"
        >
          <NotesSidebar
            notes={notes}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
          />
        </Box>
        <Box w="70%" px={2} marginRight="2rem">
          <Tabs isLazy>
            <TabList>
              <CustomTab index={0}>Write</CustomTab>
              <CustomTab index={1}>Preview</CustomTab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Editor
                  markText={markText}
                  setMarkdown={setMarkdown}
                />
              </TabPanel>
              <TabPanel>
                <Previewer html={html} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        {/* <Box
          w="30%"
          borderLeft="1px solid"
          borderColor="gray.700"
          height="100vh"
          pl={4}
        >
          <HelperSidebar
            markText={markText}
            setMarkdown={setMarkdown}
          />
        </Box> */}
      </Flex>
    </Box>
  );
}

export default App;
