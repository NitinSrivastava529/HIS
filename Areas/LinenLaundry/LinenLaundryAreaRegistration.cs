using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.LinenLaundry
{
    public class LinenLaundryAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "LinenLaundry";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "LinenLaundry_default",
                "LinenLaundry/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}