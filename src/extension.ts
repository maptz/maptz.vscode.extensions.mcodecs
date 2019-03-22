"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as tools from "./tool";
import * as config from "./configuration";
import * as codechange from "./codechange";

const debugMode = false;
console.log('Congratulations, your extension "mcodecs" is now active!');
const outputChannelName = "Maptz.MCodeCS";
let outputChannel = vscode.window.createOutputChannel(outputChannelName);

const toolInitializer = new tools.ToolInitializer(config.Configuration.loadConfiguration(debugMode), outputChannel);
toolInitializer.initialize();

export class ToolRunner {
  constructor() {}

  public async run(commandName: string) {
    outputChannel.appendLine(`Running command '${commandName}'. Please wait.`);
    try {
      await this.runInternal(commandName);
    } catch (err) {
      //Swallow the error.
      console.error(err);
    }
    outputChannel.appendLine(`Finished command '${commandName}'.`);
  }

  private runInternal(commandName: string) {
    //outputChannel.show();
    
    const textEditor = vscode.window.activeTextEditor;
    if (!textEditor) {
      outputChannel.appendLine(`No editor. Exiting.`);
      return;
    }
    if (toolInitializer.hasError){
      const issue = `Maptz.MCodeCS. Error running command '${commandName}'. The tool has not installed.`;
      outputChannel.appendLine(issue);
      vscode.window.showErrorMessage(issue + ` See output window ${outputChannelName} for more information.`);
      return;
    }
    if (!toolInitializer.hasInitialized){
      const issue = `Maptz.MCodeCS. Error running command '${commandName}'. The tool has not finished initializing.`;
      outputChannel.appendLine(issue);
      vscode.window.showErrorMessage(issue + ` See output window ${outputChannelName} for more information.`);
      return;
    }
    const configuration = config.Configuration.loadConfiguration(debugMode);
    const td = new tools.ToolInfo(configuration);

    const execFile = require("child_process").execFile;
    const stream = require("stream");
    const exeFilePath = td.toolExePath;
    const args: string[] = [];
    //Add any exe args. e.g. where you need to run dotnet run -p "" --
    if (td.toolExeArgs) {
      const parts = td.toolExeArgs.split(" ");
      parts.forEach(p => args.push(p));
    }
    args.push(commandName);
    args.push("pipe");
    const ret = new Promise((res, rej) => {
      const child = execFile(
        exeFilePath,
        args,
        async (err: any, stdout: any, stderr: any) => {
          if (!textEditor) {
            rej();
            return;
          };
          
          if (err || stderr) {
            vscode.window.showErrorMessage(
              `Error running command. See output window ${outputChannelName} for more information.`
            );
            outputChannel.show();
            outputChannel.appendLine(
              `Tool error while running command '${commandName}':`
            );
            outputChannel.appendLine(err);
            outputChannel.appendLine(stderr);
            rej(
              `Tool error while running command '${commandName}':` +
                err +
                stderr
            );
            return;
          }

          const codeChanges = <codechange.ICodeChanges>JSON.parse(stdout);
          if (codeChanges.error) {
            vscode.window.showInformationMessage(
              "Error running command. " + codeChanges.error
            );
            rej(codeChanges.error);
          } else {
            if (!codeChanges.changes || codeChanges.changes.length == 0) return;
            for (let i = codeChanges.changes.length - 1; i >= 0; i--) {
              const codeChange = codeChanges.changes[i];
              await textEditor.edit(editBuilder => {
                const range = new vscode.Range(
                  textEditor.document.positionAt(codeChange.start),
                  textEditor.document.positionAt(codeChange.end)
                );
                editBuilder.replace(range, codeChange.newText);
              });
            }
            res();
          }
        }
      );

      /* #region  Pipe in current document */
      const cursorOffset = textEditor.document.offsetAt(
        textEditor.selection.anchor
      );
      const fileContents = textEditor.document.getText();
      const pipedInputModel = {
        cursor: cursorOffset,
        filePath: textEditor.document.fileName,
        fileContents: fileContents
      };
      const json = JSON.stringify(pipedInputModel);
      var stdinStream = new stream.Readable();
      stdinStream.push(json); // Add data to the internal queue for users of the stream to consume
      stdinStream.push(null); // Signals the end of the stream (EOF)
      stdinStream.pipe(child.stdin);
      /* #endregion */
    });

    return ret;
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "mcodecs" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  const disposables = [];
  disposables.push(
    vscode.commands.registerCommand("mcodecs.addTest", async () => {
      await new ToolRunner().run("add-test");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.convertToAsync", async () => {
      await new ToolRunner().run("convert-to-async");
    })
  );
  disposables.push(
    vscode.commands.registerCommand(
      "mcodecs.convertToProtectedVirtual",
      async () => {
        await new ToolRunner().run("convert-to-protected-virtual");
      }
    )
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.createSettings", async () => {
      await new ToolRunner().run("create-settings");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.extractClass", async () => {
      await new ToolRunner().run("extract-class");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.expandProperty", async () => {
      await new ToolRunner().run("expand-property");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.expressAsProperty", async () => {
      await new ToolRunner().run("express-as-property");
    })
  );
  disposables.push(
    vscode.commands.registerCommand(
      "mcodecs.expressAsStatement",
      async () => {
        await new ToolRunner().run("express-as-statement");
      }
    )
  );
  disposables.push(
    vscode.commands.registerCommand(
      "mcodecs.removeUnusedUsings",
      async () => {
        await new ToolRunner().run("remove-unused-usings");
      }
    )
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.sortClass", async () => {
      await new ToolRunner().run("sort");
    })
  );

  for (let disp of disposables) {
    context.subscriptions.push(disp);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
