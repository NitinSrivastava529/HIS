using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Masters.Controllers
{
    public class DoctorController : Controller
    {
        // GET: Masters/Doctors
        public ActionResult Registration()
        {
            return View();
        }
        public ActionResult LeaveApproval()
        {
            return View();
        }
    }
}