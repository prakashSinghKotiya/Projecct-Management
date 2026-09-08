import Project from "../Models/Project.Model.js";
import Task from "../Models/Task.Model.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have access",
      });
    }

    // If task is assigned to someone,
    // make sure that person belongs to the project
    if (assignedTo && !project.members.some(
      (member) => member.toString() === assignedTo
    )) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is not a project member",
      });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      createdBy: req.user._id,
      assignedTo: assignedTo || null,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    next(err);
  }
};




export const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have access",
      });
    }

    const tasks = await Task.find({ projectId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    next(err);
  }
};




export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo, progress } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this task",
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (progress !== undefined) task.progress = progress;

    if (assignedTo !== undefined) {
      if (
        assignedTo !== null &&
        !project.members.some(
          (member) => member.toString() === assignedTo
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Assigned user is not a project member",
        });
      }

      task.assignedTo = assignedTo;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    next(err);
  }
};



export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can delete tasks",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};