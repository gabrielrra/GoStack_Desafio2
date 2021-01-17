const express = require('express');
const { v4, validate } = require('uuid');
const cors = require('cors');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
// {
//   id: 'uuid',
//   title: 'Desafio Node.js',
//   url: 'http://github.com/...',
//   techs: ['Node.js', '...'],
//   likes: 0,
// };

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response
      .status(400)
      .json({ error: 'Repository must have title, url and techs' });
  }

  const repository = { id: v4(), title, techs, url, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, techs, url, likes } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).send('No repository found for given id');
  }

  const oldRepository = repositories[repositoryIndex];
  if (likes) {
    return response.json({ likes: oldRepository.likes });
  }

  const newRepository = {
    id: id,
    title: title || oldRepository.title,
    techs: techs || oldRepository.techs,
    url: url || oldRepository.url,
  };
  repositories[repositoryIndex] = newRepository;

  return response.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).send('No repository found for given id');
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send('Repository deleted');
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return response.status(400).send('No repository found for given id');
  }

  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
