using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Corporate.Controllers
{
    public class PanelController : Controller
    {
        // GET: Corporate/Corporate
        public ActionResult PanelItemExclude()
        {
            return View();
        }
        public ActionResult PanelToPanel()
        {
            return View();
        }
    }
}