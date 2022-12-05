using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Masters.Controllers
{
    public class ToolsController : Controller
    {
        // GET: Masters/Tools

        public ActionResult StateDistrict()
        {
            return View();
        }        
        public ActionResult CreateItem()
        {
            return View();
        }
        public ActionResult CategoryMaster()
        {
            return View();
        }
        public ActionResult FollowupMarking()
        {
            return View();
        }
        public ActionResult PanelMaster()
        {
            return View();
        }
       
    }
}