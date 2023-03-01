const User = require("../models/user");
require("dotenv").config();
const { BASE_URL_FRONTEND } = require("../keys");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

exports.successGithubLogin = (req, res, next) => {
  if (req.user) {
    console.log("Controller - ", req.user._json);
    User.find({ githubId: req.user._json.id }).then((id_user) => {
      // Check wether user with same email is present
      console.log("User - ", id_user);
      if (id_user.length < 1) {
        console.log("No User with github id ", req.user._json.id);
        //already a user present with linkedIn auth
        if (req.user._json.email !== null) {
          User.find({ email: req.user._json.email }).then((e_user) => {
            if (e_user.length === 1) {
              e_user[0].socialMedia.Github = req.user._json.profileUrl;
              e_user[0]["githubId"] = req.user._json.id;
              e_user[0].save().then((loadedUser) => {
                const token = jwt.sign(
                  {
                    userId: loadedUser._id.toString(),
                  },
                  JWT_KEY,
                  { expiresIn: "1w" }
                );
                res.redirect(`${BASE_URL_FRONTEND}/dashboard?token=${token}`);
              });
            } else {
              const data = {};
              if (req.user._json.name !== "") {
                data["name"] = req.user._json.name;
              }
              if (req.user._json.company !== null) {
                data["company"] = req.user._json.company;
              }
              if (req.user._json.avatar_url !== null) {
                data["profilePhoto"] = req.user._json.avatar_url;
              }
              if (req.user._json.email !== null) {
                data["email"] = req.user._json.email;
              }
              data["socialMedia"] = { Github: req.user.profileUrl };
              data["githubId"] = req.user._json.id;
              console.log("data - ", data);
              const user = new User(data);
              console.log("User- ", user);
              user.save().then((loadedUser) => {
                const token = jwt.sign(
                  {
                    userId: loadedUser._id.toString(),
                  },
                  JWT_KEY,
                  { expiresIn: "1w" }
                );
                res.redirect(`${BASE_URL_FRONTEND}/profile?token=${token}`);
              });
            }
          });
        } else {
          // Consider the user be a new user
          const data = {};
          if (req.user._json.name !== "") {
            data["name"] = req.user._json.name;
          }
          if (req.user._json.company !== null) {
            data["company"] = req.user._json.company;
          }
          if (req.user._json.avatar_url !== null) {
            data["profilePhoto"] = req.user._json.avatar_url;
          }
          data["socialMedia"] = { Github: req.user.profileUrl };
          data["githubId"] = req.user._json.id;
          console.log("data - ", data);
          const user = new User(data);
          console.log("User- ", user);
          user.save().then((loadedUser) => {
            const token = jwt.sign(
              {
                userId: loadedUser._id.toString(),
              },
              JWT_KEY,
              { expiresIn: "1h" }
            );
            res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
          });
        }
      } else {
        //Already registered with github user
        console.log("Already with github id", id_user[0]._id);
        const token = jwt.sign(
          {
            userId: id_user[0]._id.toString(),
          },
          JWT_KEY,
          { expiresIn: "1w" }
        );
        res.redirect(`${BASE_URL_FRONTEND}/dashboard?token=${token}`);
      }
    });
  } else {
    res.redirect(`${BASE_URL_FRONTEND}/login?success=false`);
  }
};

exports.successLinkedinLogin = (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    const email = req.user.emails[0].value;
    const name = req.user.displayName;
    const id = req.user.id;
    const profilePhoto = req.user.photos.at(-1).value;
    console.log(
      `UserName = ${name}, email = ${email}, id = ${id}, photo=${profilePhoto} `
    );
    User.find({ linkedIn: id }).then((id_user) => {
      console.log("User - ", id_user);

      if (id_user.length < 1) {
        console.log("No User with linkedin id ", id);
        //Check wether user with same email is present
        if (email !== null && email !== undefined && email !== "") {
          console.log("Same email2");
          User.find({ email: email })
            .then((e_user) => {
              console.log("Same email1");
              if (e_user.length === 1) {
                console.log("Same email");
                e_user[0]["linkedIn"] = id;
                e_user[0].save().then((loadedUser) => {
                  const token = jwt.sign(
                    {
                      userId: loadedUser._id.toString(),
                    },
                    JWT_KEY,
                    { expiresIn: "1w" }
                  );
                  res.redirect(`${BASE_URL_FRONTEND}/dashboard?token=${token}`);
                });
              } else {
                const data = {};
                if (name !== "") {
                  data["name"] = name;
                }
                if (profilePhoto !== 0) {
                  data["profilePhoto"] = profilePhoto;
                }
                if (email !== null) {
                  data["email"] = email;
                }
                data["linkedIn"] = id;
                console.log("data - ", data);
                const user = new User(data);
                console.log("User- ", user);
                user.save().then((loadedUser) => {
                  const token = jwt.sign(
                    {
                      userId: loadedUser._id.toString(),
                    },
                    JWT_KEY,
                    { expiresIn: "1w" }
                  );
                  res.redirect(`${BASE_URL_FRONTEND}/profile?token=${token}`);
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          // Consider the user be a new user
          console.log("No email");
          const data = {};
          if (name !== "") {
            data["name"] = name;
          }
          if (profilePhoto !== 0) {
            data["profilePhoto"] = profilePhoto;
          }
          data["linkedIn"] = id;
          console.log("data - ", data);
          const user = new User(data);
          console.log("User- ", user);
          user.save().then((loadedUser) => {
            const token = jwt.sign(
              {
                userId: loadedUser._id.toString(),
              },
              JWT_KEY,
              { expiresIn: "1w" }
            );
            res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
          });
        }
      } else {
        //Already registered with github user
        console.log("Already with linedIn id", id);
        const token = jwt.sign(
          {
            userId: id_user[0]._id.toString(),
          },
          JWT_KEY,
          { expiresIn: "1w" }
        );
        res.redirect(`${BASE_URL_FRONTEND}/profile?token=${token}`);
      }
    });
  } else {
    res.redirect(`${BASE_URL_FRONTEND}/login?success=false`);
  }
};
