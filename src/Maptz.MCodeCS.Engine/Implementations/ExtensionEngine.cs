using Microsoft.Extensions.DependencyInjection;
using Maptz.Coding.Analysis.CSharp.Sorting;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System;
using System.Linq;
using System.Threading.Tasks;
using Maptz.Coding.Analysis.CSharp.TestCreator;
using Maptz.Coding.Analysis.CSharp.Misc;
using System.IO;
using Newtonsoft.Json;

namespace Maptz.MCodeCS.Engine
{

    public class ExtensionEngine : IExtensionEngine
    {

        public ExtensionEngine(IWorkspaceProvider workspaceProvider, IServiceProvider serviceProvider, IOutputService outputService)
        {
            this.WorkspaceProvider = workspaceProvider;
            this.ServiceProvider = serviceProvider;
            this.OutputService = outputService;
        }

        public IWorkspaceProvider WorkspaceProvider { get; }
        public IServiceProvider ServiceProvider { get; }
        public IOutputService OutputService { get; }

        public async Task RunCodeManipulator<T>(string fileContents, string filePath, int cursor) where T: ICodeManipulatorService
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, filePath, cursorPosition: cursor);
            //var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor);
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<T>();

            var cr = await service.Convert(tuple);
            var implementor = this.ServiceProvider.GetRequiredService<ICodeChangeImplementorService>() as CodeChangeImplementorService;
            await implementor.ApplyChangeAsync(tuple, cr);

            var json = JsonConvert.SerializeObject(implementor.Changes);
            this.OutputService.Write(json);
        }

        public async Task AddTestAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<ICreateTestsService>(fileContents, filePath, cursor);
        }

        public async Task ConvertToAsyncAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<IAsyncMethodConverterService>(fileContents, filePath, cursor);
        }

        public async Task ConvertToProtectedVirtualAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<IProtectedVirtualMethodConverterService>(fileContents, filePath, cursor);
        }

        public async Task ExpandPropertyAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<IExpandPropertyService>(fileContents, filePath, cursor);
            
        }

        public async Task ExpressAsPropertyAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<IExpressPropertyService>(fileContents, filePath, cursor);

            
        }

        public async Task ExpressAsStatementAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<IExpressStatementService>(fileContents, filePath, cursor);

            

        }

        public async Task ExtractClassAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<IExtractClassService>(fileContents, filePath, cursor);
        }

        public async Task RemoveUnusedUsingsAsync(string fileContents, string filePath, int cursor)
        {

            await this.RunCodeManipulator<IRemoveUnusedUsingsService>(fileContents, filePath, cursor);

        }


        public async Task SortAsync(string fileContents, string filePath, int cursor)
        {
            await this.RunCodeManipulator<ICSharpSorterService>(fileContents, filePath, cursor);
        }
    }
}