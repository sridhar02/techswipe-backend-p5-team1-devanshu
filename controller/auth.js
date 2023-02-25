const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { JWT_KEY, BASE_URL_FRONTEND } = process.env;

exports.successGithubLogin = async (req, res) => {
  if (req.session) {
    const { created } = await User.findOrCreate(req.user);

    if (created) {
      res.redirect(`${BASE_URL_FRONTEND}/profile`);
    } else {
      res.redirect(`${BASE_URL_FRONTEND}/dashboard`);
    }
    return;
  } else {
    res.redirect(`${BASE_URL_FRONTEND}/login`);
    return;
  }
};

exports.successLinkedinLogin = (req, res) => {
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
                    { expiresIn: "1h" }
                  );
                  res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
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
                    { expiresIn: "1h" }
                  );
                  res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
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
              { expiresIn: "1h" }
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
          { expiresIn: "1h" }
        );
        res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
      }
    });
  } else {
    res.redirect(`${BASE_URL_FRONTEND}/login?success=false`);
  }
};
