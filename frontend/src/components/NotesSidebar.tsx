import {
  Text,
  Badge,
  Box,
  Heading,
  VStack,
  ChakraProvider,
  HStack,
} from "@chakra-ui/react";
import { Note } from "../db/dbservice";

const NotePreview = ({ note }: { note: Note }) => {
  const { title, content, tags } = note;
  return (
    <ChakraProvider resetCSS>
      <Box
        borderColor="gray.700"
        borderTopWidth="1px"
        borderBottomWidth="1px"
        px={4}
        py={3}
        backgroundColor="gray.900"
      >
        <VStack spacing={2} align="start">
          <Heading as="h4" size="sm">
            {title}
          </Heading>
          <VStack align="start" spacing={0}>
            <HStack spacing={2}>
              <Text fontSize="sm" color="blue.300">
                a few seconds
              </Text>
              {tags.map((tag) => (
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
              {content}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

const NotesSidebar = ({ notes }: { notes: Note[] }) => {
  return (
    <Box height="100%">
      <Box mx="auto" height="100%" alignItems="flex-start">
        {notes.map((note) => {
          return <NotePreview note={note} />;
        })}
      </Box>
    </Box>
  );
};

export default NotesSidebar;
