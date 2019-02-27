using System;
using Xunit;
using Maptz.Testing;

using System.IO;
using System.Linq;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
namespace Maptz.MCodeCS.Engine.Tests
{

    public interface IResource
    {
        string Code { get; }
        int? CursorPosition { get; }
    }
}