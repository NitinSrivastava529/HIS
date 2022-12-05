using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.MenuMaster
{
    public class MenuMasterAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MenuMaster";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MenuMaster_default",
                "MenuMaster/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}