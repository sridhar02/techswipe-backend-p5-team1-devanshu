require("dotenv").config();
const passport = require("passport");
const GitHubStrategy = require("passport-linkedin-oauth2").Strategy;
const { BASE_URL } = require("../keys");
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
passport.use(
  new GitHubStrategy(
    {
      clientID: LINKEDIN_CLIENT_ID,
      clientSecret: LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
