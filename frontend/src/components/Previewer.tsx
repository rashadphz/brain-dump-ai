import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import {
  Box,
  Checkbox,
  HStack,
  Heading,
  Link,
  ListItem,
  Tag,
  TagLabel,
  UnorderedList,
  Text,
} from "@chakra-ui/react";

import "../bearstyle.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChakraUIRenderer, {
  defaults,
} from "chakra-ui-markdown-renderer";

const baseHeadingProps = {
  fontFamily: "Avenir Next, system-ui, sans-serif",
  color: "#ccdce5",
  fontWeight: 500,
};

const headerMap = new Map([
  ["h1", "1.9em"],
  ["h2", "1.65em"],
  ["h3", "1.25em"],
  ["h4", "1em"],
  ["h5", "1em"],
  ["h6", "1em"],
]);

const baseHeaders: any = {};

for (const [header, fontSize] of headerMap) {
  baseHeaders[header] = (props: any) => (
    <Heading
      fontSize={fontSize}
      py={2}
      {...baseHeadingProps}
      {...props}
      as={header}
    />
  );
}

const baseTheme: typeof defaults = {
  ...baseHeaders,
  h1: (props) => (
    <Heading
      fontSize="1.9em"
      lineHeight={2.5}
      {...baseHeadingProps}
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <Box my={4} borderLeft="4px solid #44a2e5" pl={4} {...props} />
  ),
  ul: (props: any) => (
    <UnorderedList {...props}>{props.children}</UnorderedList>
  ),
  li: (props) => {
    const isTaskListItem = props.className === "task-list-item";
    const { checked, children } = props;
    if (isTaskListItem) {
      return (
        <ListItem listStyleType="none">
          <Checkbox isChecked={checked || false}>{children}</Checkbox>
        </ListItem>
      );
    }

    return (
      <ListItem
        listStyleType="none"
        _before={
          isTaskListItem
            ? {}
            : {
                content: "'•'",
                color: "#44a2e5",
                width: "2em",
                marginRight: "0.5em",
              }
        }
        {...props}
      />
    );
  },
  input: (props) => {
    return <></>;
  },
  code: (props: any) => {
    return (
      <Box
        as="code"
        fontFamily="mono"
        fontSize="0.85em"
        borderColor="gray.500"
        borderWidth="1px"
        borderRadius="lg"
        my={4}
        {...props}
      />
    );
  },
  p: (props) => {
    const { children, node } = props;
    if (!node || !children || !children[0] || children.length > 1) {
      return <Text mb={5} as="p" {...props} />;
    }
    const text = children[0].toString();
    const regex = /(#\w+\b)+/g;
    const segments = text
      .split(regex)
      .filter((s) => s !== " " && s !== "");

    const result = segments.map((segment) => {
      if (segment.startsWith("#")) {
        return (
          <Tag
            onClick={() => console.log("clicked" + segment)}
            _hover={{ cursor: "pointer" }}
            size="md"
            colorScheme="blue"
            borderRadius="2xl"
          >
            <TagLabel>{segment}</TagLabel>
          </Tag>
        );
      }
      return <Text mb={5} as="p" {...props} />;
    });

    return <HStack spacing={2}>{result}</HStack>;
  },
  a: (props) => <Link color="#44a2e5" {...props} />,
};

const Previewer = ({ markdown }: { markdown: string }) => {
  useEffect(() => {
    hljs.configure({
      cssSelector: "code",
    });
    hljs.highlightAll();
  }, [markdown]);

  return (
    <Box
      className="markdown-style"
      px={20}
      fontFamily={"Avenir Next, system-ui, sans-serif"}
      backgroundColor="transparent"
      overflowY="auto"
      maxHeight="100vh"
      pb={200}
    >
      <ReactMarkdown
        components={ChakraUIRenderer({
          ...baseTheme,
        })}
        children={markdown}
        remarkPlugins={[remarkGfm]}
      />
    </Box>
  );
};

export default Previewer;
