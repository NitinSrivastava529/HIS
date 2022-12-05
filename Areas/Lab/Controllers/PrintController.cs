using HIS.Repository;
using HISWebApi.Models;
using MediSoftTech_HIS.App_Start;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Lab.Controllers
{
    public class PrintController : Controller
    {

        //GET:Lab/Print
        public FileResult SampleTransferSheet(string DispatchNo)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            SampleDispatchInfo obj = new SampleDispatchInfo();
            obj.from = Convert.ToDateTime("1900/01/01");
            obj.to = Convert.ToDateTime("1900/01/01");
            obj.Prm1 = DispatchNo;
            obj.Logic = "GetDispatchInfoForPrint";
            HISWebApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("Lab/SampleDispatchQueries",obj);

            DataSet ds = dsResult.ResultSet;
            StringBuilder b = new StringBuilder();
            string BranchName = string.Empty;
            string To = string.Empty;
            string DispatchDate = string.Empty;
            string DeliveryBoy = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                   BranchName = dr["DispatchFrom"].ToString();
                   To = dr["DispatchTo"].ToString();
                   DispatchDate = dr["sample_collect_date"].ToString();
                   DeliveryBoy = dr["DeliveryBoy"].ToString();
                }
                b.Append("<h2 style='text-align:center;font-weight:bold;margin-bottom:5px;font-family: Sans-serif; '>Sample Transfer Sheet</h2>");
                b.Append("<hr/>");
                //1st Info Table 1
                b.Append("<div style='background:#eee;padding:5px;'>");
                b.Append("<table style='font-size:12px;width:100%;font-family:Sans-serif;'>");
                b.Append("<tr>");
                b.Append("<td style='width:12%;'><b>Dispatch No</b></td>");
                b.Append("<td><b>:</b></td>");
                b.Append("<td>" + DispatchNo + "</td>");
                b.Append("<td>&nbsp;</td>");
                b.Append("<td style='width:13%;'><b>BarCode</b></td>");
                b.Append("<td><b>:</b></td>");
                b.Append("<td><img src=" + BarcodeGenerator.GenerateBarCode(DispatchNo, 300,70) + " style='width:250px'/></td>");
                b.Append("</tr>");
                b.Append("<tr>");
                b.Append("<td style='width:12%;'><b>Branch Name</b></td>");
                b.Append("<td><b>:</b></td>");
                b.Append("<td>" + BranchName + "</td>");            
                b.Append("<td>&nbsp;</td>");
                b.Append("<td style='width:13%;'><b>To</b></td>");
                b.Append("<td><b>:</b></td>");
                b.Append("<td>" + To + "</td>");
                b.Append("</tr>");
                b.Append("<tr>");
                b.Append("<td style='width:13%;'><b>Dispatch Date </td>");
                b.Append("<td><b>:</b></td>");
                b.Append("<td>" + DispatchDate + "</td>");
                b.Append("<td>&nbsp;</td>");
                b.Append("<td style='width:13%;'><b>Delivery Boy</b></td>");
                b.Append("<td><b>:</b></td>");
                b.Append("<td>" + DeliveryBoy + "</td>");
                b.Append("</tr>");
                b.Append("</table>");
                b.Append("</div>");
                //Second Info Table
                b.Append("<div style='width:100%;float:left;'>");
                b.Append("<table style='width:100%;font-size:11px; font-family: Sans-serif;text-align:left;margin-top:8px' border='0'  cellspacing='0'>");
                b.Append("<tr>");
                b.Append("<th style='white-space:none;width:15%;border:1px solid #ddd;padding-left:8px'>Visit No</th>");
                b.Append("<th style='white-space:none;width:12%;border:1px solid #ddd;padding-left:8px'>BarCode No</th>");
                b.Append("<th style='white-space:none;width:40%;border:1px solid #ddd;padding-left:8px'>Patient Name</th>");
                b.Append("<th style='white-space:none;width:16%;border:1px solid #ddd;padding-left:8px'>Reg Date</th>");
                b.Append("<th style='white-space:none;width:16%;border:1px solid #ddd;padding-left:8px'>Sample Date</th>");
                b.Append("</tr>");
                int count = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    count++;
                    b.Append("<tr>");
                    b.Append("<td style='border:1px solid #ddd;padding-left:8px'>" + dr["VisitNo"].ToString() + "</td>");
                    b.Append("<td style='border:1px solid #ddd;padding-left:8px'>" + dr["barcodeNo"].ToString() + "</td>");
                    b.Append("<td style='border:1px solid #ddd;padding-left:8px'>" + dr["patient_name"].ToString() + "</td>");
                    b.Append("<td style='border:1px solid #ddd;padding-left:8px; white-space:nowrap;'>" + dr["RegDate"].ToString() + "</td>");
                    b.Append("<td style='border:1px solid #ddd;padding-left:8px; white-space:nowrap;'>" + dr["sample_collect_date"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td colspan='5' style='white-space:none;background:#eee; font-size:8px;border:1px solid #ddd;padding-left:8px'><b>Test Name</b> : " + dr["TestName"].ToString() + "</td>");
                    b.Append("</tr>");
                }
                b.Append("</table>");
                b.Append("</div>");
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
            return pdfConverter.ConvertToPdf("-", b.ToString(), "-", "Sample-Transfer-Sheet.pdf");
        }

    }
}