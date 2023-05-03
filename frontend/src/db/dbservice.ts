import PouchDB from "pouchdb";

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const db = new PouchDB("notes");

const NoteService = {
  getAllNotes: async (): Promise<Note[]> => {
    const { rows } = await db.allDocs<Note>({
      include_docs: true,
    });
    return rows.map(({ doc }) => doc) as Note[];
  },

  createNote: async (): Promise<Note> => {
    const note = {
      title: "",
      content: "",
      tags: [],
    };

    const doc = {
      ...note,
      _id: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.put(doc);
    return doc;
  },

  deleteNoteById: async (id: string): Promise<void> => {
    const doc = await db.get(id);
    db.remove(doc);
  },

  updateNoteById: async (id: string, note: Note): Promise<void> => {
    const doc = await db.get(id);
    await db.put({
      _rev: doc._rev,
      ...note,
      updatedAt: new Date(),
    });
  },

  subscribe: (onChange: (notes: Note[]) => void) => {
    const changes = db.changes({
      since: "now",
      live: true,
      include_docs: true,
    });
    changes.on("change", async (change) => {
      const notes = await NoteService.getAllNotes();
      onChange(notes);
    });

    return changes;
  },
};

export default NoteService;
