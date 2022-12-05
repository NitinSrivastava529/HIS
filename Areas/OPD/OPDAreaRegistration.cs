using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.OPD
{
    public class OPDAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "OPD";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "OPD_default",
                "OPD/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}