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
    public interface IExtensionEngine
    {
        Task SortAsync(string content, int cursor);
    }
}