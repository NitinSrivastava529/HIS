using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Customer.Controllers
{
    public class PatientController : Controller
    {
        // GET: Customer/Patient
        public ActionResult GetAmbulance()
        {
            return View();
        }
    }
}