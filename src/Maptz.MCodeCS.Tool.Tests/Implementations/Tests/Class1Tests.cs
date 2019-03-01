using System;
using Xunit;
using Maptz.Testing;
using Maptz.MCodeCS.Tool;
using Microsoft.Extensions.DependencyInjection;
using Maptz.CliTools;
using Maptz.MCodeCS.Engine;
using Maptz.Coding.Analysis.CSharp.Sorting;
using Maptz.Coding.Analysis.CSharp.TestCreator;
using Maptz.Coding.Analysis.CSharp.Misc;
using System.Threading.Tasks;
using System.IO;

namespace Maptz.MCodeCS.Tool.Tests
{
    public class TestOutputService : IOutputService
    {
        public string Written { get; set; }
        public void Write(string str)
        {
            this.Written += str;
        }
    }

    public class TestInputPipe : IInputPipe
    {
        public PipedInputModel PipedInput { get; set; }
        public PipedInputModel ReceivePipedInput()
        {
            return PipedInput;
        }
    }
    public class CliProgramRunnerTests
    {

        private IServiceCollection ConfigureServices()
        {
            var services = new ServiceCollection();
            services.AddOptions();
            services.AddTransient<ICliProgramRunner, CLIProgramRunner>();
            services.AddTransient<IExtensionEngine, ExtensionEngine>();
            services.AddTransient<IWorkspaceProvider, WorkspaceProvider>();

            services.AddTransient<ICSharpSorterService, CSharpSorterService>();
            services.AddTransient<ISortGroupingOrderingService, DefaultSortGroupingService>();
            services.AddTransient<ISortGroupingService, DefaultSortGroupingService>();
            services.AddTransient<IMemberDeclarationOrderingService, DefaultSortGroupingService>();


            services.AddTransient<ICreateTestsService, CreateTestsService>();
            services.AddTransient<IAsyncMethodConverterService, AsyncMethodConverterService>();
            services.AddTransient<IProtectedVirtualMethodConverterService, ProtectedVirtualMethodConverterService>();
            services.AddTransient<IExpandPropertyService, ExpandPropertyService>();

            services.AddTransient<IRemoveUnusedUsingsService, RemoveUnusedUsingsService>();
            services.AddTransient<IExpressPropertyService, ExpressPropertyService>();
            services.AddTransient<IExpressStatementService, ExpressStatementService>();
            services.AddTransient<IExtractClassService, ExtractClassService>();
            services.AddSingleton<IInputPipe, TestInputPipe>();
            services.AddSingleton<IOutputService, TestOutputService>();
            services.AddTransient<ICodeChangeImplementorService, CodeChangeImplementorService>();
            return services;
        }
        /* #region Public Methods */
        [Fact]
        public async Task CreateSettings_Works()
        {
            /* #region Arrange */
            var services = this.ConfigureServices();
            var sp = services.BuildServiceProvider();

            var cliProgramRunner = sp.GetRequiredService<ICliProgramRunner>();
            var inputPipe = sp.GetRequiredService<IInputPipe>() as TestInputPipe;
            var outputService = sp.GetRequiredService<IOutputService>() as TestOutputService;
            var resource = ResourceHelpers.GetExpandedResource("ExpressPropertySample1.curr");
            inputPipe.PipedInput = new PipedInputModel
            {
                Cursor = resource.CursorPosition.Value,
                FileContents = resource.Code,
                FilePath = Path.Combine(Directory.GetCurrentDirectory(), "SomeFile.cs")
            };

            /* #endregion */

            /* #region Act */
            await cliProgramRunner.RunAsync(new string[] { "express-as-property", "pipe" });
            /* #endregion */

            /* #region Assert */
           var wr = outputService.Written;

            Assert.False(true);
            /* #endregion */
        }
        /* #endregion Public Methods */
    }
}