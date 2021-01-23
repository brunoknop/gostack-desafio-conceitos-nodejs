const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function CheckValidId(request, response, next) {
  const { id } = request.params;
  if (!validate(id))
    return response.status(400).json({ error: "ID is not valid!" });
  else if (repositories.findIndex(repo => repo.id === id) < 0)
    return response.status(400).json({ error: "This ID does not exist!" });

  return next();
}

app.use("/repositories/:id", CheckValidId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = { id: v4(), title, url, techs, likes: 0 };

  repositories.push(repositorie);
  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositorieIndex = repositories.findIndex(repo => repo.id === id);
  const { likes } = repositories[repositorieIndex];
  const repo = {
    id,
    title,
    url,
    techs,
    likes
  }
  repositories[repositorieIndex] = repo;
  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repo => repo.id === id);
  repositories.splice(repositorieIndex, 1);
  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repo => repo.id === id);
  repositories[repositorieIndex].likes++;
  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
