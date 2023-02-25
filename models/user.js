const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  photos: {
    type: Array,
  },
  phoneNumber: {
    type: Number,
  },
  githubId: {
    type: Number,
  },
  linkedIn: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  company: {
    type: String,
  },
  role: {
    type: String,
  },
  experience: {
    type: Number,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: Array,
    },
  },
  discoverySettings: {
    role: {
      type: String,
      default: "All",
      required: true,
    },
    gender: {
      type: String,
      default: "All",
      required: true,
    },
    ageRange: {
      type: Array,
      default: [20, 40],
      required: true,
    },
    radius: {
      type: Number,
      default: 50000,
      required: true,
    },
  },
  privacy: {
    show: {
      type: Boolean,
      default: false,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  techStack: {
    type: Array,
  },
  socialMedia: {
    linkedIn: String,
    github: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

module.exports.findOrCreate = async (userData) => {
  const email = userData.emails[0].value;

  const [user] = await User.find({ email });
  console.log({user});
  if (user) {
    return { created: false, user };
  }


  const {
    name,
    company,
    html_url,
    avatar_url,
    id: githubId,
  } = userData._json;

  let newUser = new User({
    name,
    company,
    githubId,
    email,
    photos: [ avatar_url ],
    socialMedia: {
      github: html_url,
    },
  });
  newUser = await newUser.save();

  return { created: true, user: newUser };
};
