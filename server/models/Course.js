import { ObjectId } from "mongodb";
import { getDatabase } from "../db/database.js";

export class Course {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.creatorName = data.creatorName;
    this.contentType = data.contentType || "video";
    this.isFree = data.isFree || false;
    this.content = data.content;
    this.createdAt = data.createdAt || new Date();
  }

  static async create(courseData) {
    try {
      const db = getDatabase();
      const courses = db.collection("courses");

      const course = new Course(courseData);
      const result = await courses.insertOne(course);

      return { ...course, _id: result.insertedId };
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const db = getDatabase();
      const courses = db.collection("courses");

      const result = await courses.find({}).toArray();
      return result;
    } catch (error) {
      console.error("Error finding all courses:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const db = getDatabase();
      const courses = db.collection("courses");

      const result = await courses.findOne({
        _id: ObjectId.createFromHexString(id),
      });
      return result;
    } catch (error) {
      console.error("Error finding course by ID:", error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const db = getDatabase();
      const courses = db.collection("courses");

      const result = await courses.updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updateData },
      );

      return result;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const db = getDatabase();
      const courses = db.collection("courses");

      const result = await courses.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });
      return result;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }
}
