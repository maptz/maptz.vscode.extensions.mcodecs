using Maptz;
using Maptz.CliTools;
using Maptz.MCodeCS.Engine;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maptz.MCodeCS.Tool
{

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
        /* #region Public Methods */
        public async Task RunAsync(string[] args)
        {
            await Task.Run(() =>
            {
                CommandLineApplication cla = new CommandLineApplication(throwOnUnexpectedArg: false);
                cla.HelpOption("-?|-h|--help");

                /* #region get */
                cla.Command("sort", config =>
                                {
                                    config.Command("pipe", config2 =>
                                    {
                                        config2.OnExecute(async () =>
                                        {
                                            //if (!Debugger.IsAttached)
                                            //{
                                            //    Debugger.Launch();
                                            //    Debugger.Break();
                                            //}
                                            
                                            StringBuilder stringBuilder = new StringBuilder();
                                            var s = Console.ReadLine();
                                            do
                                            {
                                                s = Console.ReadLine();
                                                if (s != null) stringBuilder.AppendLine(s);
                                            } while (s != null);

                                            var content = stringBuilder.ToString();
                                            await this.ExtensionEngine.SortAsync(content, 0);

                                            return 0;
                                        });
                                    });
                                    
                                    var inputOption = config.Option("-i|--input <inputFilePath>", "The project file", CommandOptionType.SingleValue);
                                    config.OnExecute(async () =>
                                    {
                                        var inputFilePath = inputOption.HasValue() ? inputOption.Value() : null;
                                        string content;
                                        using (var str = new FileInfo(inputFilePath).OpenText()) { content = await str.ReadToEndAsync(); }
                                        await this.ExtensionEngine.SortAsync(content, 0);
                                        return 0;
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