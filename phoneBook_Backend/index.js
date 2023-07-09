const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :requestedPerson"
  )
);

morgan.token("requestedPerson", (req, res) => {
  return JSON.stringify(req.RequestedPerson);
});

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
  console.log(req.headers);
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${req.requestTime}   </p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  let person = persons.find((person) => person.id === id);

  if (person) {
    req.RequestedPerson = { name: person.name, number: person.number };
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "Name already exists in the list",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
