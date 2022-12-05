using System.Web.Optimization;

namespace MediSoftTech_HIS.App_Start
{
	public class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			//Js Bundle 
			bundles.Add(new ScriptBundle("~/JsModule/bundle").Include(
                                         "~/JsModule/global.js",
                                         "~/JsModule/config.js",
                                         "~/JsModule/FileSaver.min.js",
                                         "~/JsModule/Authentication.js"

           ));

		}
	}
}