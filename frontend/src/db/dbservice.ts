import PouchDB from "pouchdb";

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotesService {
  private db: PouchDB.Database;

  constructor() {
    this.db = new PouchDB("notes");
  }

  async getAll(): Promise<Note[]> {
    const { rows } = await this.db.allDocs<Note>({
      include_docs: true,
    });
    return rows.map(({ doc }) => doc) as Note[];
  }

  async getById(id: string): Promise<Note | null> {
    try {
      const doc = await this.db.get<Note>(id);
      return doc;
    } catch (error) {
      if (error === "not_found") {
        return null;
      }
      throw error;
    }
  }

  async save(note: Note): Promise<Note> {
    const doc = {
      ...note,
      updatedAt: new Date(),
    };

    if (!doc._id) {
      doc._id = new Date().toISOString();
      doc.createdAt = new Date();
    }

    await this.db.put(doc);
    return doc;
  }

  async delete(id: string): Promise<void> {
    const doc = await this.db.get(id);
    await this.db.remove(doc);
  }
}
