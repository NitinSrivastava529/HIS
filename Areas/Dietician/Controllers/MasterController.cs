using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Dietician.Controllers
{
    public class MasterController : Controller
    {
        public ActionResult DietMaster()
        {
            return View();
        }
        public ActionResult ItemMaster()
        {
            return View();
        }
        public ActionResult DietInfo()
        {
            return View();
        }
    }
}