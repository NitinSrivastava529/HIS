using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Commission.Controllers
{
    public class ShareController : Controller
    {
        // GET: Commission/Share
        public ActionResult ShareDeduction()
        {
            return View();
        }
        public ActionResult RefShareReport()
        {
            return View();
        }
        public ActionResult RefSharePayment()
        {
            return View();
        }
    }
}