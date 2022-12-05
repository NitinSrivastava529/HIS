using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Accounts.Controllers
{
    public class TallyController : Controller
    {
        // GET: Accounts/Tally
        public ActionResult TallyTransfer()
        {
            return View();
        }
    }
}