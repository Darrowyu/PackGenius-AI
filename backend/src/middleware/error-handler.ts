import { Context, Next } from 'hono';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        400
      );
    }

    if (error instanceof AppError) {
      return c.json(
        { error: error.message, details: error.details },
        error.statusCode as 400 | 404 | 500
      );
    }

    return c.json({ error: 'Internal server error' }, 500);
  }
};
