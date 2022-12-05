using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.LinenLaundry.Controllers
{
	public class LinenMovementController : Controller
	{
		// GET: LinenLaundry/LinenMovement
		public ActionResult Index()
		{
			return View();
		}
		public ActionResult LLStock()
		{
			return View();
		}
		public ActionResult LLTransfer()
		{
			return View();
		}
		public ActionResult LLReturn()
		{
			return View();
		}
		public ActionResult LLReceiving()
		{
			return View();
		}
		public ActionResult LLaundryTransfer()
		{
			return View();
		}
		public ActionResult LLinenReceiving()
		{
			return View();
		}
		public ActionResult LLWashingToLaundry()
		{
			return View();
		}
		public ActionResult LWashingTransfer()
		{
			return View();
		}
		 public ActionResult LDamageConfirmation()
		{
			return View();
		}
		public ActionResult LIndentEntry()
		{
			return View();
		}
		public ActionResult ItemDispatch()
		{
			return View();
		}
        public ActionResult LLDressIssueToStaff()
        {
            return View();
        }
        public ActionResult LLDistribution()
		{
			//var encodedString = "MTIzNA==";
			//byte[] data = Convert.FromBase64String(encodedString);
			//string decodedString = Encoding.UTF8.GetString(data);
			int value = 1234;
			string s = Encoding.ASCII.GetString(
						   BitConverter.GetBytes(value).Reverse().ToArray());
			return View();
		}
	}
}