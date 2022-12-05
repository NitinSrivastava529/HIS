using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Referral.Controllers
{
    public class ShareController : Controller
    {
        // GET: Masters/Master       
        public ActionResult RefSharePayment()
        {
            return View();
        }
        public ActionResult RefShareReport()
        {
            return View();
        }
        public ActionResult ShareDeduction()
        {
            return View();
        }
       
    }
}