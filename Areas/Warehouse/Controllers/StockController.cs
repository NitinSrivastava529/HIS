using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class StockController : Controller
    {
		// GET: Warehouse/Stock
		public ActionResult StockReport()
		{
			return View();
		}
        public ActionResult PartialItemTransaction()
        {
            return PartialView("_ItemTransactionReport");
        }
    }
}