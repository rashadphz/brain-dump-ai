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
  },
});

export const { handleRawTextChange } = markdownParserSlice.actions;

export default markdownParserSlice.reducer;
