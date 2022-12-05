using HIS.Repository;
using HISWebApi.Models;
using MediSoftTech_HIS.App_Start;
using MediSoftTech_HIS.Repository;
using System;
using System.Data;
using System.Text;
using System.Web.Mvc;
using static HISWebApi.Models.IPDBO;

namespace MediSoftTech_HIS.Areas.OPD.Controllers
{
    public class PrintController : Controller
    {
        // GET: OPD/Print
        public FileResult AppointmentReceipt(string TnxId, string ActiveUser, string Logic = "PrintAppointmentReceipt")
        {
            BarcodeGenerator generateBarcode = new BarcodeGenerator();
            string HospitalName = "";
            string HospitalPhone = "";
            string HospitalEmail = "";
            string HospitalAddress = "";

            PdfGenerator pdfConverter = new PdfGenerator();
            ipIPDAudit obj = new ipIPDAudit();
            obj.prm_1 = TnxId;
            obj.Logic = Logic;
            HISWebApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("Appointment/Opd_AppointmentQueries", obj);

            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            decimal GrossAmount = 0;
            decimal discount = 0;
            decimal NetAmount = 0;
            decimal Received = 0;
            decimal Balance = 0;
            string CancelAgainstNo = "";
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    HospitalName = dr["Hospital_Name"].ToString();
                    HospitalPhone = dr["ContactInfo"].ToString();
                    HospitalEmail = "care@chandanhospital.in";
                    HospitalAddress = dr["Full_Address"].ToString();
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    GrossAmount = Convert.ToDecimal(dr["GrossAmount"]);
                    discount = Convert.ToDecimal(dr["discount"]);
                    NetAmount = Convert.ToDecimal(dr["NetAmount"]);
                    Received = Convert.ToDecimal(dr["Received"]);
                    Balance = Convert.ToDecimal(dr["Balance"]);
                    b.Append("<h1 style='text-align:center;text-decoration: underline;margin-bottom:-8px'>" + HospitalName + "</h1>");
                    b.Append("<h2 style='text-align:center;font-weight:bold;font-size:19px;'>" + HospitalAddress + "<br/>Phone No : " + HospitalPhone + ", Email : " + HospitalEmail + "</h3>");
                    //b.Append("<h2 style='text-align:center;font-size:21px;'></h2>");
                    b.Append("<h1 style='text-align:center;font-weight:bold;text-decoration: underline;'>OPD Receipt</h1>");                  
                    b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
                    b.Append("<table style='width:100%;font-size:17px;text-align:left;border:0px solid #dcdcdc;margin-bottom:-15px'>");
                    b.Append("<tr>");
                    b.Append("<td><b>Token No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td><b style='font-size:20px;'>" + dr["token_no"].ToString() + "</b></td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Appointment No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td><b>" + dr["app_no"].ToString() + "</b></td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>UHID No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["UHID"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Date & Time</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["AppDate"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Name</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["patient_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Bill No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["bill_no"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Age/Gender</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Age"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Receipt No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["ReceiptNo"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Contact No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["mobile_no"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Visit Type</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["visitType"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Relative Name</td>");
                    b.Append("<td><b>:</b></td>");
                    //b.Append("<td>" + dr["relative_name"].ToString() + "</td>");
                    b.Append("<td>-</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Consultant</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td style='text-transform:uppercase'>" + dr["DoctorName"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Referred By</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["ref_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");

                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Panel</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td colspan='5'>" + dr["PanelName"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("</table>");
                    CancelAgainstNo = dr["visitType"].ToString();
                }
            }
            b.Append("<table style='width:100%;font-size:18px;text-align:left;border:0px solid #dcdcdc;margin-top:10px;'>");
            b.Append("<tr>");
            b.Append("<th colspan='4'><hr style='margin-bottom:-6px;border:1px solid #000'></th>");
            b.Append("</tr>");
            b.Append("<tr>");
            b.Append("<th style='width:70%'>Particulars</th>");
            b.Append("<th style='width:10%;text-align:right'>Units</th>");
            b.Append("<th style='width:10%;text-align:right'>Rate(₹)</th>");
            b.Append("<th style='width:10%;text-align:right'>Amount(₹)</th>");
            b.Append("</tr>");
            b.Append("<tr>");
            b.Append("<th colspan='4'><hr style='margin-top:-4px;border:1px solid #000'></th>");
            b.Append("</tr>");
            //Body			
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td style='width:70%;font-size:15px !important'>" + dr["CatName"].ToString() + "<br/>" + dr["ItemName"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["Qty"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["Rate"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["NetAmount"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td colspan='4'><hr style='margin-bottom:1px;'></td>");
                    b.Append("</tr>");
                }
            }
            //b.Append("<tr>");
            //b.Append("<td></td><td colspan='3'><hr style='margin-top:-4px;margin-bottom:-6px;'></td>");
            //b.Append("</tr>");
            b.Append("</table>");

            b.Append("<div style='width:100%;float:left'>");
            b.Append("<div style='width:60%;float:left'>");

            if (ds.Tables.Count > 0 && ds.Tables[3].Rows.Count > 0)
            {
                b.Append("<table style='width:100%;font-size:14px;text-align:left;' border='1' cellspacing='0'>");
                b.Append("<tr>");
                b.Append("<th style='padding-left:5px'>Type</th>");
                b.Append("<th style='padding-left:5px'>Pay Mode</th>");
                b.Append("<th style='padding-left:5px'>Receipt Date</th>");
                b.Append("<th style='text-align:right'>Amount</th>");
                b.Append("</tr>");
                foreach (DataRow dr in ds.Tables[3].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:5px'>" + dr["payType"].ToString() + "</td>");
                    b.Append("<td style='padding-left:5px'>" + dr["PayMode"].ToString() + "</td>");
                    b.Append("<td style='padding-left:5px'>" + dr["receiptDate"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:5px'>" + dr["Amount"].ToString() + "</td>");
                    b.Append("</tr>");
                }
                b.Append("</table>");
            }
            if (CancelAgainstNo.Length > 10)
            {
                b.Append("<p style='width:100%;float:left;font-size:16px'>");
                b.Append("Cancel Against No : " + CancelAgainstNo);
                b.Append("</p>");
            }
            b.Append("<img src=" + BarcodeGenerator.GenerateBarCode("IDCD1234", 300, 70) + " style='float:left;margin-top:25px;' />");
            b.Append("</div>");
            b.Append("<div style='width:40%;float:right'>");
            b.Append("<table style='font-size:14px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Gross Amount : </b></td>");
            b.Append("<td style='width:20%;text-align:right;white-space: nowrap;'><b>" + GrossAmount + "</b></td>");
            b.Append("</tr>");
            if (discount > 0)
            {
                b.Append("<tr style='font-size:16px'>");
                b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Discount : </b></td>");
                b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + discount + "</b></td>");
                b.Append("</tr>");
            }
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Net Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + NetAmount + "</b></td>");
            b.Append("</tr>");
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Received Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + Received + "</b></td>");
            b.Append("</tr>");
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Balance Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + Balance + "</b></td>");
            b.Append("</tr>");
            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");

            b.Append("<div style='width:100%;float:left'>");
            b.Append("<p style='font-size:14px'><b>Please visit http://chandanhospital.in/customer/Login.aspx to view online reports</b></p>");
            b.Append("<p style='font-size:11px'>Note : this is a computerized Bill and does not require Seal & Sign</p>");
            b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            b.Append("<table style='font-size:17px;text-align:center;border:0px solid #dcdcdc;width:100%'>");
            b.Append("<tr>");
            b.Append("<td>" + DateTime.UtcNow.ToString("dddd, dd MMMM yyyy") + "</td>");
            b.Append("<td>Prepared By : Arshad Ahmad</td>");
            b.Append("<td>Printed By : " + ActiveUser + "</td>");
            b.Append("</tr>");
            b.Append("</table>");
            b.Append("</div>");

            //b.Append("<span style='text-aligh:center'>");
            //b.Append("<p style='font-size:13px'>09-Oct-2020 12:04PM</p>");
            //b.Append("<p style='font-size:13px'>Prepared By : Arshad Ahmad</p>");			
            //b.Append("<p style='font-size:13px'>Printed By : Mr. Vijay Singh</p>");
            //b.Append("</span>");						
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Header_Hight = 150;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A5";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "MedicineBillReport.pdf");
        }
        public FileResult AdvicePreview(string app_no)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            AppointmentQueries obj = new AppointmentQueries();
            obj.AppointmentId = app_no;
            obj.Logic = "PatientForAdvice";
            dataSet dsResult = APIProxy.CallWebApiMethod("Appointment/Opd_AppointmentQueries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                b.Append("<div style='font-family:sans-serif;font-size:85%;border:1px solid #000;'>");
                b.Append("<span style='-webkit-transform: rotate(-90deg);position:fixed;font-size:11px;left:-86px;top:28%;width:23%'>Powered By : Chandan Hospital Ltd.</span>");
                b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
                string headerImageFile = HttpContext.Server.MapPath(@"/Content/logo/logo.png");
                b.Append("<div style='text-align:left;width:30%;float:left'>");
                b.Append("<img src=" + headerImageFile + " style='width:170px;margin-top:18px;' />");
                b.Append("</div>");
                b.Append("<div style='text-align:left;width:70%;float:right;'>");
                b.Append("<h3 style='font-weight:bold;margin-bottom:-2px'>Chandan HealthCare Ltd</h3>");
                b.Append("<span style='text-align:left;'>Sector G, Jankipuram, Biotech Park, Kursi Road, Lucknow, Pin - 226021</span><br/>");
                b.Append("<span style='text-align:left;'>Tel. : (0522) 2354834, 2351112, 2351151, Fax (0522) 2353372, 4035888</span><br/>");
                b.Append("<span style='text-align:left;'><b>Website : www.chandan.co.in, GSTIN : 09AACCC1996N1Z2</b></span>");
                b.Append("</div>");
                b.Append("</div>");
                b.Append("<hr/>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    b.Append("<table style='width:100%;font-size:13px;text-align:left;border:0px solid #dcdcdc;'>");
                    b.Append("<tr>");
                    b.Append("<td><b>Patient Name</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["patient_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>UHID No.</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["UHID"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Age/Gender</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Age"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Appointment Date</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["AppDate"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Doctor</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["DoctorName"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Appointment Type</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["appType"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Mobile No.</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["mobile_no"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Valid To</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["AppDate"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Panel</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["PanelName"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Barcode</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td><img src=" + BarcodeGenerator.GenerateBarCode(dr["UHID"].ToString(), 225, 25) + " style='width:150px;height:100%'/></td>");
                    b.Append("</tr>");
                    b.Append("</table>");
                }
            }

            b.Append("<div style='float:left;width:100%;border:1px solid #000;margin-left:-1px'>");
            //Left Block Start
            b.Append("<div style='float:left;width:26%;border-right:1px solid #000;min-height:840px;position:relative;'>");


            if (ds.Tables.Count > 0 && ds.Tables[3].Rows.Count > 0)
            {
                //Vital Sign
                b.Append("<div style='width:95%;margin:5px;font-size:13px;'>");
                b.Append("<p style='text-align:left;margin:0'><b>Vital Sign :</b></p>");
                b.Append("<table style='width:99%;font-size:10px;line-height:8px;margin-left:3px;'>");
                foreach (DataRow dr in ds.Tables[3].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td>Weight</td>");
                    b.Append("<td>:</td>");
                    b.Append("<td>" + dr["WT"].ToString() + " kg</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Temprature</td>");
                    b.Append("<td>:</td>");
                    b.Append("<td>" + dr["Temprarture"].ToString() + " °C</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Pulse</td>");
                    b.Append("<td>:</td>");
                    b.Append("<td>" + dr["Pulse"].ToString() + " °C</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>B/P</td>");
                    b.Append("<td>:</td>");
                    b.Append("<td style='white-space: nowrap;'>" + dr["BP_Sys"].ToString() + " Mm/Hg</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>SPO2</td>");
                    b.Append("<td>:</td>");
                    b.Append("<td>" + dr["SPO2"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Height</td>");
                    b.Append("<td>:</td>");
                    b.Append("<td>" + dr["HT"].ToString() + " cm</td>");
                    b.Append("</tr>");
                }
                b.Append("</table>");
                b.Append("</div>");
            }
            //Declaration For Template Items
            var T00001 = string.Empty;
            var T00002 = string.Empty;
            var T00003 = string.Empty;
            var T00005 = string.Empty;
            var T00006 = string.Empty;
            var T00007 = string.Empty;
            var T00008 = string.Empty;
            var T00009 = string.Empty;
            var T00010 = string.Empty;
            var T00015 = string.Empty;
            var tbody = string.Empty;
            //Left Block End			
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    if (dr["TemplateId"].ToString() == "T00001")
                    {
                        T00001 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00002")
                    {
                        T00002 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00003")
                    {
                        T00003 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00005")
                    {
                        T00005 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00006")
                    {
                        T00006 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00007")
                    {
                        T00007 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00008")
                    {
                        T00008 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00009")
                    {
                        T00009 += "<tr><td>" + dr["ItemName"].ToString() + "</td></tr>";
                    }
                    if (dr["TemplateId"].ToString() == "T00010")
                    {
                        T00010 += "<tr><td>" + dr["ItemName"].ToString() + "</td></tr>";
                    }
                    if (dr["TemplateId"].ToString() == "T00015")
                    {
                        T00015 += dr["ItemName"].ToString() + ",";
                    }
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    count++;
                    tbody += "<tr>" +
                "<td style='padding-left:3px;'>" + count + "</td><td style='padding-left:3px;'>" + dr["Item_name"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_dose"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_times"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_duration"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_intake"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_route"].ToString() + "</td><td style='padding-left:3px;'>" + dr["qty"].ToString() + "</td><td style='padding-left:3px;'>" + dr["remark"].ToString() + "</td>" +
                "</tr>";
                }
            }
            if (!string.IsNullOrEmpty(T00009))
            {
                //Investigation
                b.Append("<div style='width:95%;margin:5px;font-size:13px;'>");
                b.Append("<p style='text-align:left;margin:0'><b>Investigation :</b></p>");
                b.Append("<table style='width:99%;font-size:10px;line-height:12px;margin-left:3px;'>");
                b.Append(T00009);
                b.Append("</table>");
                b.Append("</div>");
            }

            if (!string.IsNullOrEmpty(T00010))
            {
                //Procedure
                b.Append("<div style='width:95%;margin:5px;font-size:13px;'>");
                b.Append("<p style='text-align:left;margin:0'><b>Procedure :</b></p>");
                b.Append("<table style='width:99%;font-size:10px;line-height:12px;margin-left:3px;'>");
                b.Append(T00010);
                b.Append("</table>");
                b.Append("</div>");
            }


            b.Append("<div style='width:95%;margin:0 5px;font-size:12px;border:1px solid #ccc;position:relative;bottom:0;'>");
            b.Append("<p style='text-align:center;margin:0;'>Note<hr style='width:90%;text-align:center;'/></p>");
            if (ds.Tables.Count > 0 && ds.Tables[4].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[4].Rows)
                {
                    b.Append("<div style='width:100%;font-size:10px;line-height:8px;margin-top:-10px;'>");
                    b.Append(dr["content"].ToString());
                    b.Append("</div>");
                }
            }
            b.Append("</div>");
            b.Append("</div>");
            //Right Block Start
            b.Append("<div style='float:right;width:73%;padding-top:5px;position:relative;min-height:840px;'>");
            if (!string.IsNullOrEmpty(T00001))
            {
                //Provisional Diagnosis Begin
                b.Append("<div style='width:95%;font-size:13px;'>");
                b.Append("<p style='text-align:left;margin:0'><b>Provisional Diagnosis :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00001.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //Provisional Diagnosis End	
            }
            if (!string.IsNullOrEmpty(T00002))
            {
                //Chief Complaint Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>Chief Complaint :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00002.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //Chief Complaint End
            }
            if (!string.IsNullOrEmpty(T00003))
            {
                //Sign & Symptoms Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>Sign & Symptoms :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00003.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //Sign & Symptoms End
            }
            if (!string.IsNullOrEmpty(tbody))
            {
                //Medicine Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                string rx = HttpContext.Server.MapPath(@"/Content/logo/rx.png");
                b.Append("<p style='text-align:left;margin:0'><img src=" + rx + " style='width:15px;margin-bottom:-7px;' /></p>");
                b.Append("<table style='width:100%;float:left;font-size:9px;margin:10px 0;text-align:left;border-collapse: collapse;' border='1' >" +
                    "<tr>" +
                    "<th style='padding-left:3px;'>Sr</th><th style='padding-left:3px;'>Name</th><th style='padding-left:3px;'>Dose</th><th style='padding-left:3px;'>Times</th><th style='padding-left:3px;'>Duration</th><th style='padding-left:3px;'>Meal</th><th style='padding-left:3px;'>Route</th><th style='padding-left:3px;'>Qty</th><th style='padding-left:3px;'>Remarks</th>" +
                    "</tr>" +
                    tbody +
                    "</table>");
                b.Append("</div>");
                //Medicine End
            }
            if (!string.IsNullOrEmpty(T00005))
            {

                //Doctor Notes Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>Doctor Notes :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00005.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //Doctor Notes End
            }
            if (!string.IsNullOrEmpty(T00006))
            {
                //Allergies Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>Allergies :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00006.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //Allergies End
            }
            if (!string.IsNullOrEmpty(T00015))
            {
                //History Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>History :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00015.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //History End
            }
            if (!string.IsNullOrEmpty(T00007))
            {
                //History Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>Past Medication :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00007.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //History End
            }
            if (!string.IsNullOrEmpty(T00008))
            {
                //History Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<p style='text-align:left;margin:0'><b>Doctor Advice :</b></p>");
                b.Append("<span style='font-size:12px;'>" + T00008.TrimEnd(',') + "</span>");
                b.Append("</div>");
                //History End
            }
            //if (!string.IsNullOrEmpty(T00006))
            //{
            //Transfer & Referral Begin 
            //b.Append("<div style='width:95%;font-size:13px;'><br>");
            //b.Append("<p style='text-align:left;margin:0'><b>Transfer & Referral :</b></p>");
            //b.Append("<span style='font-size:12px;'>Viral Fever, Anti Headache Fluence, Constipation, Acute Gastric, URTI Visit</span>");
            //b.Append("</div>");
            //Transfer & Referral End
            //}
            if (ds.Tables.Count > 0 && ds.Tables[5].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[5].Rows)
                {
                    //Doctor Details Bottom Begin
                    b.Append("<div style='width:95%;position:absolute;bottom:0'>");
                    b.Append("<h3 style='text-align:right;margin:0;padding:0'><img style='float:right' src='" + dr["SignVirtualPath"].ToString() + "'/><br/><br/><br/>" + dr["DoctorName"].ToString() + "</h3>");
                    b.Append("<h4 style='text-align:right;margin:0 10px 10px'>" + dr["degree"].ToString() + "</h4>");
                    b.Append("</div>");
                    //Doctor Details Bottom End
                }
            }
            b.Append("</div>"); //Right Block End
            b.Append("</div>");

            b.Append("</div>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 35;
            pdfConverter.Header_Hight = 120;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "Preview.pdf");
        }
        public FileResult OPTHReceipt(string app_no)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            CPOETemplateItemsBO obj = new CPOETemplateItemsBO();
            obj.app_no = app_no;
            obj.Logic = "OPTHPresInfoForReceipt";
            dataSet dsResult = APIProxy.CallWebApiMethod("master/CPOE_OPTHQueries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            StringBuilder f = new StringBuilder();
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    b.Append("<div style='font-family:sans-serif;font-size:85%;border:1px solid #000;'>");
                    b.Append("<span style='-webkit-transform: rotate(-90deg);position:fixed;font-size:11px;left:-86px;top:28%;width:23%'>Powered By : " + dr["Hospital_Name"].ToString() + ".</span>");
                    b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
                    string headerImageFile = HttpContext.Server.MapPath(@"~/Content/logo/logo.png");
                    b.Append("<div style='text-align:left;width:30%;float:left'>");
                    b.Append("<img src=" + headerImageFile + " style='width:170px;margin-top:18px;' />");
                    b.Append("</div>");
                    b.Append("<div style='text-align:left;width:70%;float:right;'>");
                    b.Append("<h3 style='font-weight:bold;margin-bottom:-2px'>" + dr["Hospital_Name"].ToString() + "</h3>");
                    b.Append("<span style='text-align:left;'>" + dr["Full_Address"].ToString() + "</span><br/>");
                    b.Append("<span style='text-align:left;'>" + dr["ContactInfo"].ToString() + "</span><br/>");
                    b.Append("<span style='text-align:left;'><b>Website : " + dr["Website"].ToString() + ", GSTIN : " + dr["gst_no"].ToString() + "</b></span>");
                    b.Append("</div>");
                    b.Append("</div>");
                    b.Append("<hr/>");
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    b.Append("<table style='width:100%;font-size:13px;text-align:left;border:0px solid #dcdcdc;'>");
                    b.Append("<tr>");
                    b.Append("<td><b>Patient Name</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["patient_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>UHID No.</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["UHID"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Age/Gender</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Age"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Appointment Date</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["AppDate"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Doctor</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["DoctorName"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Appointment Type</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["appType"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Mobile No.</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["mobile_no"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Valid To</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["AppDate"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Panel</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["PanelName"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td><b>Barcode</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td><img src=" + BarcodeGenerator.GenerateBarCode(dr["UHID"].ToString(), 225, 25) + " style='width:150px;height:100%'/></td>");
                    b.Append("</tr>");
                    b.Append("</table>");
                }
            }

            b.Append("<div style='float:left;width:100%;border:1px solid #000;margin-left:-1px'>");
            //Left Block Start
            b.Append("<div style='float:left;width:26%;border-right:1px solid #000;min-height:770px;position:relative;'>");

            //Declaration For Template Items          
            var T00009 = string.Empty;
            var T00010 = string.Empty;
            var T00011 = string.Empty;
            var T00012 = string.Empty;
            var T00013 = string.Empty;
            var T00014 = string.Empty;
            var tbody = string.Empty;
            var tbodyChiefComplaint = string.Empty;
            var tbodyExamination = string.Empty;
            var tbodyDiagnosis = string.Empty;
            var tbodyAdvice = string.Empty;
            var tbodyGlass = string.Empty;
            var tbodyVisualAcuity = string.Empty;
            var tbodyMCT = string.Empty;
            var SpecRemark = string.Empty;
            var PosteriorRatina = string.Empty;
            var EyeLens = string.Empty;
            var Remark = string.Empty;
            //Left Block End			
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    if (dr["TemplateId"].ToString() == "T00014")
                    {
                        T00014 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00009")
                    {
                        T00009 += "<tr><td>" + dr["ItemName"].ToString() + "</td></tr>";
                    }
                    if (dr["TemplateId"].ToString() == "T00010")
                    {
                        T00010 += "<tr><td>" + dr["ItemName"].ToString() + "</td></tr>";
                    }
                    if (dr["TemplateId"].ToString() == "T00011")
                    {
                        T00011 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00012")
                    {
                        T00012 += dr["ItemName"].ToString() + ",";
                    }
                    if (dr["TemplateId"].ToString() == "T00013")
                    {
                        T00013 += dr["ItemName"].ToString() + ",";
                    }
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[3].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[3].Rows)
                {
                    count++;
                    tbody += "<tr style='text-align:center'>" +
                "<td style='padding-left:3px;'>" + count + "</td><td style='padding-left:3px;'>" + dr["EyesInfo"].ToString() + "</td><td style='padding-left:3px;'>" + dr["Item_name"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_dose"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_times"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_duration"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_intake"].ToString() + "</td><td style='padding-left:3px;'>" + dr["med_route"].ToString() + "</td><td style='padding-left:3px;'>" + dr["qty"].ToString() + "</td><td style='padding-left:3px;'>" + dr["remark"].ToString() + "</td>" +
                "</tr>";
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[4].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[4].Rows)
                {
                    count++;
                    tbodyGlass += "<tr style='text-align:center'>";
                    tbodyGlass += "<td>" + dr["SpecType"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["left_Sph"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["left_Cyl"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["left_Axis"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["left_VA"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["right_Sph"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["right_Cyl"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["right_Axis"].ToString() + "</td>";
                    tbodyGlass += "<td>" + dr["right_VA"].ToString() + "</td>";
                    tbodyGlass += "</tr>";
                    if (dr["Const"].ToString() == "Y")
                        SpecRemark += "Const,";

                    if (dr["Bifocal"].ToString() == "Y")
                        SpecRemark += "Bifocal,";

                    if (dr["PhotoSun"].ToString() == "Y")
                        SpecRemark += "PhotoSun,";

                    if (dr["ARC"].ToString() == "Y")
                        SpecRemark += "ARC,";

                    if (dr["Near"].ToString() == "Y")
                        SpecRemark += "Near,";

                    if (dr["Progressive"].ToString() == "Y")
                        SpecRemark += "Progressive,";

                    Remark = dr["Remark"].ToString();
                }
                tbodyGlass += "<tr>";
                tbodyGlass += "<td colspan='9'>&nbsp;<b>Remark :</b> " + SpecRemark + Remark + "</t>";
                tbodyGlass += "</tr>";
            }
            if (ds.Tables.Count > 0 && ds.Tables[7].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[7].Rows)
                {
                    PosteriorRatina = dr["PosteriorRatinaSegment"].ToString();
                    EyeLens = dr["EyeLens"].ToString();
                    count++;
                    tbodyMCT += "<tr style='text-align:center'>";
                    tbodyMCT += "<td>MCT</td>";
                    tbodyMCT += "<td>" + dr["left_MCT"].ToString() + "</td>";
                    tbodyMCT += "<td>" + dr["right_MCT"].ToString() + "</td>";
                    tbodyMCT += "</tr>";
                    tbodyMCT += "<tr style='text-align:center'>";
                    tbodyMCT += "<td>AT</td>";
                    tbodyMCT += "<td>" + dr["left_AT"].ToString() + "</td>";
                    tbodyMCT += "<td>" + dr["right_AT"].ToString() + "</td>";
                    tbodyMCT += "</tr>";
                    tbodyMCT += "<tr style='text-align:center'>";
                    tbodyMCT += "<td>Gonioscopy</td>";
                    tbodyMCT += "<td>" + dr["left_Gonioscopy"].ToString() + "</td>";
                    tbodyMCT += "<td>" + dr["right_Gonioscopy"].ToString() + "</td>";
                    tbodyMCT += "</tr>";
                    tbodyMCT += "<tr style='text-align:center'>";
                    tbodyMCT += "<td>-</td>";
                    tbodyMCT += "<td>-</td>";
                    tbodyMCT += "<td>-</td>";
                    tbodyMCT += "</tr>";
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[7].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[7].Rows)
                {
                    count++;
                    tbodyVisualAcuity += "<tr style='text-align:center'>";
                    tbodyVisualAcuity += "<td>Un-Aided</td>";
                    tbodyVisualAcuity += "<td>" + dr["left_unaided"].ToString() + "</td>";
                    tbodyVisualAcuity += "<td>" + dr["right_unaided"].ToString() + "</td>";
                    tbodyVisualAcuity += "</tr>";
                    tbodyVisualAcuity += "<tr style='text-align:center'>";
                    tbodyVisualAcuity += "<td>With Pin Hole</td>";
                    tbodyVisualAcuity += "<td>" + dr["left_withPinHole"].ToString() + "</td>";
                    tbodyVisualAcuity += "<td>" + dr["right_withPinHole"].ToString() + "</td>";
                    tbodyVisualAcuity += "</tr>";
                    tbodyVisualAcuity += "<tr style='text-align:center'>";
                    tbodyVisualAcuity += "<td>With Prv Glass</td>";
                    tbodyVisualAcuity += "<td>" + dr["left_withPrvGlass"].ToString() + "</td>";
                    tbodyVisualAcuity += "<td>" + dr["right_withPrvGlass"].ToString() + "</td>";
                    tbodyVisualAcuity += "</tr>";
                    tbodyVisualAcuity += "<tr style='text-align:center'>";
                    tbodyVisualAcuity += "<td>Prv Spect Power</td>";
                    tbodyVisualAcuity += "<td>" + dr["left_PrvSpectPower"].ToString() + "</td>";
                    tbodyVisualAcuity += "<td>" + dr["right_PrvSpectPower"].ToString() + "</td>";
                    tbodyVisualAcuity += "</tr>";
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[11].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[11].Rows)
                {
                    count++;
                    tbodyChiefComplaint += "<li>" + dr["ItemName"].ToString() + "</li> ";
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[9].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[9].Rows)
                {
                    count++;
                    tbodyDiagnosis += "<li>" + dr["ItemName"].ToString() + "</li> ";
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[10].Rows.Count > 0)
            {
                var count = 0;
                var AdviceGroup = "";
                foreach (DataRow dr in ds.Tables[10].Rows)
                {
                    count++;
                    //if (AdviceGroup != dr["GroupName"].ToString())
                    //{
                    //    tbodyAdvice += "<li style='background:#ddd;'>" + dr["GroupName"].ToString() + "</li> ";
                    //    AdviceGroup = dr["GroupName"].ToString();
                    //}
                    tbodyAdvice += "<li style='padding-left:5px'>" + dr["ItemName"].ToString() + "</li> ";
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[8].Rows.Count > 0)
            {
                var count = 0;
                var ExamGroup = "";
                foreach (DataRow dr in ds.Tables[8].Rows)
                {
                    count++;
                    //if (ExamGroup != dr["GroupName"].ToString())
                    //{
                    //    tbodyExamination += "<li style='background:#ddd;'>" + dr["GroupName"].ToString() + "</li> ";
                    //    ExamGroup = dr["GroupName"].ToString();
                    //}
                    tbodyExamination += "<li style='padding-left:5px'>" + dr["ItemName"].ToString() + "</li> ";
                }
            }
            if (!string.IsNullOrEmpty(T00009))
            {
                //Investigation
                b.Append("<div style='width:95%;margin:5px;font-size:13px;'>");
                b.Append("<p style='text-align:left;margin:0'><b>Investigation :</b></p>");
                b.Append("<table style='width:99%;font-size:10px;line-height:12px;margin-left:3px;'>");
                b.Append(T00009);
                b.Append("</table>");
                b.Append("</div>");
            }
            if (!string.IsNullOrEmpty(tbodyVisualAcuity))
            {
                //Visual Acuity Begin
                b.Append("<div style='width:95%;margin:5px;font-size:13px;'>");
                b.Append("<table style='width:100%;float:left;font-size:9px;margin:10px 0;text-align:left;border-collapse: collapse;' border='1' >" +
                           "<tr style='background:#ddd;text-align:center'>" +
                           "<th></th>" +
                           "<th style='text-align:center'>Left</th>" +
                           "<th style='text-align:center'>Right</th>" +
                           "</tr>" +
                           tbodyVisualAcuity +
                           "</table>");
                b.Append("</div>");
                //Visual Acuity End
            }
            if (!string.IsNullOrEmpty(tbodyMCT))
            {
                //MCT Begin
                b.Append("<div style='width:95%;margin:5px;font-size:13px;'>");
                b.Append("<table style='width:100%;float:right;font-size:9px;margin:10px 0;text-align:left;border-collapse: collapse;' border='1' >" +
                  "<tr style='background:#ddd;text-align:center'>" +
                  "<th></th>" +
                  "<th style='text-align:center'>Left</th>" +
                  "<th style='text-align:center'>Right</th>" +
                  "</tr>" +
                  tbodyMCT +
                  "</table>");
                b.Append("</div>");
                //MCT End
            }
            b.Append("<div style='width:23%;margin:0 5px;font-size:12px;border:1px solid #ccc;position:fixed;bottom:5px;'>");
            b.Append("<p style='text-align:center;margin:0;'>Note<hr style='width:90%;text-align:center;'/></p>");
            if (ds.Tables.Count > 0 && ds.Tables[5].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[5].Rows)
                {
                    b.Append("<div style='width:100%;font-size:10px;line-height:8px;margin-top:-10px;'>");
                    b.Append(dr["content"].ToString());
                    b.Append("</div>");
                }
            }
            b.Append("</div>");
            b.Append("</div>");
            //Right Block Start
            b.Append("<div style='float:right;width:73%;padding-top:5px;position:relative;min-height:770px;'>");
            b.Append("<div style='width:100%;min-height:150px;'>");
            if (!string.IsNullOrEmpty(tbodyChiefComplaint))
            {
                 
                b.Append("<div style='width:47%;font-size:13px;float:left;'>");

                //Chief Complaint Begin
                b.Append("<p style='margin:0'><b>Chief Complaint</b></p>");
                b.Append("<ul style='margin:0;font-size:11px;list-style:none;letter-spacing:1px;'>" + tbodyChiefComplaint + "</ul>");
                //Chief Complaint End

                //Diagnosis Begin              
                b.Append("<p style='margin:0'><b>Diagnosis</b></p>");
                b.Append("<ul style='margin:0;font-size:11px;list-style:none;letter-spacing: 1px;'>" + tbodyDiagnosis + "</ul>");
                //Diagnosis End

                b.Append("</div>");
            }
            if (!string.IsNullOrEmpty(tbodyExamination))
            {
                b.Append("<div style='width:47%;font-size:13px;float:left;'>");
                //Examination Begin
                b.Append("<p style='margin:0'><b>Examination</b></p>");
                b.Append("<ul style='margin:0;font-size:11px;list-style:none;letter-spacing:1px;'>" + tbodyExamination + "</ul>");
                //Examination End              
                b.Append("</div>");
            }
            b.Append("</div>");
            string ratinaSigment = HttpContext.Server.MapPath(@"~/images/PostSig.png");
            string lensEye = HttpContext.Server.MapPath(@"~/images/AnteriorSeg.png");
            b.Append("<div style='width:100%'><br>");
            b.Append("<div style='width:100%;float:left;'>");
            b.Append("<div style='width:100%;margin-bottom:10px'><br>");
            if (PosteriorRatina == "Y")
            {
                //Posterior Ratina Begin
                b.Append("<div style='width:47%;float:left;text-align:center;border:1px solid #000;margin-bottom:10px'>");
                b.Append("<p style='width:99%;margin:1px 1px;;text-align:center;background:#ddd'>Posterior Ratina Segment<p>");
                b.Append("<img src=" + ratinaSigment + " style='height:77px' />");
                b.Append("</div>");
                //Posterior Ratina End
            }
            if (EyeLens == "Y")
            {
                //Eye Lens Begin
                b.Append("<div style='width:47%;float:right;text-align:center;border:1px solid #000;margin-right:5%;margin-bottom:10px'>");
                b.Append("<p style='width:99%;margin:1px 1px;text-align:center;background:#ddd'>Anterior Segment<p>");
                b.Append("<img src=" + lensEye + " />");
                b.Append("</div>");
                //Eye Lens End
            }
            b.Append("</div>");
            b.Append("</div>");
            b.Append("</div>");

            if (!string.IsNullOrEmpty(tbodyGlass))
            {
                //Glass Details Begin           
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                b.Append("<table style='width:100%;float:left;font-size:9px;margin:0;text-align:left;border-collapse: collapse;' border='1' >" +
                    "<tr style='background:#ddd;text-align:center'><th colspan='9'>Glass Detail</th></tr>" +
                    "<tr style='background:#ddd;text-align:center'>" +
                    "<th style='width: 1'></th><th style='text-align:center' colspan='4'>Left Glass</th><th style='text-align:center' colspan='4'>Right Glass</th>" +
                    "</tr>" +
                    "<tr style='background:#ddd;text-align:center'>" +
                    "<th></th><th>Sph</th><th>Cyl</th><th>Axis</th><th>VA</th><th>Sph</th><th>Cyl</th><th>Axis</th><th>VA</th>" +
                    "</tr>" +
                    tbodyGlass +
                    "</table>");
                b.Append("</div>");
                //Glass Details End
            }
            if (!string.IsNullOrEmpty(tbody))
            {
                //Medicine Begin
                b.Append("<div style='width:95%;font-size:13px;'><br>");
                //string rx = HttpContext.Server.MapPath(@"~/Content/logo/rx.png");
                //b.Append("<p style='text-align:left;margin:0'><img src=" + rx + " style='width:15px;margin-bottom:-7px;' /></p>");
                b.Append("<table style='width:100%;float:left;font-size:9px;margin:10px 0;text-align:left;border-collapse: collapse;' border='1' >" +
                    "<tr style='background:#ddd;text-align:center'>" +
                    "<th style='padding-left:3px;'>Sr</th><th style='padding-left:3px;'>Eye</th><th style='padding-left:3px;'>Name</th><th style='padding-left:3px;'>Dose</th><th style='padding-left:3px;'>Times</th><th style='padding-left:3px;'>Duration</th><th style='padding-left:3px;'>Meal</th><th style='padding-left:3px;'>Route</th><th style='padding-left:3px;'>Qty</th><th style='padding-left:3px;'>Remarks</th>" +
                    "</tr>" +
                    tbody +
                    "</table>");
                b.Append("</div>");
                //Medicine End
            }
            b.Append("<div style='width:100%;'>");
            if (!string.IsNullOrEmpty(tbodyAdvice))
            {

                b.Append("<div style='width:60%;font-size:13px;float:left;margin-bottom:20px'>");

                //Advice Begin             
                b.Append("<p style='margin:0'><b>Advice</b></p>");
                b.Append("<ul style='margin:0;font-size:11px;list-style:none;letter-spacing: 1px;'>" + tbodyAdvice + "</ul>");
                //Advice End

                b.Append("</div>");
            }
            b.Append("</div>");
            f.Append("<div style='width:100%;'>");
            if (ds.Tables.Count > 0 && ds.Tables[6].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[6].Rows)
                {
                    //Doctor Details Bottom Begin
                    f.Append("<div style='width:100%;position:absolute;float:right;'>");
                    f.Append("<h3 style='text-align:right;margin:0 10px;padding:0;font-size:19px'><img style='float:right' src='" + dr["SignVirtualPath"].ToString() + "'/><br/><br/><br/>" + dr["DoctorName"].ToString() + "</h3>");
                    f.Append("<h4 style='text-align:right;margin:0 10px 10px;font-size:18px'>" + dr["degree"].ToString() + "</h4>");
                    f.Append("</div>");
                    //Doctor Details Bottom End
                }
            }
            f.Append("</div>"); 
            b.Append("</div>"); //Right Block End
            b.Append("</div>");
            b.Append("</div>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 70;
            pdfConverter.Header_Hight = 120;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), f.ToString(), "Preview.pdf");
        }
        public FileResult ServiceReceipt(string visitNo)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            ServiceQueries obj = new ServiceQueries();
            obj.prm_1 = visitNo;
            obj.Logic = "PrintServiceReceipt";
            HISWebApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("Service/Opd_ServiceQueries", obj);

            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            decimal GrossAmount = 0;
            decimal discount = 0;
            decimal NetAmount = 0;
            decimal Received = 0;
            decimal Balance = 0;
            string CancelAgainstNo = "";
            string loginName = "";
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    GrossAmount = Convert.ToDecimal(dr["GrossAmount"]);
                    discount = Convert.ToDecimal(dr["discount"]);
                    NetAmount = Convert.ToDecimal(dr["NetAmount"]);
                    Received = Convert.ToDecimal(dr["Received"]);
                    Balance = Convert.ToDecimal(dr["Balance"]);
                    b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
                    string headerImageFile = HttpContext.Server.MapPath(@"/Content/logo/logo.png");
                    b.Append("<div style='text-align:left;width:30%;float:left'>");
                    b.Append("<img src=" + headerImageFile + " style='width:170px;margin-top:18px;' />");
                    b.Append("</div>");
                    b.Append("<div style='text-align:left;width:auto;float:left;'>");
                    b.Append("<h4 style='font-weight:bold;margin:0;text-decoration: underline;'>BILL OF SUPPLY(Duplicate)</h4>");
                    b.Append("<h3 style='font-weight:bold;margin:0'>CHANDAN DIAGNOSTIC CENTRE</h3>");
                    b.Append("<span style='text-align:left;'>(Unit Of Chandan Healthcare Ltd.)</span><br/>");
                    b.Append("<span style='text-align:left;'>Add:Biotech Park, Kursi Road, Lucknow, Pin - 226021</span><br/>");
                    b.Append("<span style='text-align:left;'>Ph. : (0522) 2354834, 2351112, 2351151</span><br/>");
                    b.Append("<span style='text-align:left;'><b>Email: care@chandandiagnostic.com</b></span>");
                    b.Append("</div>");
                    b.Append("</div>");
                    b.Append("<div style='text-align:left;width:100%;float:left;'>");
                    b.Append("<span style='text-align:left;width:33%;float:left;'><b>CIN : " + dr["CIN"].ToString() + "</b></span>");
                    b.Append("<span style='text-align:right;width:33%;float:left;'><b>GSTIN : " + dr["GSTIN"].ToString() + "</b></span>");
                    b.Append("<span style='text-align:right;width:33%;float:right;'><b>HSN : " + dr["HSN"].ToString() + "</b></span>");
                    b.Append("</div>");
                    b.Append("<hr/>");

                    b.Append("<table style='width:100%;font-size:17px;text-align:left;border:0px solid #dcdcdc;margin-bottom:-15px'>");
                    b.Append("<tr>");
                    b.Append("<td>Name</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["patient_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Bill No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["bill_no"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Age/Gender</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Age"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Visit/Reg Date</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["visitDate"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Contact No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["mobile_no"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Refered By</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["ref_name"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Address</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["address"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Panel</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td style='text-transform:uppercase'>" + dr["PanelName"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>UHID</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["UHID"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Reporting Time</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["ReportingTime"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Visit No</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["visitNo"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Consultant</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["DoctorName"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Home Colection</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td colspan='5'>NO</td>");
                    b.Append("</tr>");
                    b.Append("</table>");
                    CancelAgainstNo = dr["visitType"].ToString();
                    loginName = dr["loginName"].ToString();
                }
            }
            b.Append("<table  style='width:100%;font-size:18px;text-align:left;border:0px solid #dcdcdc;margin-top:10px;' border='0' cellspacing='0'>");
            b.Append("<tr>");
            b.Append("<th colspan='9'><hr style='margin-bottom:-2px;border:1px solid #000'></th>");
            b.Append("</tr>");
            b.Append("<tr>");
            b.Append("<th style='width:1%;padding:3px;'>S.N.</th>");
            b.Append("<th style='width:70%;padding:3px;'>Test Name</th>");
            b.Append("<th style='width:10%;padding:3px;;text-align:right'>Rate(₹)</th>");
            b.Append("<th style='width:10%;padding:3px;;text-align:right'>P.Disc(₹)</th>");
            b.Append("<th style='width:10%;padding:3px;;text-align:right'>Adl.Disc(₹)</th>");
            b.Append("<th style='width:10%;padding:3px;;text-align:right'>NetAmt(₹)</th>");
            b.Append("</tr>");
            b.Append("<tr>");
            b.Append("<th colspan='9'><hr style='margin-top:-4px;margin-bottom:-2px;border:1px solid #000'></th>");
            b.Append("</tr>");
            //Body
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                var count = 0;
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    count++;
                    b.Append("<tr>");
                    b.Append("<td style='width:1%;font-size:15px !important;padding:0;margin:2px'>" + count + "</td>");
                    b.Append("<td style='width:70%;font-size:15px !important;padding:0;margin:2px'>" + dr["ItemName"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right;padding:0;margin:2px'>" + dr["Rate"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right;padding:0;margin:2px'>" + dr["panel_discount"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right;padding:0;margin:2px'>" + dr["adl_discount"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right;padding:0;margin:2px'>" + dr["amount"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td colspan='9'><hr style='margin:-1px 0;'></td>");
                    b.Append("</tr>");
                }
            }
            //b.Append("<tr>");
            //b.Append("<td></td><td colspan='3'><hr style='margin-top:-4px;margin-bottom:-6px;'></td>");
            //b.Append("</tr>");
            b.Append("</table>");

            b.Append("<div style='width:100%;float:left;margin-top:5px'>");
            b.Append("<div style='width:60%;float:left'>");

            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                b.Append("<table style='width:100%;font-size:14px;text-align:left;' border='1' cellspacing='0'>");
                b.Append("<tr>");
                b.Append("<th style='padding-left:5px'>Settlement</th>");
                b.Append("<th style='padding-left:5px'>Payment</th>");
                b.Append("<th style='padding-left:5px'>Receipt No</th>");
                b.Append("<th style='padding-left:5px'>Mode</th>");
                b.Append("<th style='text-align:right'>Amount</th>");
                b.Append("</tr>");
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:5px'>" + dr["payType"].ToString() + "</td>");
                    b.Append("<td style='padding-left:5px'>" + dr["receiptDate"].ToString() + "</td>");
                    b.Append("<td style='padding-left:5px'>" + dr["ReceiptNo"].ToString() + "</td>");
                    b.Append("<td style='padding-left:5px'>" + dr["PayMode"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:5px'>" + dr["Amount"].ToString() + "</td>");
                    b.Append("</tr>");
                }
                b.Append("</table>");
            }
            if (CancelAgainstNo.Length > 10)
            {
                b.Append("<p style='width:100%;float:left;font-size:16px'>");
                b.Append("Cancel Against No : " + CancelAgainstNo);
                b.Append("</p>");
            }
            b.Append("</div>");
            b.Append("<div style='width:40%;float:right'>");
            b.Append("<table style='font-size:14px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Total Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + GrossAmount + "</b></td>");
            b.Append("</tr>");
            if (discount > 0)
            {
                b.Append("<tr style='font-size:16px'>");
                b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Discount : </b></td>");
                b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + discount + "</b></td>");
                b.Append("</tr>");
            }
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Net Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + NetAmount + "</b></td>");
            b.Append("</tr>");
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Received Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + Received + "</b></td>");
            b.Append("</tr>");
            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");
            b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            b.Append("<div style='text-align:left;width:100%;float:left;'>");
            b.Append("<span style='text-align:left;width:70%;float:left;'><b>Received with thanks : </b>" + AmountConverter.ConvertToWords(Convert.ToString(NetAmount).ToString()) + "</span>");
            b.Append("<span style='text-align:right;width:30%;float:right;'><b>" + loginName + "</b></span>");
            b.Append("</div>");
            b.Append("<div style='width:100%;float:left'><br/>");
            b.Append("<p style='font-size:16px;text-align:left;margin:0'>For any query, kindly get in touch with us on</p>");
            b.Append("<p style='font-size:16px;text-align:left;margin:0'><b>customercare@chandandiagnostic.com</b><img src=" + BarcodeGenerator.GenerateBarCode("TH/21-22/00000239", 300, 70) + " style='float:right' /></p>");
            b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            //b.Append("<p style='font-size:15px;text-align:center'>गर्भ में पल रहे भ्रूण के लिंग की जाँच करना एक दंडनीय अपराध है.</p>");
            //b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            b.Append("<p style='font-size:15px;text-align:center'><b>Attention Please!!<br/>Get upto 11% discount on pharmacy services through CHANDAN HEALTH CARD</b></p>");
            b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            b.Append("</div>");

            //b.Append("<span style='text-aligh:center'>");
            //b.Append("<p style='font-size:13px'>09-Oct-2020 12:04PM</p>");
            //b.Append("<p style='font-size:13px'>Prepared By : Arshad Ahmad</p>");			
            //b.Append("<p style='font-size:13px'>Printed By : Mr. Vijay Singh</p>");
            //b.Append("</span>");						
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Header_Hight = 150;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A5";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "ServiceReceipt.pdf");
        }
    }
}