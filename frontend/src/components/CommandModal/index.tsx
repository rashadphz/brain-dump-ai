import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  Flex,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  useReduxDispatch,
  useReduxSelector,
} from "../../redux/hooks";
import { handleClose, handleOpen } from "./commandModalSlice";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineFileText } from "react-icons/ai";
import { FiFilePlus, FiFileText } from "react-icons/fi";
import NoteService, { Note } from "../../db/dbservice";
import { take } from "lodash";
import TagBadge from "../TagBadge";
import { globalNoteOpen } from "../../features/notes/noteSlice";
import NotePreviewModal from "./NotePreviewModal";

type CommandItemProps = {
  name: string;
  icon: React.ElementType;
  rightElement?: React.ReactNode;
};

const CommandItem = ({
  name,
  icon,
  rightElement,
}: CommandItemProps) => {
  return (
    <ListItem
      cursor="pointer"
      display="flex"
      alignItems="center"
      _hover={{ backgroundColor: "gray.700" }}
      py={1}
      px={2}
      borderRadius="md"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <ListIcon as={icon} color="gray.500" />
        <Text fontWeight="medium" fontSize="sm">
          {name}
        </Text>
      </Flex>
      {rightElement}
    </ListItem>
  );
};

type NoteItemProps = {
  name: string;
  icon: React.ElementType;
  tags: string[];
  focused: boolean;
};

const NoteItem = ({ name, icon, tags, focused }: NoteItemProps) => {
  return (
    <ListItem
      cursor="pointer"
      display="flex"
      alignItems="center"
      _hover={{ backgroundColor: "gray.700" }}
      backgroundColor={focused ? "gray.700" : "transparent"}
      py={1}
      px={2}
      borderRadius="md"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <ListIcon as={icon} color="gray.500" />
        <Text fontWeight="medium" fontSize="sm">
          {name}
        </Text>
      </Flex>
      <HStack spacing={1}>
        {take(tags, 2).map((tag) => (
          <TagBadge tag={tag} />
        ))}
      </HStack>
    </ListItem>
  );
};

export type ModalSectionProps = {
  title: string;
  children: React.ReactNode;
};
const ModalSection = ({ title, children }: ModalSectionProps) => {
  return (
    <>
      <Text fontWeight="bold" color="gray.500" fontSize="sm">
        {title}
      </Text>
      <List width="full">{children}</List>
    </>
  );
};

const CommandModal = () => {
  const isOpen = useReduxSelector(
    (state) => state.commandModal.isOpen
  );
  const dispatch = useReduxDispatch();

  const [search, setSearch] = useState("");
  const [searchResultNotes, setSearchResultNotes] = useState<Note[]>(
    []
  );
  const [focusedItem, setFocusedItem] = useState<number>(-1);
  const [focusedNote, setFocusedNote] = useState<Note | null>(null);

  useEffect(() => {
    const searchNotes = async () => {
      const notes = await NoteService.searchNotes(search);
      setSearchResultNotes(notes);
    };
    searchNotes();
  }, [search]);

  useEffect(() => {
    if (focusedItem >= 0 && focusedItem < searchResultNotes.length) {
      const note = searchResultNotes[focusedItem];
      setFocusedNote(note);
    } else {
      setFocusedNote(null);
    }
  }, [focusedItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey && e.key === "k")) return;

      if (isOpen) dispatch(handleClose());
      else dispatch(handleOpen());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectItem = (itemIndex: number) => {
    const note = searchResultNotes[itemIndex];
    const noteId = note._id;
    dispatch(handleClose());
    dispatch(globalNoteOpen(noteId || null));
    setSearch("");
  };

  const handleInputKeydown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setFocusedItem((old) => old + 1);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setFocusedItem((old) => old - 1);
        break;
      }
      case "Enter": {
        event.preventDefault();
        handleSelectItem(focusedItem);
      }
    }
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={() => dispatch(handleClose())}
    >
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        backgroundColor="transparent"
        color="white"
        borderRadius="2xl"
      >
        <Box backgroundColor="transparent" height="200">
          {focusedNote ? (
            <ModalHeader
              rounded="xl"
              backgroundColor="gray.900"
              width="90%"
              mx="auto"
            >
              <NotePreviewModal content={focusedNote.content} />
            </ModalHeader>
          ) : (
            <></>
          )}
        </Box>
        <ModalBody mt={20} rounded="xl" bgColor="gray.900" px={1}>
          <Box borderBottomWidth="1px" mb={5}>
            <InputGroup>
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedItem(-1);
                }}
                placeholder="Search note or type command..."
                border="none"
                width="full"
                shadow="none"
                _focus={{ shadow: "none", border: "none" }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onKeyDown={handleInputKeydown}
              />
              <InputLeftElement pointerEvents="none">
                <Icon as={AiOutlineSearch} color="gray.300" />
              </InputLeftElement>
              <InputRightElement mx={2} pointerEvents="none">
                <Text fontSize="md" color="gray.500">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </Text>
              </InputRightElement>
            </InputGroup>
          </Box>
          <VStack px={3} align="start" spacing={2}>
            <ModalSection
              title={search === "" ? "Recents" : "Results"}
            >
              {take(searchResultNotes, 5).map((note, idx) => (
                <Box
                  key={note._id}
                  onClick={() => {
                    handleSelectItem(idx);
                  }}
                  onMouseOver={() => setFocusedItem(idx)}
                >
                  <NoteItem
                    icon={FiFileText}
                    name={note.title}
                    tags={note.tags}
                    focused={focusedItem == idx}
                  />
                </Box>
              ))}
            </ModalSection>
            <ModalSection title="Actions">
              <CommandItem
                icon={FiFilePlus}
                name="Create New Note..."
                rightElement={
                  <Text fontSize="md" color="gray.500">
                    <Kbd>⌘</Kbd> + <Kbd>N</Kbd>
                  </Text>
                }
              />
            </ModalSection>
          </VStack>
        </ModalBody>
        <ModalFooter px={1} py={0}>
          <HStack
            px={3}
            py={3}
            borderTopWidth="1px"
            width="full"
            spacing={5}
            justifyContent="space-between"
          >
            <Text fontWeight="medium" color="gray.500" fontSize="sm">
              Suggestions <Kbd>TAB</Kbd>
            </Text>
            <Text fontWeight="medium" color="gray.500" fontSize="sm">
              Open <Kbd>↵</Kbd>
            </Text>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(CommandModal);
