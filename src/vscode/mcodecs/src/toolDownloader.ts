'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as configuration from './configuration';
import * as request from "request";
import * as AdmZip from "AdmZip";

//https://github.com/cthackers/adm-zip

export class ToolDownloader{
    private _configuration : configuration.IConfiguration;
    constructor(configuration: configuration.IConfiguration){
      this._configuration = configuration;
    }

    public get toolExePath(){
      if (this._configuration.toolPathOverride){
        return this._configuration.toolPathOverride;
      }
      
      const extension = vscode.extensions.getExtension("maptz.mcodecs");
      if (!extension) throw "Cannot find extension 'maptz.mcodecs'.";
      const extensionPath = extension.extensionPath; 
      const exeName = this._configuration.toolFileNameBase + ".exe";
      const retval = path.join(extensionPath, this._configuration.toolVersion, exeName);
      return retval;
    }

    public get toolExists(){
      const toolPath = this.toolExePath;
      const retval = fs.existsSync(toolPath);
      return retval;
    }

    public get rid(){
      return "win10-x64"; //TODO how to tell which plaform
    }

    public async doDownloadAsync(){
      if (this.toolExists) return;
      const rid = this.rid;
      const zipFileName = this._configuration.toolZipFileNameFormat.replace("{rid}", rid).replace("{version}", this._configuration.toolVersion);
      const url = this._configuration.toolRemoteLocation + "/" + zipFileName;
      const body = await this.doDownloadUrl(url);
      await this.unzipBuffer(body);
    }

    private unzipBuffer(buffer: any){
      return new Promise(function (resolve, reject) {
        var resolved = false;
        var zip = new AdmZip(buffer);
        var zipEntries = zip.getEntries(); // an array of ZipEntry records

        zipEntries.forEach(function (zipEntry: any) {
            if (zipEntry.entryName == fileName) {
                resolved = true;
                resolve(zipEntry.getData().toString('utf8'));
            }
        });

        if (!resolved) {
            reject(new Error('No file found in archive: ' + fileName));
        }
    });
    }

    private doDownloadUrl(url: string){
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