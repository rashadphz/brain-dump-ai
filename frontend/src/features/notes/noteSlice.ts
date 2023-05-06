import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  configureStore,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import NoteService, { Note } from "../../db/dbservice";
import { handleRawTextChange } from "../markdownParser/markdownParserSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "../../redux/store";

export const globalRawTextChange = createAsyncThunk<
  string,
  { rawText: string }
>("note/globalRawTextChange", async (arg, { getState, dispatch }) => {
  const { rawText } = arg;
  // @ts-ignore
  const selectedNote = getState().note.selectedNote;
  return rawText;
});

export const globalAllNotesFetch = createAsyncThunk<Note[], void>(
  "note/globalAllNotesFetch",
  async (arg, { getState, dispatch }) => {
    const notes = await NoteService.getAllNotes();
    return notes;
  }
);

export const globalNoteOpen = createAsyncThunk<Note, Note>(
  "note/globalNoteOpen",
  async (arg, { getState, dispatch }) => {
    const note = arg;
    const rawText = note.content;
    dispatch(handleRawTextChange(rawText));
    return note;
  }
);

export const globalNoteCreate = createAsyncThunk<Note, void>(
  "note/globalNoteCreate",
  async (arg, { getState, dispatch }) => {
    const note = await NoteService.createNote();
    const rawText = note.content;
    dispatch(handleRawTextChange(rawText));
    dispatch(globalNoteOpen(note));
    return note;
  }
);

export const globalNoteSave = createAsyncThunk<void, Note>(
  "note/globalNoteSave",
  async (arg, { getState, dispatch }) => {
    const getNoteTitle = (mkdn: string): string => {
      const match = mkdn.match(/# (.*)$/m);
      return match ? match[1] : "Untitled";
    };

    const getNoteTags = (mkdn: string): string[] => {
      const regex = /(?![-|>])#(\w+\b)+/g;
      const matches = mkdn.match(regex);
      return matches ? matches.map((m) => m.slice(1)) : [];
    };

    const note = arg;
    const rawText = note.content;
    const saveNote = () => {
      if (!note._id) return;

      NoteService.updateNoteById(note._id!, {
        ...note,
        title: getNoteTitle(rawText),
        tags: getNoteTags(rawText),
        content: rawText,
      });

      useDebounce(saveNote, 2000);
    };
  }
);

const NoteAdapter = createEntityAdapter<Note>({
  selectId: (note) => note._id!,
  sortComparer: (a, b) => {
    const d1 = new Date(a.updatedAt!);
    const d2 = new Date(b.updatedAt!);
    return d2.getTime() - d1.getTime();
  },
});

interface NoteState {
  all: EntityState<Note>;
  selectedNote: Note | null;
}

const initialState: NoteState = {
  all: NoteAdapter.getInitialState(),
  selectedNote: null,
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    noteAdd: (state, action: PayloadAction<Note>) => {
      NoteAdapter.addOne(state.all, action.payload);
    },
    noteUpdate: (state, action: PayloadAction<Note>) => {
      NoteAdapter.updateOne(state.all, {
        id: action.payload._id!,
        changes: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(globalNoteOpen.fulfilled, (state, action) => {
        state.selectedNote = action.payload;
        NoteAdapter.upsertOne(state.all, action.payload);
      })
      .addCase(globalAllNotesFetch.fulfilled, (state, action) => {
        NoteAdapter.setAll(state.all, action.payload);
      });
  },
});

export const {} = noteSlice.actions;

export const noteSelectors = NoteAdapter.getSelectors<RootState>(
  (state) => state.note.all
);

export default noteSlice.reducer;
