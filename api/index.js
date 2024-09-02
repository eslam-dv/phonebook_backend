import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// GET /api/persons
// return a list of all people in phonebook
app.get("/api/persons", (_, res) => {
  res.json(persons);
});

// GET /info
// returns info about the phonebook and the current time
app.get("/info", (_, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>`,
  );
});

// GET /api/persons/:id
// returns a single person's information
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }
  res.json(person);
});

// DELETE /api/persons/:id
// delete a person from the phonebook
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }
  persons = persons.map((p) => (p.id !== id ? p : null));
  res.status(200).json({ message: `succefully deleted '${person.name}'` });
});

// POST /api/persons
// EX: body => {name: "jhon", number: "1234"}
// add new person to phonebook
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "provide a name and number" });
  }
  if (persons.find((person) => person.name === name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const newPerson = {
    id: String(Math.floor(Math.random() * 9999)),
    name,
    number,
  };
  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server listening on port", port);
});

export default app;
