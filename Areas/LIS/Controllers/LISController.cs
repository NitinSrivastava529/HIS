using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.LIS.Controllers
{
    public class LISController : Controller
    {
        // GET: LIS/LIS
        // GET: Temporary/Temporary
        public ActionResult LIS_PatientRoomAllotment()
        {
            return View();
        }
        public ActionResult LIS_PatientCorrection()
        {
            return View();
        }
    }
}