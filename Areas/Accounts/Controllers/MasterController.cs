using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Accounts.Controllers
{
	public class MasterController : Controller
	{
		// GET: Accounts/Master
		public ActionResult CreateLedger()
		{
			return View();
		}
		public ActionResult CreateGroup()
		{
			return View();
		}
	}
}