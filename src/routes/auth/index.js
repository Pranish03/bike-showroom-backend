import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "./models.js";
import { LoginValidationSchema, SignupValidationSchema } from "./validation.js";
import { requireValidation } from "../../middlewares/requireValidation.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const authRouter = Router();

/**
 * @Desc   Regester user
 * @Access All
 * @API    POST /auth/signup
 */

authRouter.post(
  "/signup",
  requireValidation(SignupValidationSchema),
  async (req, res) => {
    try {
      const data = req.parsed;

      const existingUser = await User.findOne({
        email: data.email,
      });

      if (existingUser)
        return res.status(400).json({
          message: "User already exits",
        });

      const user = await User.create(data);

      return res.status(201).json({
        message: "Welcome",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
);

/**
 * @Desc   Login user
 * @Access All
 * @API    POST /auth/login
 */

authRouter.post(
  "/login",
  requireValidation(LoginValidationSchema),
  async (req, res) => {
    try {
      const data = req.parsed;

      const existingUser = await User.findOne({
        email: data.email,
        password: data.password,
      }).select("-password");

      if (!existingUser)
        return res.status(400).json({
          message: "User does not already exits",
        });

      const token = jwt.sign(
        {
          userId: existingUser._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        },
      );

      return res.status(201).json({
        message: "Welcome to login",
        data: {
          user: existingUser,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
);

/**
 * @Desc   Get profile
 * @Access All
 * @API    GET /auth/me
 */

authRouter.get("/me", requireAuth(), async (req, res) => {
  try {
    return res.status(200).json({
      message: "Your profile",
      data: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

export default authRouter;
