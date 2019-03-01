using System;
using Xunit;
using Maptz.Testing;

using System.IO;
using System.Linq;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
namespace Maptz.MCodeCS.Tool.Tests
{

    public class ResourceHelpers
    {

        public static IResource GetExpandedResource(string resourceName)
        {
            var expected = "{{CURSOR}}";
            var str = GetStringResource(resourceName);
            var idx = str.IndexOf(expected);
            if (idx < 0)
            {
                return new Resource
                {
                    Code = str,
                    CursorPosition = null
                };
            }
            var prefix = str.Substring(0, idx);
            var suffix = str.Substring(idx + expected.Length);
            var all = prefix + suffix;
            return new Resource
            {
                Code = all,
                CursorPosition = idx
            };
        }
        public static string GetStringResource(string resourceName)
        {
            var typ = typeof(ResourceHelpers);
            var resNames = typ.Assembly.GetManifestResourceNames();
            var nm = typ.Namespace.ToString() + ".resx." + resourceName;
            var match = resNames.Any(q => q == nm);
            var str = typ.Assembly.GetManifestResourceStream(nm);
            string retval;
            //Maptz.Coding.Analysis.CSharp.Misc.Tests.resx.AsyncMethodSample1.curr
            //Maptz.Coding.Anslysis.CSharp.Misc.Tests.resx.AsyncMethodSample1.curr
            using (var sr = new StreamReader(str))
            {
                retval = sr.ReadToEnd();
            }
            return retval;
        }
    }
}