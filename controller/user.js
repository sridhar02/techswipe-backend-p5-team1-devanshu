const userSchema = require("../models/user");
const { validationResult } = require("express-validator");

exports.addUserInfo = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    console.log(errors);
    throw error;
  }

  const {
    name,
    email,
    phoneNumber,
    birthday,
    gender,
    discoverySettings,
    coordinates,
  } = req.body;

  // let [date, month, year] = birthdate.split("-");
  // // changing to the format from DD-MM-YYYY to YYYY-MM-DD
  let new_birthday = new Date(birthday);
  const age = calculateAge(new_birthday);
  const location = {
    type: "Point",
    coordinates: coordinates,
  };
  const newUser = new userSchema({
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    birthday: new_birthday,
    gender: gender,
    discovery: discoverySettings,
    location: location,
  });

  // console.log(newUser);
  newUser.save().then((result) => {
    res.status(201).json({ message: "User created!" }); //Change to redirect to the page
  });
};

function calculateAge(birthday) {
  const birthYear = birthday.getFullYear();
  const birthMonth = birthday.getMonth();
  const birthDate = birthday.getDate();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  let age = currentYear - birthYear;

  if (currentMonth < birthMonth) {
    age--;
  } else if (currentMonth === birthMonth && currentDate < birthDate) {
    age--;
  }

  return age;
}
