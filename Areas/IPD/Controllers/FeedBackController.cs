using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.IPD.Controllers
{
    public class FeedBackController : Controller
    {
        // GET: IPD/FeedBack
        public ActionResult IPDDischargeFeedback()
        {
            return View();
        }
        public ActionResult IPDDailyFeedback()
        {
            return View();
        }
        public ActionResult IPDSafetyRoundFeedback()
        {
            return View();
        }
        public ActionResult OPDFeedback()
        {
            return View();
        }
        public ActionResult CSRReport()
        {
            return View();
        }
        public ActionResult FeedBackReport()
        {
            return View();
        }
        public ActionResult IPDHandOverTakeOver()
        {
            return View();
        }
        public ActionResult SaftyRoundReport()
        {
            return View();
        }
    }
}