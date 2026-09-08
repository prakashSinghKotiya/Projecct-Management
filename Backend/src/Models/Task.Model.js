import { model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    progress: {
      type: String,
      enum: [
        "new",
        "started-working",
        "half-completed",
        "testing",
        "completed",
      ],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;