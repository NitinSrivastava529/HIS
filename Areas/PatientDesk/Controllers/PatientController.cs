using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.PatientDesk.Controllers
{
    public class PatientController : Controller
    {
		// GET: PatientDesk/Patient/EmergencyDesk
		public ActionResult EmergencyDesk()
        {
            return View();
        }
		public ActionResult TA()
		{
			return View();
		}
        public ActionResult IPD_OverDuePatientList()
        {
            return View();
        }
    }
}