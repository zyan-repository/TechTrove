import { getDatabase } from "../db/database.js";

export class Creator {
  constructor(data) {
    this.name = data.name;
    this.title = data.title;
    this.bio = data.bio;
    this.createdAt = data.createdAt || new Date();
  }

  static async create(creatorData) {
    try {
      const db = getDatabase();
      const creators = db.collection("creators");

      const creator = new Creator(creatorData);
      const result = await creators.insertOne(creator);

      return { ...creator, _id: result.insertedId };
    } catch (error) {
      console.error("Error creating creator:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const db = getDatabase();
      const creators = db.collection("creators");

      const result = await creators.find({}).toArray();
      return result;
    } catch (error) {
      console.error("Error finding all creators:", error);
      throw error;
    }
  }
}
