import type * as ts from 'typescript';
import type * as tsServer from 'typescript/lib/tsserverlibrary.js';

import {Logger} from './logger.js';

const tsPuppeteerPluginSymbol = Symbol('tsPuppeteerPluginSymbol');

interface TypeScriptServiceInit {
  typescript: typeof ts;
}

/**
 * Export a function for the ts-service to initialize our plugin.
 */
export = function init({
  typescript,
}: TypeScriptServiceInit): tsServer.server.PluginModule {
  return {
    create: (info: tsServer.server.PluginCreateInfo) => {
      // Check if the language service is already decorated
      if (tsPuppeteerPluginSymbol in info.languageService) {
        return info.languageService;
      }

      const logger = new Logger(info.project.projectService.logger);
      logger.info('Starting ts-puppeteer-plugin...');

      // Save the current working directory
      info.config.cwd = info.config.cwd || info.project.getCurrentDirectory();

      // Extend existing language service with the plugin functions
      const service = {
        getSemanticDiagnostics(fileName) {
          const program = info.languageService.getProgram();
          if (!program) {
            return [];
          }
          const file = program.getSourceFile(fileName);
          if (!file) {
            return [];
          }
          function walk(node: ts.Node, visit: (node: ts.Node) => void) {
            visit(node);
            node.forEachChild(node => {
              walk(node, visit);
            });
          }
          const diagnostics: ts.Diagnostic[] = [];
          const checker = program.getTypeChecker();

          const usingSymbols = ['ElementHandle', 'JSHandle'];
          walk(file, node => {
            if (
              typescript.isVariableDeclaration(node) &&
              typescript.isIdentifier(node.name)
            ) {
              const type = checker.getTypeAtLocation(node.name);
              let isElementHandleReference = false;
              if (type.isUnionOrIntersection()) {
                for (const member of type.types) {
                  if (
                    member.symbol !== undefined &&
                    usingSymbols.includes(member.symbol.escapedName as string)
                  ) {
                    isElementHandleReference = true;
                    break;
                  }
                }
              } else {
                isElementHandleReference =
                  type.symbol !== undefined
                    ? usingSymbols.includes(type.symbol.escapedName as string)
                    : false;
              }
              if (isElementHandleReference) {
                const def = info.languageService.getDefinitionAtPosition(
                  fileName,
                  node.getStart()
                )?.[0];
                if (
                  def?.kind !==
                  typescript.ScriptElementKind.variableUsingElement
                ) {
                  diagnostics.push({
                    category: typescript.DiagnosticCategory.Warning,
                    code: 5,
                    file,
                    start: node.name.getStart(),
                    length: node.name.getFullWidth() - 1,
                    messageText: `Use 'using'.`,
                  });
                }
              }
            }
          });
          return diagnostics;
        },
      } satisfies Partial<ts.LanguageService>;

      const old = info.languageService.getSemanticDiagnostics;
      info.languageService.getSemanticDiagnostics =
        function getSemanticDiagnostics(fileName) {
          return [
            ...old.call(this, fileName),
            ...service.getSemanticDiagnostics(fileName),
          ];
        };

      // Save that we've extended this service to prevent extending it again
      (info.languageService as any)[tsPuppeteerPluginSymbol] =
        tsPuppeteerPluginSymbol;

      return info.languageService;
    },
  };
};
