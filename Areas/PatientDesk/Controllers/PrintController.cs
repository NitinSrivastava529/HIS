using HIS.Repository;
using HISWebApi.Models;
using MediSoftTech_HIS.App_Start;
using System.Data;
using System.Text;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.PatientDesk.Controllers
{
	public class PrintController : Controller
	{
		// GET: PatientDesk/Print
		public FileResult BookingSlip(string RequestId)
		{
			PdfGenerator pdfConverter = new PdfGenerator();
			ipPatientDesk obj = new ipPatientDesk();
			obj.RequestId = RequestId;
			obj.from = "1900/01/01";
			obj.to = "1900/01/01";
			obj.Logic = "GetBookingSlip";
			dataSet dsResult = APIProxy.CallWebApiMethod("Patient/AmbulanceAndEmergencyQueries", obj);
			DataSet ds = dsResult.ResultSet;
			string _result = string.Empty;
			StringBuilder b = new StringBuilder();
			StringBuilder h = new StringBuilder();
			StringBuilder f = new StringBuilder();

			string invoiceNo = string.Empty;
			string InvoiceType = string.Empty;

			b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
			string chandanLogo = HttpContext.Server.MapPath(@"~/Content/logo/logo.png");
			//string QRCode = HttpContext.Server.MapPath(@"/Content/img/QRCode.png");
			b.Append("<div style='text-align:left;width:35%;float:left'>");
			b.Append("<img src=" + chandanLogo + " style='width:170px;margin-top:5px;' />");
			b.Append("</div>");
			b.Append("<div style='text-align:left;width:auto;float:left;width:65%;'>");
			b.Append("<h2 style='font-weight:bold;margin:0'>Chandan Hospital Ltd.</h2>");
			b.Append("<span style='text-align:left;'>Vijayant Khand, Faizabad Road, Near High Court, Lucknow</span><br/>");
			b.Append("<h4 style='font-weight:bold;margin:0'>Ambulance Booking Slip</h4>");
			b.Append("</div>");
			b.Append("</div>");
			b.Append("<hr/>");
			if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
			{
				foreach (DataRow dr in ds.Tables[0].Rows)
				{

					b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#fff;'>");
					//Patient Information
					b.Append("<tr style='background:#ddd'>");
					b.Append("<td colspan='4'><b>Patient Information</b></td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Request Id</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td><b>" + dr["RequestId"].ToString() + "</b></td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Patient Name</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["PatientName"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Mobile No</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["PatientMobile"].ToString() + "</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Pick Date Time</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["PickupDate"].ToString() + "</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Address</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["address"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Note</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["note"].ToString() + "</td>");
					b.Append("</tr>");

					//Ambulance Information
					b.Append("<tr style='background:#ddd'>");
					b.Append("<td colspan='4'><b>Ambulance Information</b></td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Ambulance</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td><b>" + dr["AmbulanceName"].ToString() + "</b></td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Driver Name</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["DriverName"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Mobile No</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["DriverMobileNo"].ToString() + "</td>");
					b.Append("</tr>");
					b.Append("</table>");
				}
				int count = 0;
				b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#fff;'>");
				//Doctor/Attendant
				b.Append("<tr style='background:#ddd'>");
				b.Append("<td colspan='4'><b>Doctor/Attendant</b></td>");
				b.Append("</tr>");
				b.Append("</table>");
				foreach (DataRow dr in ds.Tables[1].Rows)
				{
					count++;
					b.Append("<table style='width:40%;font-size:14px;text-align:left;background:#fff;'>");
					b.Append("<tr>");
					b.Append("<td><b>" + count + "</b></td>");
					b.Append("<td><b>" + dr["emp_name"].ToString() + " - " + dr["EmpType"].ToString() + "</b></td>");
					b.Append("</tr>");
					b.Append("</table>");

				}
			}
			f.Append("<div style='width:30%;float:left;margin-top:85px;text-align:center'>");
			f.Append("<hr/>Patient Signature");
			f.Append("</div>");
			f.Append("<div style='width:30%;float:right;margin-top:85px;text-align:center'>");
			f.Append("<hr/>Driver Signature");
			f.Append("</div>");

			pdfConverter.Header_Enabled = false;
			pdfConverter.Footer_Enabled = true;
			pdfConverter.Footer_Hight = 135;
			pdfConverter.Header_Hight = 70;
			pdfConverter.PageMarginLeft = 10;
			pdfConverter.PageMarginRight = 10;
			pdfConverter.PageMarginBottom = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageName = "A4";
			pdfConverter.PageOrientation = "Portrait";
			return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), f.ToString(), "AmbulanceBookingSlip.pdf");
		}
	}
}