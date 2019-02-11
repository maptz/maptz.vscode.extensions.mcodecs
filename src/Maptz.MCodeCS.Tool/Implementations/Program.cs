//using Maptz.MCodeCS.Tool.Engine
using Maptz.CliTools;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Maptz.MCodeCS.Engine;
using Maptz.Coding.Analysis.CSharp.Sorting;
using Maptz.Coding.Analysis.CSharp.TestCreator;
using Maptz.Coding.Analysis.CSharp.Misc;

namespace Maptz.MCodeCS.Tool
{

    class Program : CliProgramBase<AppSettings>
    {
        public static void Main(string[] args)
        {
            new Program(args);
        }

        public Program(string[] args) : base(args)
        {

        }

        protected override void AddServices(IServiceCollection services)
        {
            base.AddServices(services);
            services.AddTransient<ICliProgramRunner, CLIProgramRunner>();
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
            //services.AddLogging(loggingBuilder => loggingBuilder.AddConfiguration(Configuration.GetSection("Logging")).AddConsole().AddDebug());
        }
    }

}


