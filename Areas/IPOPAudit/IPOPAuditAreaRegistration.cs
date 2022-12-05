using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.IPOPAudit
{
    public class IPOPAuditAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "IPOPAudit";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
				"IPOPAudit_default",
				"IPOPAudit/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}