import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { sortBy } from "lodash";

PouchDB.plugin(PouchDBFind);

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type NoteChangeType = "CREATED" | "UPDATED" | "DELETED";

export interface NoteChangeObject {
  changeType: NoteChangeType;
  note: Note | null;
}

const db = new PouchDB("notes");

const NoteService = {
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
      ...note,
      _rev: doc._rev,
      updatedAt: new Date(),
    });
  },

  searchNotes: async (query: string): Promise<Note[]> => {
    if (!query) return await NoteService.getAllNotes();

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

  subscribe: (
    onChange: (noteChangeObj: NoteChangeObject) => void
  ) => {
    const changes = db.changes<Note>({
      since: "now",
      live: true,
      include_docs: true,
    });
    changes.on("change", async (change) => {
      if (!change.doc) return;

      if (change.doc._deleted) {
        onChange({
          changeType: "DELETED",
          note: null,
        });
      } else {
        if (change.doc._rev.startsWith("1-")) {
          onChange({
            changeType: "CREATED",
            note: change.doc,
          });
        } else {
          onChange({
            changeType: "UPDATED",
            note: change.doc,
          });
        }
      }
    });

    return changes;
  },
};

export default NoteService;
