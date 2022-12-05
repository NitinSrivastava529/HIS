using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.MIS.Controllers
{
    public class MISReportController : Controller
    {
        // GET: MIS/MISReport
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult IPOPAnalysis()
        {
            return View();
        }
        public ActionResult CaseMix()
        {
            return View();
        }
    
    }
}