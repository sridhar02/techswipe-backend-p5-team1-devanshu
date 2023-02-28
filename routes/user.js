const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const authController = require("../controller/auth");
const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");

router.put(
  "/addUserInfo",
  isAuth,
  [
    check("name").trim().notEmpty().withMessage("Name is required"),
    check("email").isEmail(),
    check("birthday")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Invalid date format"),
    check("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender value"),
    check("discoverySettings.role")
      .isIn([
        "All",
        "Full-Stack Developer",
        "Backend Developer",
        "Frontend Developer",
        "Devops Engineer",
        "Software Tester",
      ])
      .withMessage("Discovery role is required"),
    check("discoverySettings.gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid discovery gender value"),
    check("discoverySettings.ageRange")
      .isArray({ min: 2, max: 2 })
      .withMessage("Age range must be an array with two elements"),
    check("discoverySettings.ageRange.*")
      .isInt({ min: 18 })
      .withMessage("Age range values must be integers greater than 18"),
    check("discoverySettings.radius")
      .isInt({ min: 1000 })
      .withMessage("Radius must be an integer greater than 1 km"),
  ],
  userController.addUserInfo
);

router.get("/profileStatus", isAuth, userController.profileStatus);
// router.get("/matchedProfiles", isAuth, userController.getMatchedProfiles);

module.exports = router;
