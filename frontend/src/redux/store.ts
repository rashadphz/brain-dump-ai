import { configureStore } from "@reduxjs/toolkit";
import { commandModalSlice } from "../components/CommandModal/commandModalSlice";

export const store = configureStore({
  reducer: {
    commandModal: commandModalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
