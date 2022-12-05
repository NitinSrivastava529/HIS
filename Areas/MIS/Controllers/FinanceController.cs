using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.MIS.Controllers
{
    public class FinanceController : Controller
    {     
        public ActionResult UserwiseCollectionReport()
        {
            return View();
        }
        public ActionResult DailyCollectionReport()
        {
            return View();
        }
    }
}