import { configureStore } from "@reduxjs/toolkit";
import { commandModalSlice } from "../components/CommandModal/commandModalSlice";
import { markdownParserSlice } from "../features/markdownParser/markdownParserSlice";

export const store = configureStore({
  reducer: {
    commandModal: commandModalSlice.reducer,
    markdownParser: markdownParserSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
