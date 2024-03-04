const express = require('express');
const morgan = require('morgan');
const app = express();

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json());
app.use(morgan('tiny'));

morgan.token('data', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const now = new Date();
  const info = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${now}`;
  response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }
  if (persons.find((person) => person.name === name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }
  const id = Math.floor(Math.random() * 100);
  newPerson = { id, name, number };
  persons = [...persons, newPerson];
  response.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
