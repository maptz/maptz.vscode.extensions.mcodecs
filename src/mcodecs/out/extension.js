'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mcodecs" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sortClass', () => {
        // The code you place here will be executed every time your command is executed
        var textEditor = vscode.window.activeTextEditor;
        if (!textEditor)
            return;
        var str = textEditor.document.getText();
        // Display a message box to the user
        vscode.window.showInformationMessage('Sort Class!');
        var execFile = require('child_process').execFile;
        var stream = require('stream');
        var exe = "X:\\+++DEV\\MaptzGitHub\\vscode\\maptz.vscode.extensions.mcodecs\\src\\Maptz.MCodeCS.Tool\\bin\\Debug\\netcoreapp2.1\\Maptz.MCodeCS.Tool.exe";
        var child = execFile(exe, ['sort', 'pipe'], function (err, stdout, stderr) {
            console.log(err);
            console.log(stdout);
            console.log(stderr);
            if (!textEditor)
                return;
            textEditor.edit(editBuilder => {
                if (!textEditor)
                    return;
                debugger;
                editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), textEditor.document.lineAt(textEditor.document.lineCount - 1).range.end), stdout);
            });
            stdout;
        });
        var input = str;
        var stdinStream = new stream.Readable();
        stdinStream.push(input); // Add data to the internal queue for users of the stream to consume
        stdinStream.push(null); // Signals the end of the stream (EOF)
        stdinStream.pipe(child.stdin);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map