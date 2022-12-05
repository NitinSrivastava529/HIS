using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.PatientDesk
{
    public class PatientDeskAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "PatientDesk";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "PatientDesk_default",
                "PatientDesk/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}