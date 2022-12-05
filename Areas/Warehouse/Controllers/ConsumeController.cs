using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class ConsumeController : Controller
    {
        // GET: Warehouse/Issue
        public ActionResult ConsumeStock()
        {
            return View();
        }
        public ActionResult ConsumeByPatient()
        {
            return View();
        }
        public ActionResult ProductReceiveFromPatient()
        {
            return View();
        }
    }
}