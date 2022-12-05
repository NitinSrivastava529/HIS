using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.OPD.Controllers
{
	public class AppointmentController : Controller
	{ 
		// GET: OPD/Appointment

		public ActionResult PatientPartialView()
		{
			return View();
		}		
		public ActionResult bookAppointment()
		{
			return View();
		}
		public ActionResult OPDRegister()
		{
			return View();
		}
        public ActionResult VitalEntry()
        {
            return View();
        }
        public ActionResult RefundAppointment()
		{
			return View();
		}		
		public ActionResult OPD_ViewConsultation()
		{
			return View();
		}
        public ActionResult VaccinationSchedule()
        {
            return View();
        }
        public ActionResult VaccinationCall()
        {
            return View();
        }
        public ActionResult DoctorDisplay()
        {
            return View();
        }
    }
}