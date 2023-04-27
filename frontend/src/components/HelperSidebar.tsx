import {
  Icon,
  IconButton,
  Text,
  Box,
  VStack,
  Switch,
  Heading,
  Tabs,
  Tab,
  TabList,
  useClipboard,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCheck, FiClipboard, FiCopy } from "react-icons/fi";
import { Completions } from "../api";

const HelperSidebar = () => {
  const [isOn, setIsOn] = useState(false);
  const {
    onCopy,
    value: completionText,
    setValue: setCompletionText,
    hasCopied,
  } = useClipboard("This is the inital value");

  const [tabIndex, setTabIndex] = useState(0);
  const [completionType, setCompletionType] = useState<
    "word" | "sentence" | "multi-line"
  >("word");

  const handleSwitch = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    switch (tabIndex) {
      case 0:
        setCompletionType("word");
        break;
      case 1:
        setCompletionType("sentence");
        break;
      case 2:
        setCompletionType("multi-line");
        break;
      default:
        setCompletionType("word");
        break;
    }
  }, [tabIndex]);

  const completeText = async () => {
    const { result } = await Completions.getCompletion(
      "I am an avid user of Ruby on Rails. I ",
      completionType
    );
    setCompletionText(result);
  };

  return (
    <Box w="full" h="full" borderLeft="1px" px="5">
      <VStack align="flex-start" w="full">
        <Heading size="lg">Auto Prediction</Heading>
        <Switch isChecked={isOn} onChange={handleSwitch}>
          Enable/Disabled
        </Switch>
        <Heading size="lg" pt="4">
          Completion Size
        </Heading>
        <Tabs
          onChange={(index) => setTabIndex(index)}
          variant="solid-rounded"
          colorScheme="red"
        >
          <TabList>
            <Tab>Word</Tab>
            <Tab>Sentence</Tab>
            <Tab>Multi-line</Tab>
          </TabList>
        </Tabs>
        <Button
          onClick={completeText}
          w="full"
          mt={6}
          background="gray.900"
        >
          Make a suggestion
        </Button>
        <HStack
          py={3}
          px={3}
          align="center"
          justify="space-between"
          w="full"
          background="gray.800"
          rounded="lg"
        >
          <Text fontSize="md" fontWeight="medium" mr={2}>
            {completionText}
          </Text>
          <IconButton
            aria-label="Copy"
            icon={
              hasCopied ? <Icon as={FiCheck} /> : <Icon as={FiCopy} />
            }
            onClick={onCopy}
          />
        </HStack>
        <Button
          leftIcon={<FiClipboard />}
          w="full"
          mt={6}
          background="gray.900"
        >
          Add text to end of document
        </Button>
      </VStack>
    </Box>
  );
};

export default HelperSidebar;
