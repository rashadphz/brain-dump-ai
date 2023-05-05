import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useState } from "react";

const ContextMenu = ({}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [position, setPosition] = useState({ left: 0, top: 0 });

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    console.log("opening");
    setIsOpen(true);
    setPosition({ left: e.clientX, top: e.clientY });
  };
  return (
    <>
      <div onContextMenu={handleContextMenu}></div>
      <Menu isOpen={true} onClose={() => setIsOpen(false)}>
        <MenuList>
          <MenuItem>Menu item 1</MenuItem>
          <MenuItem>Menu item 2</MenuItem>
          <MenuItem>Menu item 3</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default ContextMenu;
