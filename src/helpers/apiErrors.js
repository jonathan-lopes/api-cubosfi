class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends ApiError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message, 404);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message) {
    super(message, 403);
  }
}

class CrudError extends ApiError {
  constructor(message) {
    super(message, 500);
  }
}

class ConflictError extends ApiError {
  constructor(message) {
    super(message, 409);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  CrudError,
  ConflictError,
};
