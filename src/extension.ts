"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as tools from "./tool";
import * as config from "./configuration";
import * as codechange from "./codechange";

const useDebugMode = true;
const useStreamMode = false;

const outputChannelName = "Maptz.MCodeCS";
let outputChannel = vscode.window.createOutputChannel(outputChannelName);

const toolInitializer = new tools.ToolInitializer(
  config.Configuration.loadConfiguration(useDebugMode),
  outputChannel
);
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
    if (toolInitializer.hasError) {
      const issue = `Maptz.MCodeCS. Error running command '${commandName}'. The tool has not installed.`;
      outputChannel.appendLine(issue);
      vscode.window.showErrorMessage(
        issue + ` See output window ${outputChannelName} for more information.`
      );
      return;
    }
    if (!toolInitializer.hasInitialized) {
      const issue = `Maptz.MCodeCS. Error running command '${commandName}'. The tool has not finished initializing.`;
      outputChannel.appendLine(issue);
      vscode.window.showErrorMessage(
        issue + ` See output window ${outputChannelName} for more information.`
      );
      return;
    }
    const configuration = config.Configuration.loadConfiguration(useDebugMode);
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
          }

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

            await textEditor.edit(editBuilder => {
              for (let i = codeChanges.changes.length - 1; i >= 0; i--) {
                const codeChange = codeChanges.changes[i];
                const range = new vscode.Range(
                  textEditor.document.positionAt(codeChange.start),
                  textEditor.document.positionAt(codeChange.end)
                );
                editBuilder.replace(range, codeChange.newText);
              }
            });

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

export class ToolRunner2 {
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

  private _exe: any;

  public initialize() {
    if (this._exe) return this._exe;

    const configuration = config.Configuration.loadConfiguration(useDebugMode);

    const td = new tools.ToolInfo(configuration);
    const execFile = require("child_process").execFile;

    const exeFilePath = td.toolExePath;
    const args: string[] = [];
    //Add any exe args. e.g. where you need to run dotnet run -p "" --
    if (td.toolExeArgs) {
      const parts = td.toolExeArgs.split(" ");
      parts.forEach(p => args.push(p));
    }
    args.push("stream");
    const child = execFile(
      exeFilePath,
      args,
      async (err: any, stdout: any, stderr: any) => {
        if (err || stderr) {
          vscode.window.showErrorMessage(
            `Error running command. See output window ${outputChannelName} for more information.`
          );
          outputChannel.show();
          outputChannel.appendLine(`Tool error:`);
          outputChannel.appendLine(err);
          outputChannel.appendLine(stderr);
          return;
        }
        outputChannel.appendLine(stdout);
      }
    );
    this._exe = child;
    return child;
  }

  private runInternal(commandName: string) {
    //outputChannel.show();

    const textEditor = vscode.window.activeTextEditor;
    /* #region  Validate state */
    if (!textEditor) {
      outputChannel.appendLine(`No editor. Exiting.`);
      return;
    }
    if (toolInitializer.hasError) {
      const issue = `Maptz.MCodeCS. Error running command '${commandName}'. The tool has not installed.`;
      outputChannel.appendLine(issue);
      vscode.window.showErrorMessage(
        issue + ` See output window ${outputChannelName} for more information.`
      );
      return;
    }
    if (!toolInitializer.hasInitialized) {
      const issue = `Maptz.MCodeCS. Error running command '${commandName}'. The tool has not finished initializing.`;
      outputChannel.appendLine(issue);
      vscode.window.showErrorMessage(
        issue + ` See output window ${outputChannelName} for more information.`
      );
      return;
    }
    /* #endregion */

    /* #region  Pipe in current document */
    const cursorOffset = textEditor.document.offsetAt(
      textEditor.selection.anchor
    );
    const fileContents = textEditor.document.getText();
    const pipedInputModel = {
      commandName: commandName,
      cursor: cursorOffset,
      filePath: textEditor.document.fileName,
      fileContents: fileContents
    };
    const json = JSON.stringify(pipedInputModel);

    var prom = new Promise((res, rej) => {
      const https = require("https");
            const options = {
        hostname: "http://localhost",
        port: 8089,
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": json.length
        }
      };

      const req = https.request(options, (response: any) => {
        console.log(`statusCode: ${response.statusCode}`);
        response.on("data", (d : any) => {
          process.stdout.write(d);
          res();
        });
      });

      req.on("error", (error: any) => {
        console.error(error);
        rej(error);
      });

      req.write(json);
      req.end();
    });
    return prom;

    /* #endregion */
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

  const toolRunner = new ToolRunner();
  //const toolRunner = new ToolRunner2(); //Can't get this to work yet!
  //const exe = toolRunner.initialize();
  const disposables = [];
  disposables.push(
    vscode.commands.registerCommand("mcodecs.addTest", async () => {
      await toolRunner.run("add-test");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.convertToAsync", async () => {
      await toolRunner.run("convert-to-async");
    })
  );
  disposables.push(
    vscode.commands.registerCommand(
      "mcodecs.convertToProtectedVirtual",
      async () => {
        await toolRunner.run("convert-to-protected-virtual");
      }
    )
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.createSettings", async () => {
      await toolRunner.run("create-settings");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.extractClass", async () => {
      await toolRunner.run("extract-class");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.expandProperty", async () => {
      await toolRunner.run("expand-property");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.expressAsProperty", async () => {
      await toolRunner.run("express-as-property");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.expressAsStatement", async () => {
      await toolRunner.run("express-as-statement");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.removeUnusedUsings", async () => {
      await toolRunner.run("remove-unused-usings");
    })
  );
  disposables.push(
    vscode.commands.registerCommand("mcodecs.sortClass", async () => {
      await toolRunner.run("sort");
    })
  );

  for (let disp of disposables) {
    context.subscriptions.push(disp);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
