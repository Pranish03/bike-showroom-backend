import { fromError } from "zod-validation-error";

export const requireValidation = (schema) => {
  return (req, res, next) => {
    const { data, success, error } = schema.safeParse(req.body);

    if (!success) {
      const message = fromError(error).toString();
      return res.status(422).json({
        message: "Validation Error",
        error: message,
      });
    }

    req.parsed = data;

    next();
  };
};
