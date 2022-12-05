using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.OT.Controllers
{
    public class OTController : Controller
    {
        // GET: OT/OT
        public ActionResult OTSchedule()
        {
            return View();
        }
        public ActionResult ConfirmconferenceRoom()
        {
            return View();
        }
    }
}