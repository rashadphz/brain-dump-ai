import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Note } from "../../db/dbservice";
import { handleRawTextChange } from "../markdownParser/markdownParserSlice";

interface NoteState {
  selectedNote: Note | null;
}

const initialState: NoteState = {
  selectedNote: null,
};

export const globalNoteOpen = createAsyncThunk<Note, Note>(
  "note/globalNoteOpen",
  async (arg, { getState, dispatch }) => {
    const note = arg;
    const rawText = note.content;
    dispatch(handleRawTextChange(rawText));
    return note;
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(globalNoteOpen.fulfilled, (state, action) => {
      state.selectedNote = action.payload;
    });
  },
});

export const {} = noteSlice.actions;

export default noteSlice.reducer;
