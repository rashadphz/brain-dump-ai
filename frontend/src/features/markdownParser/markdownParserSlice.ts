import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MarkdownParserState {
  rawText: string;
  parsedText: string;
}

const initialState: MarkdownParserState = {
  rawText: "",
  parsedText: "",
};

export const markdownParserSlice = createSlice({
  name: "markdownParser",
  initialState,
  reducers: {
    handleRawTextChange: (state, action: PayloadAction<string>) => {
      state.rawText = action.payload;
    },
    handleParsedTextChange: (
      state,
      action: PayloadAction<string>
    ) => {
      state.parsedText = action.payload;
    },
  },
});

export const { handleRawTextChange, handleParsedTextChange } =
  markdownParserSlice.actions;

export default markdownParserSlice.reducer;
