/**
 * Copyright 2023 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import path from 'path';

import {Browser, type BrowserPlatform} from './browser-data/browser-data.js';
import {computeExecutablePath} from './launch.js';

/**
 * @public
 */
export class InstalledBrowser {
  browser: Browser;
  buildId: string;
  platform: BrowserPlatform;

  #cache: Cache;

  /**
   * @internal
   */
  constructor(
    cache: Cache,
    browser: Browser,
    buildId: string,
    platform: BrowserPlatform
  ) {
    this.#cache = cache;
    this.browser = browser;
    this.buildId = buildId;
    this.platform = platform;
  }

  /**
   * Path to the root of the installation folder. Use
   * {@link computeExecutablePath} to get the path to the executable binary.
   */
  get path(): string {
    return this.#cache.installationDir(
      this.browser,
      this.platform,
      this.buildId
    );
  }

  get executablePath(): string {
    return computeExecutablePath({
      cacheDir: this.#cache.rootDir,
      platform: this.platform,
      browser: this.browser,
      buildId: this.buildId,
    });
  }
}

/**
 * The cache used by Puppeteer relies on the following structure:
 *
 * - rootDir
 *   -- <browser1> | browserRoot(browser1)
 *   ---- <platform>-<buildId> | installationDir()
 *   ------ the browser-platform-buildId
 *   ------ specific structure.
 *   -- <browser2> | browserRoot(browser2)
 *   ---- <platform>-<buildId> | installationDir()
 *   ------ the browser-platform-buildId
 *   ------ specific structure.
 *   @internal
 */
export class Cache {
  #rootDir: string;

  constructor(rootDir: string) {
    this.#rootDir = rootDir;
  }

  /**
   * @internal
   */
  get rootDir(): string {
    return this.#rootDir;
  }

  browserRoot(browser: Browser): string {
    return path.join(this.#rootDir, browser);
  }

  installationDir(
    browser: Browser,
    platform: BrowserPlatform,
    buildId: string
  ): string {
    return path.join(this.browserRoot(browser), `${platform}-${buildId}`);
  }

  clear(): void {
    fs.rmSync(this.#rootDir, {
      force: true,
      recursive: true,
      maxRetries: 10,
      retryDelay: 500,
    });
  }

  uninstall(
    browser: Browser,
    platform: BrowserPlatform,
    buildId: string
  ): void {
    fs.rmSync(this.installationDir(browser, platform, buildId), {
      force: true,
      recursive: true,
      maxRetries: 10,
      retryDelay: 500,
    });
  }

  getInstalledBrowsers(): InstalledBrowser[] {
    if (!fs.existsSync(this.#rootDir)) {
      return [];
    }
    const types = fs.readdirSync(this.#rootDir);
    const browsers = types.filter((t): t is Browser => {
      return (Object.values(Browser) as string[]).includes(t);
    });
    return browsers.flatMap(browser => {
      const files = fs.readdirSync(this.browserRoot(browser));
      return files
        .map(file => {
          const result = parseFolderPath(
            path.join(this.browserRoot(browser), file)
          );
          if (!result) {
            return null;
          }
          return new InstalledBrowser(
            this,
            browser,
            result.buildId,
            result.platform as BrowserPlatform
          );
        })
        .filter((item: InstalledBrowser | null): item is InstalledBrowser => {
          return item !== null;
        });
    });
  }
}

function parseFolderPath(
  folderPath: string
): {platform: string; buildId: string} | undefined {
  const name = path.basename(folderPath);
  const splits = name.split('-');
  if (splits.length !== 2) {
    return;
  }
  const [platform, buildId] = splits;
  if (!buildId || !platform) {
    return;
  }
  return {platform, buildId};
}
