using HIS.Repository;
using HISWebApi.Models;
using MediSoftTech_HIS.App_Start;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;


namespace MediSoftTech_HIS.Areas.LinenLaundry.Controllers
{
    public class PrintController : Controller
    {
		public FileResult PrintLaundry(string CartId, string Prm1)
		{
			PdfGenerator pdfConverter = new PdfGenerator();
			ipLinen obj = new ipLinen();
			obj.CartId = CartId;
			obj.Prm1 = Prm1;
			obj.Logic = "StocksForDistribution";
			HISWebApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("LinenLaundry/LL_TransferAndReceiveQueries", obj);

			DataSet ds = dsResult.ResultSet;
			string _result = string.Empty;
			StringBuilder b = new StringBuilder();
			StringBuilder h = new StringBuilder();			
			b.Append("<h1 style='text-align:center;font-weight:bold;font-family:sans-serif;'>Laundry Receipt</hr></h1>");
			if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
			{
				var cart = string.Empty;
				var count = 0;
				b.Append("<table border='1' style='width:100%;font-size:12px;border-collapse: collapse;font-family:sans-serif;'>");
				b.Append("<tr>");				
				b.Append("<th style='text-align:left;padding-left:7px;'>S.N.</th>");
				b.Append("<th style='text-align:left;padding-left:7px;'>Item Id</th>");
				b.Append("<th style='text-align:left;padding-left:7px;'>Item Name</th>");
				b.Append("<th style='text-align:right;padding-right7px;'>Ward-StockToBe</th>");
				b.Append("<th style='text-align:right;padding-right7px;'>Ward-Stock</th>");
				b.Append("<th style='text-align:right;padding-right7px;'>Required Qty</th>");
				b.Append("<th style='text-align:right;padding-right7px;'>Intransit</th>");
				b.Append("<th style='text-align:right;padding-right7px;'>LaundaryStock</th>");
				b.Append("<th style='text-align:right;padding-right7px;'>Trf Qty</th>");		
				b.Append("</tr>");
				//Body			

				foreach (DataRow dr in ds.Tables[0].Rows)
				{
					count++;
					if(cart!=dr["CartName"].ToString())
					{
						b.Append("<tr style='background:#ccc'>");
						b.Append("<td colspan='9' style='text-align:left;padding-left:7px;'>" + dr["CartName"].ToString() + "</td>");
						b.Append("</tr>");
						cart = dr["CartName"].ToString();
						count = 1;
					}
					else
					{
						b.Append("<tr>");
					}						
					b.Append("<td style='text-align:left;padding-left:7px;'>" + count+"</td>");
					b.Append("<td style='text-align:left;padding-left:7px;'>" + dr["ItemId"].ToString()+"</td>");			
					b.Append("<td style='text-align:left;padding-left:7px;'>" + dr["item_name"].ToString()+"</td>");			
					b.Append("<td style='text-align:right;padding-right7px;'>"+dr["StockToBe"].ToString()+"</td>");			
					b.Append("<td style='text-align:right;padding-right7px;'>"+dr["wardStock"].ToString()+"</td>");			
					b.Append("<td style='text-align:right;padding-right7px;'>"+dr["RequiredQty"].ToString()+"</td>");			
					b.Append("<td style='text-align:right;padding-right7px;'>"+dr["Intransit"].ToString()+"</td>");			
					b.Append("<td style='text-align:right;padding-right7px;'>"+dr["LaundaryStock"].ToString()+"</td>");			
					b.Append("<td style='text-align:right;padding-right7px;'>"+dr["trfqty"].ToString()+"</td>");			
					b.Append("</tr>");
				}
				b.Append("</table>");
			}			
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
			return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "Laundry-Print.pdf");
		}
	}
}