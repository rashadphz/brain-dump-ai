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
import { CgScreen } from "react-icons/cg";
import { FaMarkdown } from "react-icons/fa";
import "github-markdown-css/github-markdown-dark.css";

import HelperSidebar from "./components/HelperSidebar";
import NotesSidebar from "./components/NotesSidebar";

import React from "react";
import NoteService, { Note, NoteChangeType } from "./db/dbservice";
import Editor from "./components/Editor";
import Previewer from "./components/Previewer";
import CommandModal from "./components/CommandModal";
import { useReduxDispatch } from "./redux/hooks";
import { globalNoteOpen } from "./features/notes/noteSlice";

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const dispatch = useReduxDispatch();

  const getNoteTitle = (mkdn: string): string => {
    const match = mkdn.match(/# (.*)$/m);
    return match ? match[1] : "Untitled";
  };

  const getNoteTags = (mkdn: string): string[] => {
    const regex = /(?![-|>])#(\w+\b)+/g;
    const matches = mkdn.match(regex);
    return matches ? matches.map((m) => m.slice(1)) : [];
  };

  const saveNote = useCallback(
    debounce((modifiedNote: Note) => {
      if (!modifiedNote._id) return;
      const title = getNoteTitle(modifiedNote.content);
      const tags = getNoteTags(modifiedNote.content);

      NoteService.updateNoteById(modifiedNote._id, {
        ...modifiedNote,
        title,
        tags,
      });
    }, 1000),
    []
  );

  //   useEffect(() => {
  //     const changes = NoteService.subscribe(
  //       ({ note, changeType: type }) => {
  //         if (type == "CREATED") {
  //           setNotes((notes) => [note!, ...notes]);
  //           setSelectedNote(note!);
  //         } else if (type == "UPDATED") {
  //           setNotes((notes) =>
  //             notes.map((n) => (n._id == note!._id ? note! : n))
  //           );
  //           setSelectedNote((prev) =>
  //             prev?._id == note!._id ? note! : prev
  //           );
  //         } else if (type == "DELETED") {
  //           NoteService.getAllNotes().then((notes) => {
  //             setNotes(notes);
  //             setSelectedNote(notes[0]);
  //           });
  //         }
  //       }
  //     );

  //     return () => {
  //       changes.cancel();
  //     };
  //   }, []);

  useEffect(() => {
    NoteService.getAllNotes().then((notes) => {
      setNotes(notes);
      dispatch(globalNoteOpen({ ...notes[0] }));
    });
  }, []);

  const CustomTab = React.forwardRef(
    (props: any, ref: React.Ref<any>) => {
      const tabProps = useTab({ ...props, ref });
      const styles = useMultiStyleConfig("Tabs", tabProps);
      const index = props.index;
      const isSelected = !!tabProps["aria-selected"];

      return (
        <Button
          leftIcon={index == 0 ? <FaMarkdown /> : <CgScreen />}
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
      fontSize="md"
      height="100%"
      textAlign="left"
      w="100%"
      pt={10}
      pr={5}
      overflow="hidden"
    >
      <Flex mx="auto" height="100%" alignItems="flex-start">
        <Box
          w="30%"
          borderRight="1px solid"
          borderColor="gray.700"
          background="gray.900"
          height="100vh"
        >
          <NotesSidebar />
        </Box>
        <Box w="70%" px={2} marginRight="1rem">
          <Tabs isLazy>
            <TabList>
              <CustomTab index={0}>Write</CustomTab>
              <CustomTab index={1}>Preview</CustomTab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Editor />
              </TabPanel>
              <TabPanel>
                <Previewer />
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
      <CommandModal />
    </Box>
  );
}

export default App;
