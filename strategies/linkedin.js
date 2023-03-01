require("dotenv").config();
const passport = require("passport");
const LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, BASE_URL } = process.env;

passport.use(
  new LinkedinStrategy(
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
