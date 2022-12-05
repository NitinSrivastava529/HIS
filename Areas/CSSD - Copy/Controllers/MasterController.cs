using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.CSSD.Controllers
{
    public class MasterController : Controller
    {
        // GET: CSSD/Master
        public ActionResult ItemMaster()
        {
            return View();
        }
		public ActionResult SetMaster()
		{
			return View();
		}
		public ActionResult SetItemLink()
		{
			return View();
		}
		public ActionResult RenewSet()
		{
			return View();
		}
	}
}