using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Lab.Controllers
{
    public class MasterController : Controller
    {
        // GET: Lab/Master
        public ActionResult LabInvestigation()
        {
            return View();
        }
        public ActionResult PackageMaster()
        {
            return View();
        }
        public ActionResult LabObservation()
        {
            return View();
        }
        public ActionResult LabTemplate()
        {
            return View();
        }
        public ActionResult DoctorSignature()
        {
            return View();
        }
        public ActionResult LabTransportTime()
        {
            return View();
        }
        public ActionResult TestProcessingTime()
        {
            return View();
        }
        public ActionResult LabOutSource()
        {
            return View();
        }
        public ActionResult OutSourceTestLinking()
        {
            return View();
        }
        public ActionResult OutSourceTestLinkingTo()
        {
            return View();
        }
        public ActionResult Test()
        {
            return View();
        }
        
    }
}