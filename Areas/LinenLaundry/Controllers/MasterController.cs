using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.LinenLaundry.Controllers
{
    public class MasterController : Controller
    {
        // GET: LinenLaundry/Master
        public ActionResult LLRequirement()
        {
            return View();
        }
        
    }
}