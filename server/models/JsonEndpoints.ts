import { model, Schema } from "mongoose";

// Define the interface
export interface JsonEndpoint {
  _id?: string;
  title: string;
  json: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const jsonEndpointSchema = new Schema<JsonEndpoint>({
  title: { 
    type: String,
    required: [true, "Title is required"],
    unique: true,
    trim: true
  },
  json: {
    type: String,
    required: [true, "JSON content is required"],
    validate: {
      validator: function(v: string) {
        try {
          JSON.parse(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: "JSON must be valid"
    }
  }
}, {
  timestamps: true,
  strict: true
});

// Instance methods
jsonEndpointSchema.methods = {
  updateJson: async function(json: string) {
    if (!json) throw new Error("JSON content is required");
    try {
      JSON.parse(json);
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
    this.json = json;
    return await this.save();
  }
};

// Export the model
export const JsonEndpointModel = model<JsonEndpoint>("JsonEndpoint", jsonEndpointSchema);

export async function validateJson(json: string): Promise<boolean> {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

export class JsonEndpointController {
  static async findAll(): Promise<JsonEndpoint[]> {
    return await JsonEndpointModel.find({}).exec();
  }

  static async findByTitle(title: string): Promise<JsonEndpoint | null> {
    return await JsonEndpointModel.findOne({ title }).exec();
  }

  static async create(data: Omit<JsonEndpoint, '_id' | 'createdAt' | 'updatedAt'>): Promise<JsonEndpoint> {
    const doc = new JsonEndpointModel(data);
    return await doc.save();
  }

  static async update(id: string, data: Partial<JsonEndpoint>): Promise<JsonEndpoint | null> {
    return await JsonEndpointModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  static async delete(id: string): Promise<boolean> {
    const result = await JsonEndpointModel.findByIdAndRemove(id).exec();
    return result !== null;
  }
}
