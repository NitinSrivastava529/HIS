using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class TransferController : Controller
    {
       
		public ActionResult DepartmentTransfer()
		{
			return View();
		}
        public ActionResult InTransitTransfer()
        {
            return View();
        }
    }
}