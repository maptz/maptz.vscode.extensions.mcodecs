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

        public async Task SortAsync(string content, int cursor)
        {
            var tuple = await this.WorkspaceProvider.CreateWorkspaceAsync(content);

            var csharpSorterService = this.ServiceProvider.GetRequiredService<ICSharpSorterService>();

            var codeChanges = await csharpSorterService.SortType(tuple.workspace, tuple.document);
            Console.WriteLine(codeChanges);
        }
    }
}