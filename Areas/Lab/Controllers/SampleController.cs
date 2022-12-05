using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Lab.Controllers
{
    public class SampleController : Controller
    {
        // GET: Lab/Sample
        public ActionResult SampleCollection()
        {
            return View();
        }
        public ActionResult SampleDistribution()
        {
            return View();
        }
        public ActionResult SampleDispatch()
        {
            return View();
        }
        public ActionResult LabReceive()
        {
            return View();
        }
        public ActionResult SampleLogisticReceive()
        {
            return View();
        }

    }
}