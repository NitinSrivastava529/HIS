using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class ReportController : Controller
    {
        // GET: Warehouse/Report
        public ActionResult StockReport()
        {
            return View();
        }
		public ActionResult PurchaseReport()
		{
			return View();
		}
        public ActionResult ExpiredProduct()
        {
            return View();
        }
    }
}