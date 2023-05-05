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
} from "@chakra-ui/react";
import NoteService, { Note } from "../db/dbservice";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { useEffect, useState } from "react";

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
  setNotes,
  selectedNote,
  onSelectNote: setSelectedNote,
}: {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
}) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchNotes = async () => {
      const notes = await NoteService.searchNotes(search);
      setNotes(notes);
    };
    searchNotes();
  }, [search]);

  return (
    <Box mx="auto" alignItems="flex-start" width="100%">
      <HStack pl={4} spacing={2} mb={4}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Notes"
          size="sm"
        />
        <IconButton
          aria-label="Search database"
          icon={<HiOutlinePencilAlt />}
          backgroundColor="transparent"
          size="lg"
          onClick={NoteService.createNote}
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
          const isSelected = note._id === selectedNote?._id;
          return (
            <Box onClick={() => setSelectedNote(note)}>
              <NotePreview isSelected={isSelected} note={note} />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default NotesSidebar;
