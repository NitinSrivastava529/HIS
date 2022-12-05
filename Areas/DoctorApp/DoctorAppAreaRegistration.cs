using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.DoctorApp
{
    public class DoctorAppAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "DoctorApp";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "DoctorApp_default",
                "DoctorApp/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}