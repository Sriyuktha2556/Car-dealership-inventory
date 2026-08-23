import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/AppError";

type Source = "body" | "query";

export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const input = source === "body" ? req.body : req.query;
    const result = schema.safeParse(input);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "value";
        if (!errors[key]) errors[key] = issue.message;
      }
      return next(new AppError(400, "Validation failed", errors));
    }

    // Express exposes req.query through a getter in some versions, so do not
    // replace the property itself. Update its existing object in place.
    if (source === "query") {
      const target = req.query as Record<string, unknown>;
      for (const key of Object.keys(target)) delete target[key];
      Object.assign(target, result.data);
    } else {
      req.body = result.data;
    }

    next();
  };
}
