using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.CSSD
{
    public class CSSDAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "CSSD";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "CSSD_default",
                "CSSD/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}