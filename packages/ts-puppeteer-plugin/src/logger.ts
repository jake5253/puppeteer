import {inspect} from 'util';

import * as tsServer from 'typescript/lib/tsserverlibrary.js';

export const enum LoggerLevel {
  Off,
  Info,
  Warn,
  Error,
}

export class Logger {
  level = LoggerLevel.Error;

  #logger: tsServer.server.Logger;
  constructor(logger: tsServer.server.Logger) {
    this.#logger = logger;
  }

  info(...args: any[]): void {
    this.#log(LoggerLevel.Info, ...args);
  }

  error(...args: any[]): void {
    this.#log(LoggerLevel.Error, ...args);
  }

  warn(...args: any[]): void {
    this.#log(LoggerLevel.Warn, ...args);
  }

  #log(level: LoggerLevel, ...args: unknown[]) {
    if (this.level >= level) {
      const message = inspect(args, {
        depth: 6,
        breakLength: 50,
        maxArrayLength: 10,
      });
      this.#logger.msg(
        `[ts-puppeteer-plugin] ${message}`,
        level === LoggerLevel.Error
          ? tsServer.server.Msg.Err
          : tsServer.server.Msg.Info
      );
    }
  }
}
