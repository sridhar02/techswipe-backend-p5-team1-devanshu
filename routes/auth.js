const router = require("express").Router();
const passport = require("passport");
const { promisify }  = require('node:util');

const authController = require("../controller/auth");

const { BASE_URL, BASE_URL_FRONTEND } = process.env

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

    await promisify(req.session.destroy)()

    res.json({ loggedOut: true });  
  } catch (err) {
    console.log(err)
    res.status(500).end();
  }
});

module.exports = router;
