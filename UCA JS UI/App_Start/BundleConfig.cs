using System.Web.Optimization;

namespace UCA_JS_UI
{
    /// <summary>
    /// The bundle config.
    /// </summary>
    public static class BundleConfig
    {
        /// <summary>
        /// The register bundles.
        /// </summary>
        /// <param name="bundles">
        /// The bundles.
        /// </param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundle/jquery").Include("~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundle/bootstrap").Include("~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundle/uca").Include("~/Scripts/uca.core.js", "~/Scripts/uca.all.js"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/Content/bootstrap.css", "~/Content/bootstrap-theme.css"));

            bundles.Add(new StyleBundle("~/Content/uca").Include("~/Content/uca.all.css"));

            bundles.Add(new StyleBundle("~/Content/ucaold").Include("~/Content/uca.all.old.css"));
        }
    }
}