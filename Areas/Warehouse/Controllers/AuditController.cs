using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class AuditController : Controller
    {
        // GET: Warehouse/Audit
        public ActionResult CreateAudit()
        {
            return View();
        }
		public ActionResult DoAudit()
		{
			return View();
		}
		public ActionResult AuditReport()
		{
			return View();
		}

	}
}