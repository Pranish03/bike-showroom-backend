import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "./models.js";
import { LoginValidationSchema, SignupValidationSchema } from "./validation.js";
import { requireValidation } from "../../middlewares/requireValidation.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const authRouter = Router();

/**
 * @Desc   Register user
 * @Access Guest only
 * @API    POST /auth/signup
 */

authRouter.post(
  "/signup",
  requireValidation(SignupValidationSchema),
  async (req, res) => {
    try {
      const { name, email, password } = req.parsed;

      const existingUser = await User.findOne({ email });

      if (existingUser)
        return res.status(400).json({
          message: "Email is already taken",
        });

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const { password: _, ...safeUser } = user;

      return res.status(201).json({
        message: "Please login to continue",
        data: safeUser,
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
      const { email, password } = req.parsed;

      const existingUser = await User.findOne({ email });

      if (!existingUser)
        return res.status(400).json({
          message: "Invalid email or password",
        });

      const matchPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!matchPassword)
        return res.status(400).json({
          message: "Invalid email or password",
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

      const { password: _, safeUser } = existingUser;

      return res.status(201).json({
        message: "Welcome to bike showroom",
        data: {
          user: safeUser,
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
    const { password, ...safeUser } = req.user;

    return res.status(200).json({
      message: "Your profile",
      data: safeUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

export default authRouter;
