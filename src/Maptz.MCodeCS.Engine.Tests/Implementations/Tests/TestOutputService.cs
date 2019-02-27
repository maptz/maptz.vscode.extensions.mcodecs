using System;
using Xunit;
using Maptz.Testing;
using Microsoft.Extensions.DependencyInjection;
using Maptz.Coding.Analysis.CSharp.Misc;
using Maptz.Coding.Analysis.CSharp.TestCreator;
using Maptz.Coding.Analysis.CSharp.Sorting;
using System.IO;
using System.Threading.Tasks;
using Maptz.Coding.Analysis.CSharp;
using Moq;
namespace Maptz.MCodeCS.Engine.Tests
{
    public class TestOutputService : IOutputService
    {
        public string WrittenText { get; set; }
        public void Write(string str)
        {
            this.WrittenText = str;
        }
    }
}