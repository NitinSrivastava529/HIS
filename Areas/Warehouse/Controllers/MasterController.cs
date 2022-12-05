using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class MasterController : Controller
    {
        // GET: Warehouse/Master
        public ActionResult VendorMaster()
        {
            return View();            
        }
        public ActionResult ItemMaster()
        {
            return View();
        }
        public ActionResult ManufacturerMaster()
        {
            return View();
        }        
        public ActionResult CategoryMaster()
        {
            return View();
        }
        public ActionResult PackageType()
        {
            return View();
        }
        public ActionResult POReport()
        {
            return View();
        }        
		public ActionResult ItemManufactureLink()
		{
			return View();
		}
		public ActionResult ItemPackLink()
		{
			return View();
		}

		public ActionResult AddCart()
		{
			return View();
		}
		public ActionResult AssignCart()
		{
			return View();
		}
        public ActionResult VendorApproval()
        {
            return View();
        }
    }
}