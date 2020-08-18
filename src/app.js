const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //retorna uma lista com todos os repositorios
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  // prepara um novo repositorios
  const repositoryNew = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  //add o novo repositorios a lista
  repositories.push(repositoryNew);
  //retora o novo repositorio criado e uma mensagem de sucesso
  return response.json(repositoryNew);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  //procura o Index do repositorio que vai ser atualizado
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  // verifica se o repositório procurado existe caso não retorna um erro
  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }

  //prepara os dados que vão ser atualizados
  const repositoryUpdate = {
    id,
    title,
    url,
    techs,
    likes: 0,
  }
  //atualiza o repositorio na lista
  repositories[repositoryIndex] = repositoryUpdate;
  //retorna o repositório que foi atualizado
  return response.json(repositoryUpdate)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  //procura o repositorio que vai ser deletado
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  //verifica se o repositorio existe
  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }

  // deleta o repositorio do array
  repositories.splice(repositoryIndex, 1);
  //retorna uma mensagem de sucesso
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  //procura o repositório que vai receber o LIKE
  const repository = repositories.find(repository => repository.id == id);
  // verifica se o repositório procurado existe, caso não retorna um erro
  if (!repository) {
    return response.status(400).json({error: "Likes repository not found."})
  }
  //add mais um LIKE
  repository.likes++;
  //retorna o repositório com o like atualizado
  return response.json(repository);
});

module.exports = app;
