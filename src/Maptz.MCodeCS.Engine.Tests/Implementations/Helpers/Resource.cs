using System;
using Xunit;
using Maptz.Testing;

using System.IO;
using System.Linq;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Maptz.Coding.Analysis.CSharp.Misc;
using System.Collections.Generic;

namespace Maptz.MCodeCS.Engine.Tests
{
    public class TextChangeHelpers
    {
        public static string ApplyChanges(string oldText, IEnumerable<CodeChange> changes)
        {

            var retval = oldText;
            foreach (var change in changes)
            {
                if (change.Kind == CodeChangeKind.DocumentChanged)
                {
                    var prefix = oldText.Substring(0, change.Start);
                    var suffix = oldText.Substring(change.End);
                    retval = prefix + change.NewText + suffix;
                }
            }
            return retval;
        }
    }

    public class Resource : IResource
    {
        public string Code { get; set; }
        public int? CursorPosition { get; set; }
    }
}