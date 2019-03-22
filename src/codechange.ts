"use strict";

export enum CodeChangeKind {
  ProjectAdded,
  ProjectDeleted,
  DocumentAdded,
  DocumentDeleted,
  DocumentChanged
}

export interface ICodeChange {
  kind: CodeChangeKind;
  start: number;
  end: number;
  newText: string;
  filePath: string;
}

export class CodeChange implements ICodeChange {
  public kind: CodeChangeKind = CodeChangeKind.DocumentAdded;
  public start: number = 0;
  public end: number = 0;
  public newText: string = "";
  public filePath: string = "";
}

export interface ICodeChanges{
  changes: ICodeChange[];
  error: string | null;
}