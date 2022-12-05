using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Referral
{
    public class ReferralAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Referral";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Referral_default",
                "Referral/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}