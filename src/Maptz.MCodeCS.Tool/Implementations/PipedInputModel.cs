using Maptz;
using Maptz.CliTools;
using Maptz.MCodeCS.Engine;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Maptz.MCodeCS.Tool
{

    public class PipedInputModel
    {
        public int Cursor { get; set; }
        public string FileContents { get; set; }
        public string FilePath { get; set; }

    }
}