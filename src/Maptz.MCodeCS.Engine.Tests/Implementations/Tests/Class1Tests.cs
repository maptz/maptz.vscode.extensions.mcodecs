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
using Newtonsoft.Json;

namespace Maptz.MCodeCS.Engine.Tests
{

    public class ExtensionEngineTests
    {
        private IServiceProvider GetServiceProvider()
        {
            var services = new ServiceCollection();
            services.AddTransient<IExtensionEngine, ExtensionEngine>();
            services.AddTransient<IWorkspaceProvider, WorkspaceProvider>();

            services.AddTransient<ICSharpSorterService, CSharpSorterService>();
            services.AddTransient<ISortGroupingOrderingService, DefaultSortGroupingService>();
            services.AddTransient<ISortGroupingService, DefaultSortGroupingService>();
            services.AddTransient<IMemberDeclarationOrderingService, DefaultSortGroupingService>();


            services.AddTransient<ICreateTestsService, CreateTestsService>();
            services.AddTransient<IAsyncMethodConverterService, AsyncMethodConverterService>();
            services.AddTransient<IProtectedVirtualMethodConverterService, ProtectedVirtualMethodConverterService>();
            services.AddTransient<IExpandPropertyService, ExpandPropertyService>();

            services.AddTransient<IRemoveUnusedUsingsService, RemoveUnusedUsingsService>();
            services.AddTransient<IExpressPropertyService, ExpressPropertyService>();
            services.AddTransient<IExpressStatementService, ExpressStatementService>();
            services.AddTransient<IExtractClassService, ExtractClassService>();

            services.AddTransient<ICSharpFormatterService>(sp =>
            {
                var mockDependency = new Mock<ICSharpFormatterService>();
                mockDependency.Setup(x => x.Format(It.IsAny<string>()))
                          .Returns((string s) => { return s; });
                return mockDependency.Object;
            });
            services.AddTransient<ICodeChangeImplementorService, CodeChangeImplementorService>();
            services.AddSingleton<IOutputService, TestOutputService>();

            return services.BuildServiceProvider();
        }

        /* #region Public Methods */
        [Fact]
        public void Constructor_Works()
        {
            /* #region Arrange */
            var sp = this.GetServiceProvider();
            /* #endregion */

            /* #region Act */
            var ee = sp.GetRequiredService<IExtensionEngine>();
            /* #endregion */

            /* #region Assert */
            Assert.NotNull(ee);
            /* #endregion */
        }

        private async Task TestMethod(string resourceBaseName, Func<IExtensionEngine, IResource, Task> action)
        {

            var resourceName = $"{resourceBaseName}.curr";
            var expectedResourceName = $"{resourceBaseName}.expected";
            var expandedResource = ResourceHelpers.GetExpandedResource(resourceName);

            var sp = this.GetServiceProvider();
            var ee = sp.GetRequiredService<IExtensionEngine>();
            await action(ee, expandedResource);

            var outputService = sp.GetRequiredService<IOutputService>() as TestOutputService;
            var changes = JsonConvert.DeserializeObject<CodeChange[]>(outputService.WrittenText);
            var actualText = TextChangeHelpers.ApplyChanges(expandedResource.Code, changes);
            var expectedText = ResourceHelpers.GetStringResource(expectedResourceName);
            Assert.Equal(expectedText, actualText);
        }

        [Fact]
        public async Task ConvertToAsyncAsync_Works()
        {
            await TestMethod("AsyncMethodSample1", async (ee, expandedResource) =>
            {
                await ee.ConvertToAsyncAsync(expandedResource.Code, "SomeFileName.cs", expandedResource.CursorPosition.Value);
            });

        }
        /* #endregion Public Methods */
    }
}