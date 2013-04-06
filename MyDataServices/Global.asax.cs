using MyDataServices.Filters;
using MyDataServices.Formatters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace MyDataServices
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            RegisterApiRoutes(GlobalConfiguration.Configuration);
            RegisterApis(GlobalConfiguration.Configuration);
        }

        private void RegisterApiRoutes(HttpConfiguration configuration)
        {
            RouteTable.Routes.MapHttpRoute(
                 name: "ProductsVerbs",
                 routeTemplate: "Products/{sku}",
                 defaults: new
                 {
                     title = RouteParameter.Optional,
                     controller = "ProductsController"
                 }
             );
        }

        public static void RegisterApis(HttpConfiguration config)
        {
            // Display errors in response locally
            GlobalConfiguration
                   .Configuration
                   .IncludeErrorDetailPolicy =
                    IncludeErrorDetailPolicy.Always;

            // Add a custom JsonP converter which effectively replaces the default JSON formatter     
            // you can configue the custom formatter in it's creation code
            config.Formatters.Insert(0, new JsonpFormatter());

            // Add the exception filter
            config.Filters.Add(new UnhandledExceptionFilter());

        }
    }
}