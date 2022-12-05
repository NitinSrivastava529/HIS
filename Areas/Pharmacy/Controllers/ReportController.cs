using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Pharmacy.Controllers
{
    public class ReportController : Controller
    {       
        public ActionResult MedicineBillVerification()
        {
            return View();
        }
        public ActionResult CreditSaleSummary()
        {
            return View();
        }
    }
}