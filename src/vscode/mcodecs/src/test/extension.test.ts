import * as assert from "assert";
import * as configuration from "./../configuration";
import * as toolDownloader from "../tool";
import * as path from "path";
import * as fs from "fs";
// import * as myExtension from '../extension';
const skipLongRunningTests = false;

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

/* #region  toolDownloader Tests */
suite("toolDownloader Tests", function() {
  test("ToolDownloader constructs", function() {
    const config = new configuration.Configuration();
    const td = new toolDownloader.ToolInfo(config);
    assert.ok(td, "ToolDownloader constructor failed.");
  });

  test("ToolDownloader.rid returns expected value.", function() {
    const config = new configuration.Configuration();
    const td = new toolDownloader.ToolInfo(config);
    assert.equal("win10-x64", td.rid);
  });

  test("ToolDownloader.toolExePath returns expected default value.", function() {
    const config = new configuration.Configuration();
    const td = new toolDownloader.ToolInfo(config);
    assert.equal(
      "X:\\+++DEV\\MaptzGitHub\\vscode\\maptz.vscode.extensions.mcodecs\\src\\vscode\\mcodecs\\0.0.1\\Maptz.MCodeCS.Tool.exe",
      td.toolExePath
    );
  });

  !skipLongRunningTests &&
    test("ToolDownloader.doDownloadAsync creates a file.", async function() {
      this.timeout(1200000); //Increase the timeout.
      const config = new configuration.Configuration();
      const td = new toolDownloader.ToolInfo(config);

      var toolDirectoryPath = path.dirname(td.toolExePath);
      deleteFolderRecursive(toolDirectoryPath);

      await td.doDownloadAsync();

      let fileExists = fs.existsSync(td.toolExePath);
      assert.ok(fileExists, "ToolDownloader did not correctly download tool");
    });
});
/* #endregion */

