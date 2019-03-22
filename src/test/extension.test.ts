
/* #region  Imports */
import * as vscode from "vscode";
import * as assert from "assert";
import * as configuration from "./../configuration";
import * as toolDownloader from "../tool";
import * as path from "path";
import * as fs from "fs";
// import * as myExtension from '../extension';
/* #endregion */

/* #region Setup */
const skipLongRunningTests = false;
/* #endregion */

/* #region Common Functions */
function deleteFolderRecursive(path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
/* #endregion */

/* #region ToolInfo Tests */
suite("ToolInfo Tests", function() {
  test("ToolInfo constructs", function() {
    const config = new configuration.Configuration();
    const td = new toolDownloader.ToolInfo(config);
    assert.ok(td, "ToolDownloader constructor failed.");
  });

  test("rid returns expected value.", function() {
    const config = new configuration.Configuration();
    const td = new toolDownloader.ToolInfo(config);
    assert.equal("win10-x64", td.rid);
  });

  test("toolExePath returns expected default value.", function() {
    const config = new configuration.Configuration();
    const td = new toolDownloader.ToolInfo(config);
    assert.equal(
      "X:\\+++DEV\\MaptzGitHub\\vscode\\maptz.vscode.extensions.mcodecs\\src\\vscode\\mcodecs\\bin\\0.0.1\\Maptz.MCodeCS.Tool.exe",
      td.toolExePath
    );
  });
});
/* #endregion */

/* #region ToolDownloader Tests */
suite("ToolDownloader Tests", function() {
  !skipLongRunningTests &&
    test("doDownloadAsync creates a file.", async function() {
      this.timeout(1200000); //Increase the timeout.
      const config = new configuration.Configuration();
      const ti = new toolDownloader.ToolInfo(config);
      const outputChannelName = "Maptz.MCodeCS";
      let outputChannel = vscode.window.createOutputChannel(outputChannelName);
      const td = new toolDownloader.ToolDownloader(ti, outputChannel);

      var toolDirectoryPath = path.dirname(ti.toolExePath);
      deleteFolderRecursive(toolDirectoryPath);

      await td.doDownloadAsync();

      let fileExists = fs.existsSync(ti.toolExePath);
      assert.ok(fileExists, "ToolDownloader did not correctly download tool");
    });
});
/* #endregion */
