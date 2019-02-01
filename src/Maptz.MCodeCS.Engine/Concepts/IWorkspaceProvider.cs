using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System.Linq;
using System.Threading.Tasks;
namespace Maptz.MCodeCS.Engine
{

    public interface IWorkspaceProvider
    {
        Task<(Workspace workspace, Document document)> CreateWorkspaceAsync(string content, string fileName = null, string projectName = null);
    }
}