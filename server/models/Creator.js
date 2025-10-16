import { ObjectId } from "mongodb";
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

  static async findById(id) {
    try {
      const db = getDatabase();
      const creators = db.collection("creators");

      const result = await creators.findOne({
        _id: ObjectId.createFromHexString(id),
      });
      return result;
    } catch (error) {
      console.error("Error finding creator by id:", error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const db = getDatabase();
      const creators = db.collection("creators");

      const result = await creators.updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updateData },
      );

      return result;
    } catch (error) {
      console.error("Error updating creator:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const db = getDatabase();
      const creators = db.collection("creators");

      const result = await creators.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });
      return result;
    } catch (error) {
      console.error("Error deleting creator:", error);
      throw error;
    }
  }
}
