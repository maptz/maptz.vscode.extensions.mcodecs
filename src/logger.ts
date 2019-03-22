"use strict";

export interface ILogger {
  name: string;
  logInformation(str: string): void;
  logError(str: string): void;
  logDebug(str: string): void;
}

export class ConsoleLogger implements ILogger {
  private _name: string;
  public get name(){ return this._name;}
  constructor(name: string){
      this._name = name;
  }
  public logInformation(str: string): void {
    console.log(str);
  }
  public logError(str: string): void {
    console.error(str);
  }
  public logDebug(str: string): void {
    console.log(str);
  }
}

export interface ILoggerFactory{
  createLogger(name: string) : ILogger;
}

export class DefaultLoggerFactory implements ILoggerFactory
{
  
  public createLogger(name: string) : ILogger
  {
    return new ConsoleLogger(name);
  }
}
