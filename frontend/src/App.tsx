import "./App.css";
import "./titlebar.css";
import {
  Box,
  Button,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { CgScreen } from "react-icons/cg";
import { FaMarkdown } from "react-icons/fa";
import "github-markdown-css/github-markdown-dark.css";

import HelperSidebar from "./components/HelperSidebar";
import NotesSidebar from "./components/NotesSidebar";

import React from "react";
import Editor from "./components/Editor";
import Previewer from "./components/Previewer";
import CommandModal from "./components/CommandModal";

function App() {
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
