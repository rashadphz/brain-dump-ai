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
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCheck, FiClipboard, FiCopy } from "react-icons/fi";
import { Completions } from "../api";

const HelperSidebar = ({
  markText,
  setMarkdown,
}: {
  markText: string;
  setMarkdown: (value: string) => void;
}) => {
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
  const [waitingForCompletion, setWaitingForCompletion] =
    useState<boolean>(false);

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
    setWaitingForCompletion(true);

    const { result } = await Completions.getCompletion(
      markText,
      completionType
    );
    setCompletionText(result);
    setWaitingForCompletion(false);
  };

  const appendTextToDocument = (text: string) => {
    setMarkdown(markText + text);
  };

  return (
    <Box>
      <VStack align="flex-start" w="full">
        <Heading size="md">Auto Prediction</Heading>
        <Switch isChecked={isOn} onChange={handleSwitch}>
          Enable/Disabled
        </Switch>
        <Heading size="md" pt="4">
          Completion Size
        </Heading>
        <Tabs
          onChange={(index) => setTabIndex(index)}
          variant="solid-rounded"
          colorScheme="blue"
          size="sm"
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
        {waitingForCompletion ? (
          <Box
            py={3}
            px={3}
            w="full"
            background="gray.800"
            textAlign="center"
          >
            <Spinner />
          </Box>
        ) : (
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
                hasCopied ? (
                  <Icon as={FiCheck} />
                ) : (
                  <Icon as={FiCopy} />
                )
              }
              onClick={onCopy}
            />
          </HStack>
        )}
        <Button
          onClick={() => appendTextToDocument(completionText)}
          leftIcon={<FiClipboard />}
          w="full"
          mt={6}
          background="gray.900"
        >
          Add text to document
        </Button>
      </VStack>
    </Box>
  );
};

export default HelperSidebar;
