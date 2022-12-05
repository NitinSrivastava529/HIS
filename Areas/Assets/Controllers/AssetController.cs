using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Assets.Controllers
{
    public class AssetController : Controller
    {
        // GET: Assets/Asset
        public ActionResult HospAssetMovement()
        {
            return View();
        }
        public ActionResult AddDepartment()
        {
            return View();
        }
        public ActionResult MovementExcel()
        {
            return View();
        }
        public ActionResult NewComplaints()
        {
            return View();
        }
        public ActionResult CloseComplaints()
        {
            return View();
        }
        public ActionResult ComplaintApproval()
        {
            return View();
        }
        public ActionResult ComplaintTracing()
        {
            return View();
        }
    }
}