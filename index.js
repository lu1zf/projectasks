const express = require("express");

const projects = [];

server = express();
server.use(express.json());

// global middleware
server.use((req, res, next) => {
  console.count("number of requisitions");

  return next();
});

// local middlewares
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((item) => id == item.id);

  if (!project) {
    return res.status(400).json({ error: "project does not exists" });
  }

  return next();
}

function checkUniqueId(req, res, next) {
  const { id } = req.body;

  const idAlreadyExists = projects.find((item) => id == item.id);
  if (idAlreadyExists) {
    return res.status(400).json({ error: "project id already exists" });
  }

  return next();
}

// routes
server.post("/projects", checkUniqueId, (req, res) => {
  const { id, title, tasks } = req.body;
  const newProject = { id, title, tasks };
  projects.push(newProject);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const newTaskTitle = title;

  for (project of projects) {
    if (id == project.id) {
      project.tasks.push(newTaskTitle);
    }
  }

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (project of projects) {
    if (id == project.id) {
      project.title = title;
    }
  }

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  for (project of projects) {
    if (id == project.id) {
      const position = projects.indexOf(project);
      projects.splice(position, 1);
    }
  }

  return res.json(projects);
});

server.listen(3000);
