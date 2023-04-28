import {
  Text,
  Badge,
  Box,
  Flex,
  Heading,
  VStack,
  ChakraProvider,
  Stack,
} from "@chakra-ui/react";

const NotePreview = () => {
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
            Untitled
          </Heading>
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" color="blue.300">
              a few seconds
            </Text>
            <Text
              fontWeight="medium"
              noOfLines={1}
              fontSize="sm"
              color="gray.400"
            >
              My name is Rashad and I am a student
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

const NotesSidebar = () => {
  return (
    <Box height="100%">
      <Box mx="auto" height="100%" alignItems="flex-start">
        <NotePreview />
        <NotePreview />
        <NotePreview />
        <NotePreview />
        <NotePreview />
      </Box>
    </Box>
  );
};

export default NotesSidebar;
