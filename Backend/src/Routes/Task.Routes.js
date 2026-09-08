import express from "express";

import checkAuth from "../Middlewares/auth.Middleware.js";
import { createTask, deleteTask, getProjectTasks, updateTask } from "../Controllers/Task.Controller.js";

const router = express.Router();

router.use(checkAuth);

router.post("/projects/:projectId/createtasks", createTask);

router.get("/projects/:projectId/tasks", getProjectTasks);

router.patch("/updatetasks/:taskId", updateTask);

router.delete("/deletetasks/:taskId", deleteTask);

export default router;