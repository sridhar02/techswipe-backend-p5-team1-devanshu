const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const { BASE_URL,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET } = process.env;


passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/github/callback`,
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
