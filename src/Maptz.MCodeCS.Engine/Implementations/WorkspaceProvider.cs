using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System.Linq;
using System.Threading.Tasks;
namespace Maptz.MCodeCS.Engine
{

    public class WorkspaceProvider : IWorkspaceProvider
    {
        public async Task<(Workspace, Document)> CreateWorkspaceAsync(string content, string fileName = null, string projectName = null)
        {
            var workspace = new AdhocWorkspace();

            Document document;
            string actualProjectName = projectName == null ? "TestProject" : projectName;
            var actualFileName = fileName == null ? "Class1.cs" : fileName;

            var projectId = ProjectId.CreateNewId();
            var versionStamp = VersionStamp.Create();
            var projectInfo = ProjectInfo.Create(projectId, versionStamp, actualProjectName, actualProjectName, LanguageNames.CSharp);
            var newProject = workspace.AddProject(projectInfo);

            var sourceText = SourceText.From(content);
            var newDocument = workspace.AddDocument(newProject.Id, actualFileName, sourceText);

            var testProject = workspace.CurrentSolution.Projects.FirstOrDefault(p => p.Name == actualProjectName);
            document = testProject.Documents.First();
            var syntaxRoot = await document.GetSyntaxRootAsync();

            return (workspace, document);
        }
    }
}