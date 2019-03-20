using Maptz;
using Maptz.CliTools;
using Maptz.MCodeCS.Engine;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maptz.MCodeCS.Tool
{

    public delegate Task EngineMethod(string fileContents, string filepath, int cursor);


    public class CLIProgramRunner : ICliProgramRunner
    {
        /* #region Public Properties */
        public AppSettings AppSettings { get; }
        public IServiceProvider ServiceProvider { get; }
        public IExtensionEngine ExtensionEngine { get; }
        public IInputPipe InputPipe { get; }


        /* #endregion Public Properties */
        /* #region Public Constructors */
        public CLIProgramRunner(IOptions<AppSettings> appSettings, IServiceProvider serviceProvider, IExtensionEngine extensionEngine, IInputPipe inputPipe)
        {
            this.AppSettings = appSettings.Value;
            this.ServiceProvider = serviceProvider;
            this.ExtensionEngine = extensionEngine;
            this.InputPipe = inputPipe;
        }
        /* #endregion Public Constructors */


        public PipedInputModel ReceivePipedInput()
        {
            return this.InputPipe.ReceivePipedInput();
        }


        private void WireUpEngineMethod(CommandLineApplication config, EngineMethod engineMethod)
        {
            var inputFileOption = config.Option("-i|--input|<inputFilePath>", "Input file path", CommandOptionType.SingleValue);
            var cursorOption = config.Option("-c|--cursor|<cursorPos>", "Cursor position", CommandOptionType.SingleValue);
            config.OnExecute(async () =>
            {
                var inputFilePath = inputFileOption.Value();
                var cursorPositionS = cursorOption.HasValue() ? cursorOption.Value() : "0";
                var success = int.TryParse(cursorPositionS, out int cursorPosition);
                if (!success) throw new Exception("Invalid cursor position");
                string contents;
                using (var streamreader = new FileInfo(inputFilePath).OpenText())
                {
                    contents = streamreader.ReadToEnd();
                }
                await engineMethod(contents, inputFilePath, cursorPosition);
                return 0;
            });

            config.Command("pipe", config2 =>
            {
                config2.OnExecute(async () =>
                {
                    var pipedInput = ReceivePipedInput();
                    if (pipedInput == null) throw new Exception("No piped input");
                    await engineMethod(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);
                    return 0;
                });
            });
        }

        /* #region Public Methods */
        public async Task RunAsync(string[] args)
        {
            await Task.Run(() =>
            {
                CommandLineApplication cla = new CommandLineApplication(throwOnUnexpectedArg: false);
                cla.HelpOption("-?|-h|--help");
                cla.Command("add-test", config => WireUpEngineMethod(config, this.ExtensionEngine.AddTestAsync));
                cla.Command("convert-to-async", config => WireUpEngineMethod(config, this.ExtensionEngine.ConvertToAsyncAsync));
                cla.Command("convert-to-protected-virtual", config => WireUpEngineMethod(config, this.ExtensionEngine.ConvertToProtectedVirtualAsync));
                cla.Command("extract-class", config => WireUpEngineMethod(config, this.ExtensionEngine.ExtractClassAsync));
                cla.Command("express-as-property", config => WireUpEngineMethod(config, this.ExtensionEngine.ExpressAsPropertyAsync));
                cla.Command("express-as-statement", config => WireUpEngineMethod(config, this.ExtensionEngine.ExpressAsStatementAsync));
                cla.Command("remove-unused-usings", config => WireUpEngineMethod(config, this.ExtensionEngine.RemoveUnusedUsingsAsync));
                cla.Command("sort", config => WireUpEngineMethod(config, this.ExtensionEngine.SortAsync));
                /* #region Default */
                //Just show the help text.
                cla.OnExecute(() =>
                {
                    cla.ShowHelp();
                    return 0;

                });
                /* #endregion*/
                cla.Execute(args);
            });
        }
        /* #endregion Public Methods */
    }
}