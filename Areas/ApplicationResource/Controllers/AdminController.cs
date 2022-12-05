using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.ApplicationResource.Controllers
{
    public class AdminController : Controller
    {	  
		
		// GET: ApplicationResource/Application
		public ActionResult Login()
        {			
			return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult Employee()
        {
            return View();
        }
        public ActionResult EmployeeComponent()
        {
            return View();
        }
        public ActionResult Role()
        {
            return View();
        }
        public ActionResult SubMenu()
        {
            return View();
        }
        public ActionResult MenuAllotment()
        {
            return View();
        }
    }
}