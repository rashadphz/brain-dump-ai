import {
  Text,
  Badge,
  Box,
  Heading,
  VStack,
  ChakraProvider,
  HStack,
  Button,
  Input,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import NoteService, { Note } from "../db/dbservice";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";

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
                onClick={deleteNote}
              />
            )}
          </HStack>
          <VStack align="start" spacing={0}>
            <HStack spacing={2}>
              <Text fontSize="sm" color="blue.300">
                a few seconds
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

const NotesSidebar = ({
  notes,
  selectedNote,
  onSelectNote: setSelectedNote,
}: {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
}) => {
  return (
    <Box height="100%">
      <Box mx="auto" height="100%" alignItems="flex-start">
        <HStack pl={4} spacing={2} mb={4}>
          <Input placeholder="Search Notes" size="sm" />
          <IconButton
            aria-label="Search database"
            icon={<HiOutlinePencilAlt />}
            backgroundColor="transparent"
            size="lg"
            onClick={NoteService.createNote}
          />
        </HStack>
        {notes.map((note) => {
          const isSelected = note._id === selectedNote?._id;
          return (
            <Box onClick={() => setSelectedNote(note)}>
              <NotePreview isSelected={isSelected} note={note} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default NotesSidebar;
