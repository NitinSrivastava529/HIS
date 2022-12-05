using MediSoftTech_HIS.App_Start;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Accounts.Controllers
{
    public class LedgerController : Controller
    {
        // GET: Inventory/Account
        public ActionResult Payment()
        {
            return View();
        }
        public ActionResult Journal()
        {
            return View();
        }
        public ActionResult Contra()
        {
            return View();
        }
        public ActionResult Receipt()
        {
            return View();
        }
        public ActionResult LedgerBook()
        {
            return View();
        }
       
    }
}