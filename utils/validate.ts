import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        ...req.body,
        ...req.params,
        ...req.query,
      });

      return next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const error_message = err.errors[0]?.message || "Validation failed";
        return res.status(400).json({
          status: "Bad Request",
          message: error_message,
        });
      }
      return res.status(500).json({
        status: "Internal Server Error",
        message: "An unknown error occurred",
      });
    }
  };

export default validate;
