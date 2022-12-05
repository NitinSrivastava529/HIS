using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.IPD.Controllers
{
    public class IndentController : Controller
    {
        public ActionResult IPD_MedicineIndent()
        {
            return View();
        }
        public ActionResult IndentReport()
        {
            return View();
        }
        public ActionResult PharSalesRegister()
        {
            return View();
        }
        public ActionResult IndentBillPosting()
        {
            return View();
        }
    }
}