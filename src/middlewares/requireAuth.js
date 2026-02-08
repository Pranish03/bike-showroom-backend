import { User } from "../routes/auth/models.js";
import jwt from "jsonwebtoken";

export const requireAuth = ({ isAdmin = false } = {}) => {
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Not logged in",
      });
    }

    const [type, jwtToken] = token.split(" ");

    if (!jwtToken) {
      return res.status(401).json({
        message: "Not logged in",
      });
    }

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        message: "Not logged in",
      });
    }

    if (isAdmin && !user.isAdmin) {
      return res.status(403).json({
        message: "You are not a admin",
      });
    }

    req.user = user;

    next();
  };
};
