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

    public class PipedInputModel
    {
        public int Cursor { get; set; }
        public string FileContents { get; set; }
        public string FilePath { get; set; }

    }


    public class CLIProgramRunner : ICliProgramRunner
    {



        /* #region Public Properties */
        public AppSettings AppSettings { get; }
        public IServiceProvider ServiceProvider { get; }
        public IExtensionEngine ExtensionEngine { get; }


        /* #endregion Public Properties */
        /* #region Public Constructors */
        public CLIProgramRunner(IOptions<AppSettings> appSettings, IServiceProvider serviceProvider, IExtensionEngine extensionEngine)
        {
            this.AppSettings = appSettings.Value;
            this.ServiceProvider = serviceProvider;
            this.ExtensionEngine = extensionEngine;
        }
        /* #endregion Public Constructors */

        private PipedInputModel ReceivePipedInput()
        {
            StringBuilder stringBuilder = new StringBuilder();
            var s = Console.ReadLine();
            do
            {
                s = Console.ReadLine();
                if (s != null) stringBuilder.AppendLine(s);
            } while (s != null);

            var json = stringBuilder.ToString();
            var retval = JsonConvert.DeserializeObject<PipedInputModel>(json);
            return retval;
        }

        /* #region Public Methods */
        public async Task RunAsync(string[] args)
        {
            await Task.Run(() =>
            {
                CommandLineApplication cla = new CommandLineApplication(throwOnUnexpectedArg: false);
                cla.HelpOption("-?|-h|--help");

                /* #region sort */
                cla.Command("sort", config =>
                                {
                                    config.Command("pipe", config2 =>
                                    {
                                        config2.OnExecute(async () =>
                                        {
                                            var pipedInput = ReceivePipedInput();
                                            await this.ExtensionEngine.SortAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                                            return 0;
                                        });
                                    });
                                    
                                });
                /* #endregion*/

                /* #region extract-class */
                cla.Command("extract-class", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ExtractClassAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/

                /* #region add-test */
                cla.Command("add-test", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.AddTestAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/

                /* #region convert-to-async */
                cla.Command("convert-to-async", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ConvertToAsyncAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/
                /* #region convert-to-protected-virtual */
                cla.Command("convert-to-protected-virtual", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ConvertToProtectedVirtualAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/
                /* #region correct-string-equality */
                cla.Command("convert-to-protected-virtual", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ExpressAsPropertyAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/
                /* #region create-settings */
                cla.Command("create-settings", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ExpressAsPropertyAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/

                /* #region express-as-property */
                cla.Command("express-as-property", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ExpressAsPropertyAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/

                /* #region express-as-statement */
                cla.Command("express-as-statement", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.ExpressAsStatementAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/

                /* #region remove-unused-usings */
                cla.Command("remove-unused-usings", config =>
                {
                    config.Command("pipe", config2 =>
                    {
                        config2.OnExecute(async () =>
                        {
                            var pipedInput = ReceivePipedInput();
                            await this.ExtensionEngine.RemoveUnusedUsingsAsync(pipedInput.FileContents, pipedInput.FilePath, pipedInput.Cursor);

                            return 0;
                        });
                    });
                });
                /* #endregion*/

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