"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as configuration from "./configuration";
import * as request from "request";
import * as AdmZip from "adm-zip";
import * as logger from "./logger";
//NB npm install -D @types/request --save
//NB npm install -D @types/adm-zip --save

//https://github.com/cthackers/adm-zip

export class ToolInfo {
  private _configuration: configuration.IConfiguration;
  private _logger: logger.ILogger;

  constructor(configuration: configuration.IConfiguration) {
    this._configuration = configuration;
    this._logger = new logger.DefaultLoggerFactory().createLogger(
      "ToolDownloader"
    );
  }

  public get toolExePath() {
    if (this._configuration.toolPathOverride) {
      return this._configuration.toolPathOverride;
    }

    const extension = vscode.extensions.getExtension("maptz.mcodecs");
    if (!extension) throw "Cannot find extension 'maptz.mcodecs'.";
    const extensionPath = extension.extensionPath;
    const exeName = this._configuration.toolFileNameBase + ".exe";
    const retval = path.join(
      extensionPath,
      this._configuration.toolVersion,
      exeName
    );
    return retval;
  }

  public get toolExeArgs() {
    if (this._configuration.toolExeArgsPrefix) {
      return this._configuration.toolExeArgsPrefix;
    }
    return null;
  }

  public get toolExists() {
    const toolPath = this.toolExePath;
    const retval = fs.existsSync(toolPath);
    return retval;
  }

  public get rid() {
    //https://docs.microsoft.com/en-us/dotnet/core/rid-catalog
    const arch = os.arch();
    let ext = "-x64";
    switch (arch){
      case 'arm':
      case 'arm64': 
      case 'ia32':
      case  'mips':
      case  'mipsel':
      case  'ppc': 
      case 'ppc64':
      case  's390':
      case  's390x':
        throw "Architecture not supported";
      case 'x32':
        ext = "-x86";
        break;
      case  'x64':
        ext = "-x64";
        break;
    }
    const platform = os.platform();


    switch (platform) {
      case "darwin":
        return "osx-x64";
      case "aix":
      case "freebsd":
      case "linux":
      case "openbsd":
      case "sunos":
        return "linux" + ext;
      case "win32":
        return "win10"  + ext; 
    }
    throw "OS Not recognized";
  }

  public async doDownloadAsync() {
    if (this.toolExists) return;
    const rid = this.rid;
    const zipFileName = this._configuration.toolZipFileNameFormat
      .replace("{rid}", rid)
      .replace("{version}", this._configuration.toolVersion);
    const url = this._configuration.toolRemoteLocation + "/" + zipFileName;
    const extension = vscode.extensions.getExtension("maptz.mcodecs");
    if (!extension) throw "Cannot find extension 'maptz.mcodecs'.";
    const extensionPath = extension.extensionPath;
    const outputPath = path.join(
      extensionPath,
      this._configuration.toolVersion
    );

    this._logger.logInformation(`Downloading application from ${url}`);
    const body = await this.doDownloadUrl(url, prop => {
      //this._logger.logInformation(`Downloaded ${prop * 100.0}%`);
    });
    this._logger.logInformation(`Downloaded application.`);
    this._logger.logInformation(`Extracting to ${outputPath}`);
    await this.unzipBuffer(body, outputPath);
    this._logger.logInformation(`Tool file extracted to ${outputPath}`);
  }

  private unzipBuffer(buffer: any, outputPath: string) {
    return new Promise(function(resolve, reject) {
      var zip = new AdmZip(buffer);
      zip.extractAllTo(outputPath);
      resolve();
    });
  }

  private doDownloadUrl(url: string, progress?: (num: number) => void) {
    return new Promise((resolve, reject) => {
      let contentLength = -1;
      let downloadedBytes = 0;
      const req = request(
        {
          url: url,
          method: "GET",
          encoding: null
        },
        function(err: any, response: any, body: any) {
          if (err) {
            return reject(err);
          }
          if (progress) {
            progress(1.0);
          }
          resolve(body);
        }
      );

      req.on("response", data => {
        const hdr = data.headers["content-length"];
        if (hdr) {
          try {
            contentLength = parseInt(hdr);
          } catch {
            this._logger.logError(
              "Issue resolving content-length for download."
            );
          }
        }
      });

      req.on("data", function(chunk) {
        downloadedBytes += chunk.length;
        if (contentLength > 0) {
          let proportion = downloadedBytes / contentLength;
          if (progress) {
            progress(proportion);
          }
        }
      });
    });
  }
}