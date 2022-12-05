using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.OPD.Controllers
{
    public class ServiceController : Controller
    {
		public ActionResult ServiceBooking()
		{
			return View();
		}
		public ActionResult ServiceRegister()
		{
			return View();
		}
		public ActionResult RefundServices()
		{
			return View();
		}
	}
}