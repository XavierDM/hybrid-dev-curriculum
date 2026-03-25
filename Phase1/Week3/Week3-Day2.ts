class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, `NOT_FOUND`);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

try {
  throw new NotFoundError('User');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log(error.statusCode);
    console.log(error.message);
    console.log(error.code);
  }
}
