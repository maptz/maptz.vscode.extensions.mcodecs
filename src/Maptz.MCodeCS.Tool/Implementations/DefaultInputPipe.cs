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
            //https://daveaglick.com/posts/capturing-standard-input-in-csharp
            
            string stdin = null;
            if (Console.IsInputRedirected)
            {
                using (StreamReader reader = new StreamReader(Console.OpenStandardInput(), Console.InputEncoding))
                {
                    stdin = reader.ReadToEnd();
                }
            }
            var retval = JsonConvert.DeserializeObject<PipedInputModel>(stdin);
            return retval;
            //StringBuilder stringBuilder = new StringBuilder();
            //var s = Console.ReadLine();
            //do
            //{
            //    s = Console.ReadLine();
            //    Console.WriteLine("Piped input Read line: " + s);
            //    if (s != null) stringBuilder.AppendLine(s);
            //} while (s != null);

            //Console.WriteLine("Piped input: " + stringBuilder.ToString());
            //var json = stringBuilder.ToString();
            //var retval = JsonConvert.DeserializeObject<PipedInputModel>(json);
            //return retval;
        }
    }
}