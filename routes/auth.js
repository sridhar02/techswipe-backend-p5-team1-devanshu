const router = require("express").Router();
const passport = require("passport");
// const { promisify }  = require('node:util');

const authController = require("../controller/auth");

const { BASE_URL_FRONTEND } = process.env

router.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user"] })
);

router.get("/linkedin", passport.authenticate("linkedin"));

router.get("/login-failed", (req, res) => {
  req.flash("error", "Authentication failed");
  res.status(401).redirect(`${BASE_URL_FRONTEND}/login`);
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${BASE_URL_FRONTEND}/login?failed=true`,
  }),
  authController.successGithubLogin
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: `${BASE_URL_FRONTEND}/login?failed=true`,
  }),
  authController.successLinkedinLogin
);

router.get("/logout", async function (req, res) {
  try {
    console.log(req.session.req);
    console.log(req.session.id);

    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });

    res.redirect(`${BASE_URL_FRONTEND}/login`);
  } catch (err) {
    console.log(err)
    res.redirect(`${BASE_URL_FRONTEND}/dashboard?logout=false`);
  }
});

module.exports = router;
