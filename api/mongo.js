import mongoose from "mongoose";

const url = "mongodb://localhost:27017/phonebook";

mongoose.connect(url).then(() => console.log("Connected to DB"));

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const PersonModel = mongoose.model("person", personSchema);

if (process.argv.length < 3) {
	PersonModel.find({}).then((result) => {
    console.log("phonebook:");
		result.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
} else {
	const name = process.argv[2];
	const number = process.argv[3];

	const person = new PersonModel({
		name: name,
		number: number,
	});

	person.save().then((_) => {
		console.log(`added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
}
