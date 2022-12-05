using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.EDP.Controllers
{
    public class EDPController : Controller
    {
        // GET: EDP/EDP
        public ActionResult PanelRateItem()
        {
            return View();
        }
        public ActionResult PanelRateLink()
        {
            return View();
        }
        public ActionResult ConsultationRateList()
        {
            return View();
        }
        public ActionResult RoomCharges()
        {
            return View();
        }
        public ActionResult RateForceToSelfPanel()
        {
            return View();
        }
    }
}