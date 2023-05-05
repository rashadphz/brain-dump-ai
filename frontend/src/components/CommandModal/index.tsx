import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  useReduxDispatch,
  useReduxSelector,
} from "../../redux/hooks";
import { handleClose } from "./commandModalSlice";
import React from "react";

const CommandModal = () => {
  const isOpen = useReduxSelector(
    (state) => state.commandModal.isOpen
  );
  const dispatch = useReduxDispatch();

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(handleClose())}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Modal body text goes here.</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => dispatch(handleClose())}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(CommandModal);
