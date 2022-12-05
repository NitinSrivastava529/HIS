using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Temporary.Controllers
{
    public class TemporaryController : Controller
    {
        // GET: Temporary/Temporary
        public ActionResult LIS_PatientRoomAllotment()
        {
            return View();
        }
		public ActionResult CreateReferralCoupon()
		{
			return View();
		}
		public ActionResult AvailCoupon()
		{
			return View();
		}
        public ActionResult CovidCertificate()
        {
            return View();
        }
        public ActionResult CovidCertificateReport()
        {
            return View();
        }
    }
}