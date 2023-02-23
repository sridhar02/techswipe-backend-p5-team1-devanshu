const router = require("express").Router();
const authController = require("../controller/auth");
const passport = require("passport");
const { BASE_URL, BASE_URL_FRONTEND } = require("../keys");

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

router.get("/logout", (req, res) => {
  res.status(200).redirect(`${BASE_URL_FRONTEND}/login`);
});

module.exports = router;
