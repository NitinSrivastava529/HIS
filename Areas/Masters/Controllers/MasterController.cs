using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Masters.Controllers
{
    public class MasterController : Controller
    {
        public ActionResult SetDepartmentSequence()
        {
            return View();
        }
        public ActionResult SetDoctorSequence()
        {
            return View();
        }
        public ActionResult DepartmentMaster()
        {
            return View();
        }
        public ActionResult AmbulanceMaster()
        {
            return View();
        }
        public ActionResult VideoLibraryMaster()
        {
            return View();
        }
    }
}