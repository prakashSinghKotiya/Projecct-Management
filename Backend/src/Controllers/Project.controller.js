
import Project from "../Models/Project.Model.js";
import User from "../Models/User.Model.js";

export const createProject = async (req, res, next) => {
   try {
  
    const { name, description } = req.body;


   // const data = await promises.allSettled( )

    
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    console.log(project);

    
    const UpdatedUser = await User.findByIdAndUpdate(req.user._id, {
      $push: {rootprojectId: project._id },
    },{ new: true} );

    console.log("User:" ,UpdatedUser);


    
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
      UpdatedUser,
    });


  } catch (err) {
    next(err);
}; }

export const getMyProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;
    

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    next(err);
  }
};


export const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { members: userId },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have access",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (err) {
    next(err);
  }
};



export const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can add members",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    if (project.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    project.members.push(user._id);

    await project.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      project,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can update the project",
      });
    }

    if (name !== undefined) {
      project.name = name;
    }

    if (description !== undefined) {
      project.description = description;
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete the project",
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(204).json({message : "Project deleted successfully"});
  } catch (err) {
    next(err);
  }
};