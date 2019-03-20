'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
export const configurationName = "maptz.mcodecs";

export interface IConfiguration {
    toolPathOverride : string | null;
    toolRemoteLocation : string ;
    toolZipFileNameFormat : string;
    toolFileNameBase : string;
    toolVersion: string;
  }

export class Configuration implements IConfiguration{
    
    public toolPathOverride : string | null = null;
    public toolRemoteLocation : string = "https://downloads.stephenellis.com/public/";
    public toolZipFileNameFormat : string = "Maptz.MCodeCS.Tool.{rid}.{version}.zip"
    public toolFileNameBase : string = "Maptz.MCodeCS.Tool"
    public toolVersion : string = "0.0.1";

    public static loadConfiguration() {
        let loadedConfig = vscode.workspace
          .getConfiguration()
          .get<IConfiguration>(configurationName);
        let config: IConfiguration = Object.assign(
          {},
          new Configuration()
        );
        config = Object.assign(config, loadedConfig);
        return config;
      }
}