// server/prisma/content/errors.ts

import { ValidationIssue } from './validator';

export interface SerializedContentError {
  name: string;
  message: string;
  code: string;
  details?: unknown;
  stack?: string;
}

export abstract class ContentEngineError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly details?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }

  serialize(): SerializedContentError {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}

export class ContentConfigurationError extends ContentEngineError {
  readonly code = 'CONTENT_CONFIGURATION_ERROR';
}

export class ContentValidationError extends ContentEngineError {
  readonly code = 'CONTENT_VALIDATION_ERROR';

  constructor(
    message: string,
    public readonly issues: ValidationIssue[],
    options?: ErrorOptions,
  ) {
    super(message, { issues }, options);
  }
}

export class ContentImportError extends ContentEngineError {
  readonly code = 'CONTENT_IMPORT_ERROR';
}

export class ContentExportError extends ContentEngineError {
  readonly code = 'CONTENT_EXPORT_ERROR';
}

export class ContentRepositoryError extends ContentEngineError {
  readonly code = 'CONTENT_REPOSITORY_ERROR';
}

export class ContentNotFoundError extends ContentEngineError {
  readonly code = 'CONTENT_NOT_FOUND';

  constructor(resource: string, identifier: string, options?: ErrorOptions) {
    super(
      `${resource} not found: ${identifier}`,
      {
        resource,
        identifier,
      },
      options,
    );
  }
}

export class ContentConflictError extends ContentEngineError {
  readonly code = 'CONTENT_CONFLICT';
}

export class ContentDatabaseError extends ContentEngineError {
  readonly code = 'CONTENT_DATABASE_ERROR';
}

export function isContentEngineError(
  error: unknown,
): error is ContentEngineError {
  return error instanceof ContentEngineError;
}

export function isErrorWithMessage(error: unknown): error is {
  message: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

export function serializeError(error: unknown): SerializedContentError {
  if (error instanceof ContentEngineError) {
    return error.serialize();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code: 'UNEXPECTED_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  return {
    name: 'UnknownError',
    message: getErrorMessage(error),
    code: 'UNKNOWN_ERROR',
    details: error,
  };
}

export function wrapContentError(
  error: unknown,
  message: string,
  details?: unknown,
): ContentEngineError {
  if (error instanceof ContentEngineError) {
    return error;
  }

  return new ContentEngineErrorImpl(
    message,
    details,
    error instanceof Error
      ? {
          cause: error,
        }
      : undefined,
  );
}

class ContentEngineErrorImpl extends ContentEngineError {
  readonly code = 'CONTENT_ENGINE_ERROR';
}
