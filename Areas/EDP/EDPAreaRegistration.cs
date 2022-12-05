using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.EDP
{
    public class EDPAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "EDP";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "EDP_default",
                "EDP/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}