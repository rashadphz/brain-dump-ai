import { useCallback, useEffect, useState } from "react";
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
import React from "react";
import NoteService, { Note } from "./db/dbservice";
import Editor from "./components/Editor";
import Previewer from "./components/Previewer";
import usePrevious from "./hooks/usePrevious";

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

function App() {
  const [markText, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const prevSelectedNote = usePrevious(selectedNote);

  const saveNote = useCallback(
    debounce((modifiedNote: Note) => {
      if (!modifiedNote._id) return;
      NoteService.updateNoteById(modifiedNote._id, modifiedNote);
    }, 1000),
    []
  );

  useEffect(() => {
    const changes = NoteService.subscribe((notes) => {
      setNotes(notes);
      setSelectedNote(notes[0]);
    });

    return () => {
      changes.cancel();
    };
  }, []);

  useEffect(() => {
    NoteService.getAllNotes().then((notes) => {
      setNotes(notes);
      setSelectedNote(notes[0]);
    });
  }, []);

  useEffect(() => {
    if (prevSelectedNote && prevSelectedNote._id) {
      saveNote({
        ...prevSelectedNote,
        content: markText,
      });
    }
    setMarkdown(selectedNote?.content || "");
    updateHTML(selectedNote?.content || "");
  }, [selectedNote]);

  const updateHTML = async (markdown: string) => {
    try {
      const html = await invoke<string>("parse_markdown", {
        markdown,
      });
      setHTML(html);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditorTextChange = (value: string) => {
    saveNote({
      ...selectedNote,
      content: value,
    });
    updateHTML(value);
    setMarkdown(value);
  };

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
      bg="gray.900"
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
            onSelectNote={setSelectedNote}
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
                  onTextChange={handleEditorTextChange}
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
