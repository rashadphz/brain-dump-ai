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
    db.get(id).then((doc) => {
      db.remove(doc);
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
