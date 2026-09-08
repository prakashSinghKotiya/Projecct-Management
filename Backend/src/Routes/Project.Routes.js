import express from "express";

import { createProject,getMyProjects, getProject, updateProject, deleteProject, addMember, } from "../Controllers/Project.controller.js";

import authMiddleware from "../Middlewares/auth.Middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createProject);

router.get("/", getMyProjects);

router.get("/getproject/:id", getProject);

router.patch("/update/:id", updateProject);

router.delete("/delete/:id", deleteProject);

router.post("/add/:id/members", addMember);


export default router;