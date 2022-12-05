using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.DoctorApp.Controllers
{
    public class AppController : Controller
    {
        // GET: DoctorApp/App
        public ActionResult OPDScheduleReport()
        {
            return View();
        }
    }
}