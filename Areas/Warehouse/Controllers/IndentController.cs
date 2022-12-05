using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
    public class IndentController : Controller
    {
        // GET: Warehouse/Indent
        public ActionResult IndentEntry()
        {
            return View();
        }

        public ActionResult IndentVerification()
        {
            return View();
        }

        public ActionResult IndentProcessing()
        {
            return View();
        }

        public ActionResult PrintDispatchedItem()
        {
            return View();
        }

        public ActionResult PrintDispatchDetails()
        {
            return View();
        }
        public ActionResult IndentReport()
        {
            return View();
        }
        public ActionResult ReceiveProduct()
        {
            return View();
        }
       
        public ActionResult ReceiveStockByPharmacy()
        {
            return View();
        }
        public ActionResult ReceiveByDiagnostic()
        {
            return View();
        }
    }
}