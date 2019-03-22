# Maptz MCode CS

Extends VS code to provide a number of helpful operations on C# files.

## Features

MCode CS is an open source Visual Studio Code extension. It currently supports a number of different operations:

- Add test *(Currently not working)*
- Convert to async
- Convert to protected virtual
- Create settings
- Extract class
- Expand property *(Currently not working)*
- Express as property
- Express as statement
- Remove unused usings
- Sort

Each of these features is described individually in the sections below. 

### Add Test (Currently not working)

Adds a test method matching the method that the cursor is at. This extension assumes that tests adopt a set of conventions.

- The test project should be in the same parent directory as the current project directory. 
- The test project is has the same as the project with a `.Tests` suffix, so if your project is called `SomeProject`, then the test project will be called `SomeProject.Tests`.

> Default keybinding `ctrl+m ctrl+t`

### Convert to async 

Converts the method at the cursor to an `async` method. 

> Default keybinding `ctrl+m ctrl+6`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/convert-to-async.gif)

### Convert to protected virtual

Converts the method at the cursor to an `protected virtual` method.

> Default keybinding `ctrl+m ctrl+7`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/convert-to-async.gif/imgs/convert-to-protected-virtual.gif)

### Create settings

Creates a class for storing settings for the current class. This method assumes you are using the .net core pattern in the Nuget package `Microsoft.Extensions.Options`. A poco class is created with the same name as the current class with the suffix `Settings`. Additionally, an instance of `IOptions<>` is added as a property on the current class injected by the constructor.

> Default keybinding `ctrl+m ctrl+s`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/create-settings.gif)


### Expand property (Currently not working)

Expands the current property to expose backing fields

> Default keybinding `ctrl+m ctrl+d`

### Express as property 

Expands the current statement to set a sensibly named property based on the current context

> Default keybinding `ctrl+m ctrl+z`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/express-as-property.gif)

### Express as statement

Expands the current statement to create a sensibly named variable based on the current context

> Default keybinding `ctrl+m ctrl+x`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/express-as-statement.gif)

### Extract class

Extracts the current class into a new file whose name matches the name of the class.

> Default keybinding `ctrl+m ctrl+e`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/extract-class.gif)

### Remove unused usings

Removes any unused using statements from the current document.

> Default keybinding `ctrl+m ctrl+f4`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/remove-unused-usings.gif)


### Sort

Sorts the members of the current class. 

> Default keybinding `ctrl+m ctrl+f4`

![](https://raw.githubusercontent.com/maptz/maptz.vscode.extensions.mcodecs/master/imgs/sort.gif)



## Requirements

The extension relies on execution of a cross-platform .net executable. When the extension is first run, it makes an attempt to download the executable to the `bin` directory of the extension.

## Extension Settings

The extension currently doesn't expose any settings.

## Known Issues

Please log any known issues on the [github issues page](https://github.com/maptz/maptz.vscode.extensions.mcodecs/issues) for this extension.

- Currently `Add-Test` is not fully supported.

## Release Notes

### 0.0.7

Minor updates and bug fixes

### 0.0.6

Minor updates and bug fixes

### 0.0.5

Minor updates and bug fixes

### 0.0.4

Minor updates and bug fixes

### 0.0.3

Minor publish updates.

### 0.0.2

Minor documentation updates.

### 0.0.1

The initial alpha-quality release of the extension.