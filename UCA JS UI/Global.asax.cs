using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace UCA_JS_UI
{
    /// <summary>
    /// The mvc application.
    /// </summary>
    public class MvcApplication : HttpApplication
    {
        /// <summary>
        /// The application_ start.
        /// </summary>
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
