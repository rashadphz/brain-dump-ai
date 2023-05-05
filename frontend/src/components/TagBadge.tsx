import { Badge } from "@chakra-ui/react";

const TagBadge = ({ tag }: { tag: string }) => {
  return (
    <Badge
      borderRadius="full"
      px="2"
      colorScheme="blue"
      fontSize="0.8em"
      textTransform="none"
    >
      {tag}
    </Badge>
  );
};

export default TagBadge;
