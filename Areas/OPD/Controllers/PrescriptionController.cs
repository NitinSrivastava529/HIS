using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.OPD.Controllers
{
    public class PrescriptionController : Controller
    {
        //Common Prescription
        public ActionResult PrescriptionOPTH()
        {
            return View();
        }
        //Common Prescription
        public ActionResult OPD_Dashboard()
        {
            return View();
        }
        public ActionResult AdviceBody(string page)
        {
            return PartialView(page);
        }
    }
}