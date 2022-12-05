using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.UploadImage
{
    public class UploadImageAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "UploadImage";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "UploadImage_default",
                "UploadImage/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}