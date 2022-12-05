using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Utility.Controllers
{
    public class MemberController : Controller
    {
        // GET: Utility/Member
        public ActionResult NewMember()
        {
            return View();
        }
		public ActionResult AvailCoupon()
		{
			return View();
		}
        public ActionResult SalarySlip()
        {
            return View();
        }
    }
}