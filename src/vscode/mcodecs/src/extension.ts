"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as tools from "./tool";
import * as config from "./configuration";
import * as codechange from "./codechange";

console.log('Congratulations, your extension "mcodecs" is now active!');
let outputChannel = vscode.window.createOutputChannel('Maptz.MCodeCS');

export class ToolRunner {
  constructor() {}

  public run(commandName: string) {
    const textEditor = vscode.window.activeTextEditor;
    if (!textEditor) return;
    //const configuration = config.Configuration.loadConfiguration();
    const configuration = new config.DebugConfiguration();
    const td = new tools.ToolInfo(configuration);

    const execFile = require("child_process").execFile;
    const stream = require("stream");
    const exeFilePath = td.toolExePath;
    const args = [];
    //Add any exe args. e.g. where you need to run dotnet run -p "" --
    if (td.toolExeArgs){
        const parts = td.toolExeArgs.split(" ");
        parts.forEach(p=>args.push(p));
    }
    args.push(commandName);
    args.push("pipe");
    const child = execFile(
      exeFilePath,
      args,
      (err: any, stdout: any, stderr: any) => {
        if (!textEditor) return;
        if (err || stderr){
            vscode.window.showErrorMessage("Error running command. See output window for more information.");    

            outputChannel.show();
            outputChannel.appendLine(`Error running comming ${commandName}`);
            outputChannel.appendLine(err);
            outputChannel.appendLine(stderr);
            return;
        }
        outputChannel.show();
        outputChannel.appendLine(stdout);
        
        const codeChanges = <codechange.ICodeChanges>JSON.parse(stdout);
        if (codeChanges.error) {
            vscode.window.showInformationMessage("Error running command. " + codeChanges.error);    
        } else {
          if (!codeChanges.changes || codeChanges.changes.length == 0) return;
          for (let i = 0; i < codeChanges.changes.length; i++) {
            const codeChange = codeChanges.changes[i];
            textEditor.edit(editBuilder => {
              const range = new vscode.Range(textEditor.document.positionAt(codeChange.start), textEditor.document.positionAt(codeChange.end));
              editBuilder.replace(range, codeChange.newText);
            });
          }
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
    outputChannel.appendLine("Writing json");
    outputChannel.appendLine(json);
    stdinStream.push(json); // Add data to the internal queue for users of the stream to consume
    stdinStream.push(null); // Signals the end of the stream (EOF)
    stdinStream.pipe(child.stdin);
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
  
  const disposables = [];
  disposables.push(vscode.commands.registerCommand("extension.addTest",() => {(new ToolRunner()).run("add-test");}));
  disposables.push(vscode.commands.registerCommand("extension.convertToAsync",() => {(new ToolRunner()).run("convert-to-async");}));
  disposables.push(vscode.commands.registerCommand("extension.convertToProtectedVirtual",() => {(new ToolRunner()).run("convert-to-protected-virtual");}));
  disposables.push(vscode.commands.registerCommand("extension.extractClass",() => {(new ToolRunner()).run("extract-class");}));
  disposables.push(vscode.commands.registerCommand("extension.extractAsProperty",() => {(new ToolRunner()).run("extract-as-property");}));
  disposables.push(vscode.commands.registerCommand("extension.extractAsStatement",() => {(new ToolRunner()).run("extract-as-statement");}));
  disposables.push(vscode.commands.registerCommand("extension.removeUnusedUsings",() => {(new ToolRunner()).run("remove-unused-usings");}));
  disposables.push(vscode.commands.registerCommand("extension.sortClass",() => {(new ToolRunner()).run("sort");}));

  for(let disp of disposables){
    context.subscriptions.push(disp);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
