using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.LIS
{
    public class LISAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "LIS";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "LIS_default",
                "LIS/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}