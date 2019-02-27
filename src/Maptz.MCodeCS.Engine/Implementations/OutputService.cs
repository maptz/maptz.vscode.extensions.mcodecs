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

    public class OutputService : IOutputService
    {
        public void Write(string str)
        {
            Console.Write(str);
        }
    }
}