import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommandModalState {
  isOpen: boolean;
}

const initialState: CommandModalState = {
  isOpen: false,
};

export const commandModalSlice = createSlice({
  name: "commandModal",
  initialState,
  reducers: {
    handleOpen: (state) => {
      state.isOpen = true;
    },
    handleClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const { handleOpen, handleClose } = commandModalSlice.actions;

export default commandModalSlice.reducer;
