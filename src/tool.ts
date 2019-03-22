"use strict";
/* #region  Imports */
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
/* #endregion */

/* #region  IToolInfo */
export interface IToolInfo {
  configuration: configuration.IConfiguration;
  toolExePath: string;
  toolExeArgs: string | null;
  toolExists: boolean;
  rid: string;
}
/* #endregion */

/* #region  ToolInfo */
export class ToolInfo implements IToolInfo {
  private _configuration: configuration.IConfiguration;

  public get configuration() {
    return this._configuration;
  }

  constructor(configuration: configuration.IConfiguration) {
    this._configuration = configuration;
  }

  public get toolExePath() {
    if (this._configuration.toolPathOverride) {
      return this._configuration.toolPathOverride;
    }

    const extension = vscode.extensions.getExtension("maptz.mcodecs");
    if (!extension) throw "Cannot find extension 'maptz.mcodecs'.";
    const extensionPath = extension.extensionPath;
    let fileExtension = "";
    const platform = os.platform();
    switch (platform) {
      case "darwin":
        fileExtension = "";
        break;
      case "aix":
      case "freebsd":
      case "linux":
      case "openbsd":
      case "sunos":
        fileExtension = "";
        break;
      case "win32":
        fileExtension = ".exe";
        break;
    }

    const exeName = this._configuration.toolFileNameBase + fileExtension;
    const retval = path.join(
      extensionPath,
      "bin",
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
    switch (arch) {
      case "arm":
      case "arm64":
      case "ia32":
      case "mips":
      case "mipsel":
      case "ppc":
      case "ppc64":
      case "s390":
      case "s390x":
        throw "Architecture not supported";
      case "x32":
        ext = "-x86";
        break;
      case "x64":
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
        return "win10" + ext;
    }
    throw "OS Not recognized";
  }
}
/* #endregion */

export interface IToolDownloadHistory {}

/* #region  ToolDownloader */
export class ToolDownloader {
  private _logger: logger.ILogger;
  private _toolInfo: IToolInfo;
  private _outputChannel: vscode.OutputChannel;

  constructor(toolInfo: IToolInfo, outputChannel: vscode.OutputChannel) {
    this._logger = new logger.DefaultLoggerFactory().createLogger(
      "ToolDownloader"
    );
    this._toolInfo = toolInfo;
    this._outputChannel = outputChannel;
  }

  public async doDownloadAsync() {
    if (this._toolInfo.toolExists) return;
    const rid = this._toolInfo.rid;
    const zipFileName = this._toolInfo.configuration.toolZipFileNameFormat
      .replace("{rid}", rid)
      .replace("{version}", this._toolInfo.configuration.toolVersion);
    const url =
      this._toolInfo.configuration.toolRemoteLocation + "/" + zipFileName;
    const extension = vscode.extensions.getExtension("maptz.mcodecs");
    if (!extension) throw "Cannot find extension 'maptz.mcodecs'.";
    const extensionPath = extension.extensionPath;
    const outputPath = path.join(
      extensionPath,
      "bin",
      this._toolInfo.configuration.toolVersion
    );

    let toolProportion = -1000;
    this._logger.logInformation(`Downloading application from ${url}`);
    const body = await this.doDownloadUrl(url, prop => {
      if (prop - toolProportion > 0.05) {
        toolProportion = prop;
        const percent = (toolProportion * 100.0).toFixed(1);
        this._outputChannel.appendLine(`   Downloaded ${percent} %`);
      }
      //this._logger.logInformation(`Downloaded ${prop * 100.0}%`);
    });
    this._logger.logInformation(`Downloaded application.`);
    this._logger.logInformation(`Extracting to ${outputPath}`);
    this._outputChannel.appendLine(`   Extracting tool from zip file.`);
    await this.unzipBuffer(body, outputPath);
    //On osx and linux you need to give permissions to run this. 
    if (rid.startsWith("linux-") || rid.startsWith("osx-")){
      this._outputChannel.appendLine(`Applying permissions to downloaded executable.`);
      fs.chmodSync(this._toolInfo.toolExePath, '755');
    }
    //chmod a+x Maptz.MCodeCS.Tool
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
/* #endregion */

export class ToolInitializer {
  private _configuration: configuration.IConfiguration;
  private _outputChannel: vscode.OutputChannel;

  public get configuration() {
    return this._configuration;
  }

  constructor(
    configuration: configuration.IConfiguration,
    outputChannel: vscode.OutputChannel
  ) {
    this._configuration = configuration;
    this._outputChannel = outputChannel;
  }

  public hasError = false;
  public hasInitialized = false;

  public async initialize() {
    const toolInfo = new ToolInfo(this.configuration);
    if (!toolInfo.toolExists) {
      //this._outputChannel.show();
      vscode.window.showInformationMessage(
        `Maptz.MCodeCS Tool initializing. See output window for progress.`
      );
      this._outputChannel.appendLine(
        "Maptz.MCodeCS Tool doesn't exist. Downloading..."
      );
      const toolDownloader = new ToolDownloader(toolInfo, this._outputChannel);
      try {
        await toolDownloader.doDownloadAsync();
        this.hasInitialized = true;
        this._outputChannel.appendLine("Maptz.MCodeCS Tool downloaded.");
        this._outputChannel.appendLine(
          "Maptz.MCodeCS initialized successfully."
        );
      } catch (err) {
        this.hasError = true;
        this._outputChannel.appendLine("Maptz.MCodeCS failed to initialize.");
        this._outputChannel.appendLine(err);
      }
    } else {
      this.hasInitialized = true;
      this._outputChannel.appendLine("Maptz.MCodeCS initialized successfully.");
    }
  }
}
