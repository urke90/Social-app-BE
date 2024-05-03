import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

// ----------------------------------------------------------------

/**
 * @type {function} ZOD validator for user routes.
 */
export const validateUserReqBody =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const bodyValidation = schema.safeParse(req.body);

    if (!bodyValidation.success && bodyValidation.error instanceof z.ZodError) {
      const validationError = bodyValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }
    next();
  };

export const validateUserReqParams =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const paramsValidation = schema.safeParse(req.params);

    if (
      !paramsValidation.success &&
      paramsValidation.error instanceof z.ZodError
    ) {
      const validationError = paramsValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };

export const validateUserReqQuery =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const queryValidation = schema.safeParse(req.query);

    if (
      !queryValidation.success &&
      queryValidation.error instanceof z.ZodError
    ) {
      const validationError = queryValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };
