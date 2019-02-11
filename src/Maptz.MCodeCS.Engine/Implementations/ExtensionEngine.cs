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

namespace Maptz.MCodeCS.Engine
{

    public class ExtensionEngine : IExtensionEngine
    {

        public ExtensionEngine(IWorkspaceProvider workspaceProvider, IServiceProvider serviceProvider)
        {
            this.WorkspaceProvider = workspaceProvider;
            this.ServiceProvider = serviceProvider;
        }

        public IWorkspaceProvider WorkspaceProvider { get; }
        public IServiceProvider ServiceProvider { get; }

        public async Task AddTestAsync(string fileContents, string filePath, int cursor)
        {
            var tuple = await this.WorkspaceProvider.CreateWorkspaceAsync(fileContents, filePath);
            var service = this.ServiceProvider.GetRequiredService<ICreateTestsService>();
            var codeChanges = await service.CreateTest(tuple.workspace, tuple.document, cursor);
            throw new NotImplementedException("What is the right thing to return?");
        }

        public async Task ConvertToAsyncAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IAsyncMethodConverterService>();

            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");
        }

        public async Task ConvertToProtectedVirtualAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IProtectedVirtualMethodConverterService>();
            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");
        }

        public async Task ExpandPropertyAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IExpandPropertyService>();
            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");
        }

        public async Task ExpressAsPropertyAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IExpressPropertyService>();
            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");
        }

        public async Task ExpressAsStatementAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IExpressStatementService>();
            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");

        }

        public async Task ExtractClassAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IExtractClassService>();
            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");
        }

        public async Task RemoveUnusedUsingsAsync(string fileContents, string filePath, int cursor)
        {
            var cmp = new SimpleCodeManipulationContextProvider(fileContents, Path.GetFileName(filePath), cursorPosition: cursor); ;
            var tuple = await cmp.GetCodeManipulationContextAsync();
            var service = this.ServiceProvider.GetRequiredService<IRemoveUnusedUsingsService>();
            await service.Convert(tuple);
            throw new NotImplementedException("What is the right thing to return?");

        }


        public async Task SortAsync(string fileContents, string filePath, int cursor)
        {
            var tuple = await this.WorkspaceProvider.CreateWorkspaceAsync(fileContents, filePath);
            var csharpSorterService = this.ServiceProvider.GetRequiredService<ICSharpSorterService>();
            var codeChanges = await csharpSorterService.SortType(tuple.workspace, tuple.document);
            Console.WriteLine(codeChanges);
        }
    }
}