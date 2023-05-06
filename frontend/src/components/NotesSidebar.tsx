import {
  Text,
  Badge,
  Box,
  Heading,
  VStack,
  ChakraProvider,
  HStack,
  Input,
  IconButton,
  Icon,
  Stack,
  Button,
  Flex,
  Kbd,
} from "@chakra-ui/react";
import NoteService, { Note } from "../db/dbservice";
import { HiOutlinePencilAlt, HiOutlineSearch } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";

import moment from "moment";
import { useReduxSelector, useReduxDispatch } from "../redux/hooks";
import { handleOpen } from "./CommandModal/commandModalSlice";
import {
  globalAllNotesMetadataFetch,
  globalNoteCreate,
  globalNoteDelete,
  globalNoteOpen,
  noteSelectors,
} from "../features/notes/noteSlice";
import { useEffect } from "react";

const NotePreview = ({
  note,
  isSelected,
}: {
  note: Note;
  isSelected: boolean;
}) => {
  const { title, content, tags } = note;

  const deleteNote = () => {
    if (note._id) NoteService.deleteNoteById(note._id);
  };
  const dispatch = useReduxDispatch();

  return (
    <ChakraProvider resetCSS>
      <Box
        borderColor="gray.700"
        borderTopWidth="1px"
        borderBottomWidth="1px"
        px={4}
        py={3}
        backgroundColor={isSelected ? "blue.900" : "gray.900"}
      >
        <VStack spacing={2} align="start">
          <HStack justifyContent={"space-between"} width="100%">
            <Heading as="h4" size="sm">
              {title || "Untitled"}
            </Heading>
            {isSelected && (
              <IconButton
                icon={<Icon as={BsTrash} />}
                aria-label="delete"
                backgroundColor="transparent"
                size="xs"
                onClick={() => dispatch(globalNoteDelete(note))}
              />
            )}
          </HStack>
          <VStack align="start" spacing={0}>
            <HStack spacing={2}>
              <Text fontSize="sm" color="blue.300">
                {moment(note.createdAt).fromNow()}
              </Text>
              {tags &&
                tags.map((tag) => (
                  <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme="blue"
                    fontSize="0.8em"
                    textTransform="none"
                  >
                    {tag}
                  </Badge>
                ))}
            </HStack>
            <Text
              fontWeight="medium"
              noOfLines={1}
              fontSize="sm"
              color="gray.400"
            >
              {content || "Let's get writing!"}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

const NotesSidebar = () => {
  const notes = useReduxSelector(noteSelectors.selectAll);

  const currentNote = useReduxSelector(
    (state) => state.note.selectedNote
  );
  const dispatch = useReduxDispatch();

  useEffect(() => {
    const promise = dispatch(globalAllNotesMetadataFetch());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  return (
    <Box mx="auto" alignItems="flex-start" width="100%">
      <HStack px={3} spacing={2} mb={4}>
        <Button
          flex={1}
          onClick={() => dispatch(handleOpen())}
          width="100%"
          alignItems="center"
          rounded="md"
          shadow="base"
        >
          <Icon boxSize={4} as={HiOutlineSearch} color="gray.500" />
          <HStack
            w="full"
            ml={3}
            spacing={4}
            justifyContent="space-between"
          >
            <Text textAlign="left" color="gray.500" fontSize="sm">
              Search notes
            </Text>
            <HStack spacing={1} textDecoration="none">
              <Kbd rounded={2}>⌘</Kbd>
              <Kbd rounded={2}>K</Kbd>
            </HStack>
          </HStack>
        </Button>
        <IconButton
          aria-label="New Note"
          icon={<HiOutlinePencilAlt />}
          backgroundColor="transparent"
          size="lg"
          onClick={() => dispatch(globalNoteCreate())}
        />
      </HStack>
      <Stack
        maxH="100vh"
        overflowY="auto"
        overflowX="hidden"
        direction="column"
        spacing={0}
        align="start"
        display="block"
        pb={200}
      >
        {notes.map((note) => {
          const isSelected = note._id === currentNote?._id;
          return (
            <Box
              onClick={() =>
                dispatch(globalNoteOpen(note._id || null))
              }
            >
              <NotePreview isSelected={isSelected} note={note} />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default NotesSidebar;
