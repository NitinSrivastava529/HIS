using HIS.Repository;
using MediSoftTech_HIS.App_Start;
using System;
using System.Data;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using static HISWebApi.Models.Warehouse;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
	public class PrintController : Controller
	{
		public FileResult PrintInvoice(string purchId, string Logic = "PurchaseInfo")
		{
			PdfGenerator pdfConverter = new PdfGenerator();
			PurchaseQueriesBO obj = new PurchaseQueriesBO();
			obj.purchId = purchId;
			obj.Logic = Logic;
			HISWebApi.Models.dataSet dsResult=APIProxy.CallWebApiMethod("warehouse/PurchaseQuery", obj);
			DataSet ds = dsResult.ResultSet;
			string _result = string.Empty;
			StringBuilder b = new StringBuilder();
			StringBuilder h = new StringBuilder();
			int TotalAmount = 0;
			int Discount = 0;
			int CGST = 0;
			int SGST = 0;
			int IGST = 0;
			int Tax = 0;
			int NetAmount = 0;
			int Payable = 0;
			b.Append("<h1 style='text-align:center;font-weight:bold;text-decoration: underline;'>Chandan Hospital Tax Invoice</h1>");
			if(ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
			{
				foreach (DataRow dr in ds.Tables[1].Rows)
				{
					TotalAmount += Convert.ToInt32(dr["inv_total"]);
					Discount += Convert.ToInt32(dr["inv_discount"]);
					CGST += Convert.ToInt32(dr["CGST_AMT"]);
					SGST += Convert.ToInt32(dr["SGST_AMT"]);
					IGST += Convert.ToInt32(dr["IGST_AMT"]);
					Tax += Convert.ToInt32(dr["inv_tax"]);
					NetAmount += Convert.ToInt32(dr["netamount"]);
					Payable += Convert.ToInt32(dr["netamount"]);
					b.Append("<h3 style='text-align:left'>Purchase Bill Information</h3>");
					b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#ececec;'>");
					b.Append("<tr>");
					b.Append("<td><b>Vendor Name</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["vend_name"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("<td><b>Invoice Date</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["inv_date"].ToString().Substring(0, 10) + "</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Address</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["address"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("<td><b>Invoice No</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["inv_no"].ToString() + "</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>District,State</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["state"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("<td><b>Purch Id</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + purchId + "</td>");
					b.Append("</tr>");

                    b.Append("<tr>");
					b.Append("<td><b>Contact No</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["contact_no"].ToString() + "</td>");
					b.Append("<td colspan='4'>&nbsp;</td>");
					b.Append("<td><b>Voucher No</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["voucher_no"].ToString() + " </td>");
					b.Append("</tr>");

                    b.Append("<tr>");
                    b.Append("<td><b>GSTN No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["gst_no"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Feeding Date</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Doc_Date"].ToString() + " </td>");
                    b.Append("</tr>");


                    b.Append("</tr>");
					b.Append("</table>");
				}
			}
			b.Append("<table border='1' style='width:100%;font-size:11px;border-collapse: collapse'>");
			b.Append("<tr>");
			b.Append("<th style='width:40%;text-align:left;padding-left:4px;'>Item Name</th>");
			b.Append("<th style='white-space: nowrap;'>HSN Code</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Batch</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Pack</th>");
			b.Append("<th style='white-space: nowrap'>Pack Qty</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Expiry</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Trade</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>NPR</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Qty</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Free</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>GST</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Disc</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Amount</th>");
			b.Append("</tr>");
			//Body			
			if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
			{
				foreach (DataRow dr in ds.Tables[0].Rows)
				{
					b.Append("<tr>");
					b.Append("<td style='padding-left:4px;'>" + dr["item_Name"].ToString() + "</td>");
					b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["HSN"].ToString() + "</td>");
					b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["Batch_No"].ToString() + "</td>");
					b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["pack_type"].ToString() + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["pack_qty"].ToString() + "</td>");
					b.Append("<td style='text-align:center;white-space: nowrap;padding-right:4px;'>" + dr["Exp_Date"].ToString() + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["trade"]) + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["npr"]) + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["Quantity"]) + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["It_Free"]) + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["tax_amount"]) + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["DisAmount"]) + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["amount"]) + "</td>");
					b.Append("</tr>");
				}
			}
			b.Append("</table>");
			b.Append("<br/>");
			b.Append("<table border='1' style='width:64%;font-size:15px;border-collapse: collapse;float:right'>");
			b.Append("<tr>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Total Amount</th>");
			b.Append("<th>Discount</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>CGST</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>SGST</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>IGST</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Tax</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Net Amount</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Payable</th>");
			b.Append("</tr>");
			b.Append("<tr>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + TotalAmount + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + Discount + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + CGST + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + SGST + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + IGST + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + Tax + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + NetAmount + "</td>");
			b.Append("<td style='text-align:right;padding-right:4px;'>" + Payable + "</td>");
			b.Append("</tr>");
			pdfConverter.Header_Enabled = false;
			pdfConverter.Footer_Enabled = true;
			pdfConverter.Footer_Hight = 17;
			pdfConverter.Header_Hight = 70;
			pdfConverter.PageMarginLeft = 10;
			pdfConverter.PageMarginRight = 10;
			pdfConverter.PageMarginBottom = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageName = "A4";
			pdfConverter.PageOrientation = "Portrait";
			return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "Purchase-Invoice.pdf");
		}
		public FileResult PrintDispatch(string LotNo,  string Logic = "PrintDispatchedByLotNo")
		{
			PdfGenerator pdfConverter = new PdfGenerator();
			DispatchOrderBo obj = new DispatchOrderBo();
			obj.lot_no = LotNo;
			obj.Logic = Logic;
			HISWebApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("warehouse/wh_PrintDispatchedByLotNo", obj);

			DataSet ds = dsResult.ResultSet;
			string _result = string.Empty;
			StringBuilder b = new StringBuilder();
			StringBuilder h = new StringBuilder();
			b.Append("<h1 style='text-align:center;font-weight:bold;text-decoration: underline;'>Print Dispatch</h1>");
			if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
			{
				foreach (DataRow dr in ds.Tables[1].Rows)
				{
					b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#ececec;'>");
					b.Append("<tr>");
					b.Append("<td><b>From</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["FromCart"].ToString() + "</td>");
					b.Append("<td>&nbsp;</td>");
					b.Append("<td><b>To</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["ToCart"].ToString() + "</td>");
					b.Append("<td>&nbsp;</td>");
					b.Append("<td><b>Dispatch No</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td>" + dr["lot_no"].ToString() + "</td>");
					b.Append("</tr>");
					b.Append("<tr>");
					b.Append("<td><b>Address</b></td>");
					b.Append("<td><b>:</b></td>");
					b.Append("<td colspan='15'>Chandan Hopital, Faizabad Road, Near Chinhat Flyover Vijayant Khand, Gomti Nagar, Lucknow - 226010 </td>");
					b.Append("</tr>");
					b.Append("</table>");
				}
			}
			b.Append("<br/>");
			b.Append("<table border='1' style='width:100%;font-size:11px;border-collapse: collapse'>");
			b.Append("<tr>");
			b.Append("<th style='width:40%;text-align:left;padding-left:4px;'>Item Name</th>");
			b.Append("<th style='white-space: nowrap;'>HSN Code</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Master key Id</th>");
			b.Append("<th style='white-space: nowrap'>P.Qty</th>");
			b.Append("<th style='text-align:right;padding-right:4px;'>Expiry</th>");
			b.Append("<th style='text-align:right;padding-right:4px;white-space: nowrap'>Batch No</th>");
			b.Append("<th style='text-align:right;padding-right:4px;white-space: nowrap'>Pack Type</th>");
			b.Append("<th style='white-space: nowrap'>Quantity</th>");
			//b.Append("<th style='text-align:right;padding-right:4px;'>Mfd. Name</th>");
			b.Append("</tr>");
			//Body			
			if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
			{
				foreach (DataRow dr in ds.Tables[0].Rows)
				{
					b.Append("<tr>");
					b.Append("<td style='padding-left:4px;'>" + dr["item_name"].ToString() + "</td>");
					b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["hsn"].ToString() + "</td>");
					b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["master_key_id"].ToString() + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["pack_qty"].ToString() + "</td>");
					b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["exp_date"].ToString() + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["batch_no"] + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;white-space: nowrap'>" + dr["pack_type"] + "</td>");
					b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["qty"].ToString() + "</td>");
					//b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["mfd_name"] + "</td>");			
					b.Append("</tr>");
				}
			}
			b.Append("</table>");
			pdfConverter.Header_Enabled = false;
			pdfConverter.Footer_Enabled = true;
			pdfConverter.Footer_Hight = 17;
			pdfConverter.Header_Hight = 70;
			pdfConverter.PageMarginLeft = 10;
			pdfConverter.PageMarginRight = 10;
			pdfConverter.PageMarginBottom = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageName = "A4";
			pdfConverter.PageOrientation = "Portrait";
			return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "Print-Dispatch-Invoice.pdf");
		}
		public FileResult PurchaseReport(string ProcName, DateTime from, DateTime to, string CartId, string Category, string ItemIds, string prm_1, string login_id, string Logic)
		{
			PdfGenerator pdfConverter = new PdfGenerator();
			ReportBO obj = new ReportBO();
			obj.ProcName = ProcName;
			obj.from = from;
			obj.to = to;
			obj.CartId = CartId;
			obj.Category = Category;
			obj.ItemIds = ItemIds;
			obj.prm_1 = prm_1;
			obj.login_id = login_id;
			obj.Logic = Logic;
			HISWebApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("warehouse/wh_PurchaseReportQueries", obj);

			DataSet ds = dsResult.ResultSet;
			string _result = string.Empty;
			StringBuilder b = new StringBuilder();
			StringBuilder h = new StringBuilder();
			b.Append("<h2 style='text-align:center;font-weight:bold;'>" + prm_1+ "</h2>");
			b.Append("<table border='1' style='width:100%;font-size:11px;border-collapse: collapse'>");

			if (ds.Tables.Count > 0 && ds.Tables[0].Columns.Count > 0)
			{
				b.Append("<tr>");
				foreach (DataColumn th in ds.Tables[0].Columns)
				{
					b.Append("<th style='white-space: nowrap;text-align:left'>" + th.ColumnName + "</th>");
				}
				b.Append("</tr>");
			}
			if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
			{
				foreach (DataRow dr in ds.Tables[0].Rows)
				{
					b.Append("<tr>");
					foreach (DataColumn column in ds.Tables[0].Columns)
					{
						b.Append("<td style='padding-left:4px;'>" + dr[column.ColumnName] + " </td>");
					}
					b.Append("</tr>");
				}
			}
			b.Append("</table>");
			pdfConverter.Header_Enabled = false;
			pdfConverter.Footer_Enabled = true;
			pdfConverter.Footer_Hight = 17;
			pdfConverter.Header_Hight = 70;
			pdfConverter.PageMarginLeft = 10;
			pdfConverter.PageMarginRight = 10;
			pdfConverter.PageMarginBottom = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageMarginTop = 10;
			pdfConverter.PageName = "A4";
			pdfConverter.PageOrientation = "Portrait";
			return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "" + prm_1 + ".pdf");
		}
	}
}