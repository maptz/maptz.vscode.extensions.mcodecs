'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as configuration from './configuration';
import * as request from "request";
import * as AdmZip from "adm-zip";
//NB npm install -D @types/request --save
//NB npm install -D @types/adm-zip --save

//https://github.com/cthackers/adm-zip

export class ToolDownloader {
  private _configuration: configuration.IConfiguration;
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
    const exeName = this._configuration.toolFileNameBase + ".exe";
    const retval = path.join(extensionPath, this._configuration.toolVersion, exeName);
    return retval;
  }

  public get toolExists() {
    const toolPath = this.toolExePath;
    const retval = fs.existsSync(toolPath);
    return retval;
  }

  public get rid() {

    //https://docs.microsoft.com/en-us/dotnet/core/rid-catalog
    var platform = os.platform();
    var arch = os.arch();
    switch (platform) {

      case 'darwin':
        return "osx-x64";
      case 'aix':
      case 'freebsd':
      case 'linux':
      case 'openbsd':
      case 'sunos':
        return "linux-x64";
      case 'win32':
        return "win10-x64"; //TODO how to tell which plaform
    }
    throw "OS Not recognized";

  }

  public async doDownloadAsync() {
    if (this.toolExists) return;
    const rid = this.rid;
    const zipFileName = this._configuration.toolZipFileNameFormat.replace("{rid}", rid).replace("{version}", this._configuration.toolVersion);
    const url = this._configuration.toolRemoteLocation + "/" + zipFileName;
    const extension = vscode.extensions.getExtension("maptz.mcodecs");
    if (!extension) throw "Cannot find extension 'maptz.mcodecs'.";
    const extensionPath = extension.extensionPath;
    const outputPath = path.join(extensionPath, this._configuration.toolVersion);

    const body = await this.doDownloadUrl(url);
    await this.unzipBuffer(body, outputPath);
  }

  private unzipBuffer(buffer: any, outputPath: string) {
    return new Promise(function (resolve, reject) {
      var zip = new AdmZip(buffer);
      zip.extractAllTo(outputPath);
      resolve();
    });
  }

  private doDownloadUrl(url: string) {
    return new Promise(function (resolve, reject) {
      request({
        url: url,
        method: 'GET',
        encoding: null
      }, function (err: any, response: any, body: any) {
        if (err) {
          return reject(err);
        }
        resolve(body);
      });
    });
  }

}