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

    public class DefaultInputPipe : IInputPipe
    {
        public PipedInputModel ReceivePipedInput()
        {
            StringBuilder stringBuilder = new StringBuilder();
            var s = Console.ReadLine();
            do
            {
                s = Console.ReadLine();
                if (s != null) stringBuilder.AppendLine(s);
            } while (s != null);

            var json = stringBuilder.ToString();
            var retval = JsonConvert.DeserializeObject<PipedInputModel>(json);
            return retval;
        }
    }
}