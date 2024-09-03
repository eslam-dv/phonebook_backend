import { Schema, model } from "mongoose";

const personSchema = new Schema({
  name: {
    type: String,
    minLength: [3, "name should be at least 3 characters"],
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: [8, "number should be at least 8 characters"],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{6,}$/.test(v);
      },
      message: "{VALUE} is not a valid phone number",
    },
  },
});

const personModel = model("person", personSchema);
export default personModel;
