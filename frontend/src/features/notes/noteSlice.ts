import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import NoteService, { Note } from "../../db/dbservice";
import { handleRawTextChange } from "../markdownParser/markdownParserSlice";
import { RootState } from "../../redux/store";
import { debounce } from "lodash";
import { UploadService } from "../../client";

export const globalRawTextChange = createAsyncThunk<
  string,
  { rawText: string }
>("note/globalRawTextChange", async (arg, { getState, dispatch }) => {
  const { rawText } = arg;
  // @ts-ignore
  const selectedNote = getState().note.selectedNote;

  const note = {
    ...selectedNote,
    content: rawText,
  };

  dispatch(globalNoteSave(note));
  return rawText;
});

export const globalAllNotesMetadataFetch = createAsyncThunk<
  Note[],
  void
>("note/globalAllNotesFetch", async (arg, { getState, dispatch }) => {
  const notes = await NoteService.getAllNotesMetadata();
  return notes;
});

export const globalNoteOpen = createAsyncThunk<
  Note | null,
  string | null
>("note/globalNoteOpen", async (arg, { getState, dispatch }) => {
  const noteId = arg;
  if (noteId === null) {
    dispatch(handleRawTextChange(""));
    return null;
  }
  const note = await NoteService.getNoteById(noteId);
//   const ok = await UploadService.uploadNote({
//     note_id: note._id!,
//     title: note.title,
//     markdown: note.content,
//   });
//   console.log(ok)
  dispatch(handleRawTextChange(note.content));
  return note;
});

export const globalNoteCreate = createAsyncThunk<Note, void>(
  "note/globalNoteCreate",
  async (arg, { getState, dispatch }) => {
    const note = await NoteService.createNote();
    const rawText = note.content;
    dispatch(globalNoteOpen(note._id!));
    return note;
  }
);

export const globalNoteSave = createAsyncThunk<Note, Note>(
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
    const finalNote = {
      ...note,
      title: getNoteTitle(rawText),
      tags: getNoteTags(rawText),
      content: rawText,
    };

    const saveNote = debounce(() => {
      NoteService.updateNoteById(note._id!, finalNote);
      return finalNote;
    }, 1000);

    saveNote();

    return new Promise<Note>((resolve) => {
      resolve(finalNote);
    });
  }
);

export const globalNoteDelete = createAsyncThunk<Note, Note>(
  "note/globalNoteDelete",
  async (arg, { getState, dispatch }) => {
    const note = arg;
    await NoteService.deleteNoteById(note._id!);
    dispatch(globalNoteOpen(null));
    return note;
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
      })
      .addCase(globalNoteCreate.fulfilled, (state, action) => {
        NoteAdapter.addOne(state.all, action.payload);
      })
      .addCase(
        globalAllNotesMetadataFetch.fulfilled,
        (state, action) => {
          NoteAdapter.setAll(state.all, action.payload);
        }
      )
      .addCase(globalNoteDelete.fulfilled, (state, action) => {
        NoteAdapter.removeOne(state.all, action.payload._id!);
      })
      .addCase(globalNoteSave.fulfilled, (state, action) => {
        NoteAdapter.updateOne(state.all, {
          id: action.payload._id!,
          changes: action.payload,
        });
      });
  },
});

export const {} = noteSlice.actions;

export const noteSelectors = NoteAdapter.getSelectors<RootState>(
  (state) => state.note.all
);

export default noteSlice.reducer;
