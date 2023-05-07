import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { sortBy } from "lodash";

import { v4 as uuidv4 } from "uuid";

PouchDB.plugin(PouchDBFind);

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type NoteChangeType = "CREATED" | "UPDATED" | "DELETED";

export interface NoteChangeObject {
  changeType: NoteChangeType;
  note: Note | null;
}

const db = new PouchDB("notes");

const NoteService = {
  getAllNotesMetadata: async (): Promise<Note[]> => {
    return db
      .allDocs<Note>({
        include_docs: true,
      })
      .then((res) => {
        const docs = res.rows.map((row) => row.doc);
        return sortBy(docs, "updatedAt").reverse() as Note[];
      });
  },

  getAllNotes: async (): Promise<Note[]> => {
    return db
      .allDocs<Note>({
        include_docs: true,
      })
      .then((res) => {
        const docs = res.rows.map((row) => row.doc);
        return sortBy(docs, "updatedAt").reverse() as Note[];
      });
  },

  createNote: async (): Promise<Note> => {
    const note = {
      title: "",
      content: "",
      tags: [],
    };

    const doc = {
      ...note,
      _id: uuidv4(),
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };

    await db.put(doc);
    return doc;
  },

  deleteNoteById: async (id: string): Promise<void> => {
    const doc = await db.get(id);
    db.remove(doc);
  },

  getNoteById: async (id: string): Promise<Note> => {
    const doc = await db.get<Note>(id);
    return doc;
  },

  updateNoteById: async (id: string, note: Note): Promise<void> => {
    const doc = await db.get(id);
    await db.put({
      ...note,
      _rev: doc._rev,
      updatedAt: new Date(),
    });
  },

  searchNotes: async (query: string): Promise<Note[]> => {
    if (!query) return await NoteService.getAllNotesMetadata();

    await db.createIndex({
      index: {
        fields: ["title", "content", "tags"],
      },
    });

    const regex = new RegExp(query, "i");

    const { docs } = await db.find({
      selector: {
        $or: [
          { title: { $regex: regex } },
          { content: { $regex: regex } },
          { tags: { $regex: regex } },
        ],
      },
    });

    return docs as unknown as Note[];
  },
};

export default NoteService;
