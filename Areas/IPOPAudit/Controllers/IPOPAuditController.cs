using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.IPOPAudit.Controllers
{
    public class IPOPAuditController : Controller
    {
        // GET: Audit/Audit
        public ActionResult IPDMedicinePrescribed()
        {
            return View();
        }
		public ActionResult IPDPrescribedTest()
		{
			return View();
		}
        public ActionResult MedicineBillReport()
        {
            return View();
        }
    }
}