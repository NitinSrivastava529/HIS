using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.MenuMaster
{
	public class MasterController : Controller
	{
		// GET: MenuMaster/Master
		public ActionResult GroupMaster()
		{
			return View();
		}
		public ActionResult GroupItems()
		{
			return View();
		}
		public ActionResult MenuAllotmentMaster()
		{
			return View();
		}
		public ActionResult GroupMenuAllotment()
		{
			return View();
		}
	}
}