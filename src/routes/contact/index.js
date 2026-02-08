import { Router } from "express";
import { transporter } from "../../lib/transporter.js";
import { requireValidation } from "../../middlewares/requireValidation.js";
import { contactValidationSchema } from "./validation.js";

const contactRouter = Router();

/**
 * @Desc   Send email
 * @Access All
 * @API    POST /contact
 */

contactRouter.post(
  "/",
  requireValidation(contactValidationSchema),
  async (req, res) => {
    try {
      const data = req.parsed;

      await transporter.sendMail({
        to: process.env.RECEIVER_GMAIL_USER,
        from: process.env.GMAIL_USER,
        subject: data.subject,
        text: `Name: ${data.name}\nEmail: ${data.email}\n${data.message}`,
      });

      return res.status(200).json({
        message: "Thank you for contacting",
      });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
);

export default contactRouter;
