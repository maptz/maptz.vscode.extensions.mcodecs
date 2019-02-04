using Microsoft.Extensions.DependencyInjection;
using Maptz.Coding.Analysis.CSharp.Sorting;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System;
using System.Linq;
using System.Threading.Tasks;
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
            throw new NotImplementedException();
        }

        public async Task ConvertToAsyncAsync(string fileContents, string filePath, int cursor)
        {
            throw new NotImplementedException();
        }

        public async Task ConvertToProtectedVirtualAsync(string fileContents, string filePath, int cursor)
        {
            throw new NotImplementedException();
        }

        public async Task ExpressAsPropertyAsync(string fileContents, string filePath, int cursor)
        {
            throw new NotImplementedException();
        }

        public async Task ExpressAsStatementAsync(string fileContents, string filePath, int cursor)
        {
            throw new NotImplementedException();
        }

        public async Task ExtractClassAsync(string fileContents, string filePath, int cursor)
        {
            throw new NotImplementedException();
        }

        public async Task RemoveUnusedUsingsAsync(string fileContents, string filePath, int cursor)
        {
            throw new NotImplementedException();
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