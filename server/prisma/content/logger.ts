// server/prisma/content/logger.ts

import { serializeError } from './errors';

export type ContentLogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface ContentLogEntry {
  timestamp: string;
  level: Exclude<ContentLogLevel, 'silent'>;
  scope: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ContentLoggerOptions {
  level?: ContentLogLevel;
  scope?: string;
  json?: boolean;
  enabled?: boolean;
}

const LOG_LEVEL_PRIORITY: Record<ContentLogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: Number.POSITIVE_INFINITY,
};

export class ContentLogger {
  private readonly level: ContentLogLevel;
  private readonly scope: string;
  private readonly json: boolean;
  private readonly enabled: boolean;

  constructor(options: ContentLoggerOptions = {}) {
    this.level =
      options.level ??
      (process.env.CONTENT_LOG_LEVEL as ContentLogLevel) ??
      'info';

    this.scope = options.scope ?? 'ContentEngine';

    this.json = options.json ?? process.env.CONTENT_LOG_FORMAT === 'json';

    this.enabled = options.enabled ?? true;
  }

  child(scope: string): ContentLogger {
    return new ContentLogger({
      level: this.level,
      scope: `${this.scope}:${scope}`,
      json: this.json,
      enabled: this.enabled,
    });
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.write('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.write('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.write('warn', message, metadata);
  }

  error(
    message: string,
    error?: unknown,
    metadata?: Record<string, unknown>,
  ): void {
    const errorMetadata = error
      ? {
          error: serializeError(error),
        }
      : {};

    this.write('error', message, {
      ...metadata,
      ...errorMetadata,
    });
  }

  section(title: string): void {
    if (!this.shouldWrite('info')) {
      return;
    }

    if (this.json) {
      this.info(title);
      return;
    }

    const separator = '-'.repeat(Math.max(32, title.length));

    console.log('');
    console.log(separator);
    console.log(title);
    console.log(separator);
  }

  table(data: unknown): void {
    if (!this.shouldWrite('info')) {
      return;
    }

    if (this.json) {
      this.info('Table data', {
        data,
      });

      return;
    }

    console.table(data);
  }

  success(message: string, metadata?: Record<string, unknown>): void {
    this.info(`✓ ${message}`, metadata);
  }

  private write(
    level: Exclude<ContentLogLevel, 'silent'>,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    if (!this.shouldWrite(level)) {
      return;
    }

    const entry: ContentLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      scope: this.scope,
      message,
      ...(metadata && Object.keys(metadata).length > 0
        ? {
            metadata,
          }
        : {}),
    };

    if (this.json) {
      this.writeJson(entry);
      return;
    }

    this.writePretty(entry);
  }

  private shouldWrite(level: Exclude<ContentLogLevel, 'silent'>): boolean {
    if (!this.enabled) {
      return false;
    }

    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.level];
  }

  private writeJson(entry: ContentLogEntry): void {
    const serialized = JSON.stringify(entry);

    switch (entry.level) {
      case 'error':
        console.error(serialized);
        return;

      case 'warn':
        console.warn(serialized);
        return;

      case 'debug':
        console.debug(serialized);
        return;

      default:
        console.log(serialized);
    }
  }

  private writePretty(entry: ContentLogEntry): void {
    const prefix = [
      entry.timestamp,
      entry.level.toUpperCase(),
      entry.scope,
    ].join(' ');

    const output = `[${prefix}] ${entry.message}`;

    switch (entry.level) {
      case 'error':
        console.error(output);
        break;

      case 'warn':
        console.warn(output);
        break;

      case 'debug':
        console.debug(output);
        break;

      default:
        console.log(output);
    }

    if (entry.metadata) {
      console.dir(entry.metadata, {
        depth: 8,
        colors: process.stdout.isTTY,
      });
    }
  }
}

export const contentLogger = new ContentLogger();
