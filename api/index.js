import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import phoneModel from "./models/phone.js";

const app = express();
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// override handling for some errors
const errorHandler = (err, _, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// handler of requests with unknown endpoint
const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// GET /api/persons
// return a list of all people in phonebook
app.get("/api/persons", (_, res) => {
  phoneModel.find({}).then((persons) => res.status(200).json(persons));
});

// GET /info
// returns info about the phonebook and the current time
app.get("/api/persons/info", (_, res) => {
  phoneModel.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>`,
    );
  });
});

// GET /api/persons/:id
// returns a single person's information
app.get("/api/persons/:id", (req, res) => {
  phoneModel
    .findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).json({ error: "Person not found" });
      res.status(200).json(person);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE /api/persons/:id
// delete a person from the phonebook
app.delete("/api/persons/:id", (req, res) => {
  phoneModel
    .findByIdAndDelete(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).json({ error: "Person not found" });
      res.status(204).json();
    })
    .catch((err) => next(err));
});

// POST /api/persons
// EX: body => {name: "jhon", number: "1234"}
// add new person to phonebook
app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "provide a name and number" });
  }
  phoneModel
    .create({ name, number })
    .then((newPerson) => res.status(201).json(newPerson))
    .catch((err) => next(err));
});

// PUT /api/persons/:id
// updaet existing person
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  phoneModel
    .findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true },
    )
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.status(200).json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server listening on port", port);
});
mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => console.log("Connected to DB"));

export default app;
