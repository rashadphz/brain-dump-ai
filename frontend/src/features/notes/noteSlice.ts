import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../../db/dbservice";

interface NoteState {
  selectedNote: Note | null;
}

const initialState: NoteState = {
  selectedNote: null,
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    selectNote: (state, action: PayloadAction<Note | null>) => {
      state.selectedNote = action.payload;
    },
  },
});

export const { selectNote } = noteSlice.actions;

export default noteSlice.reducer;
