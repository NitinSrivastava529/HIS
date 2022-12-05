using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.IPD.Controllers
{
    public class IPDController : Controller
    {
        public ActionResult IPD_OverDuePatientList()
        {
            return View();
        }
        public ActionResult IPDRegistration()
        {
            return View();
        }
        public ActionResult IPDGateway()
        {
            return View();
        }
        public ActionResult IPDBillingGateway()
        {
            return View();
        }
        public ActionResult IPDDoctorGateway()
        {
            return View();
        }
        public ActionResult IPDPatientService()
        {
            return View();
        }
        public ActionResult IPDBody(string page)
        {
            return PartialView(page);
        }
    }
}