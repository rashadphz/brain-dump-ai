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

    console.log("created note");
    console.log("doc", doc);

    await db.put(doc);
    return doc;
  },

};

export default NoteService;
