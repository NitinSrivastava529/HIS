using HIS.Repository;
using HISWebApi.Models;
using MediSoftTech_HIS.App_Start;
using System;
using System.Data;
using System.Text;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Pharmacy.Controllers
{
    public class PrintController : Controller
    {
        public FileResult PrintCreditSale(string from, string to)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            ipPharmacyInfo obj = new ipPharmacyInfo();
            obj.prm_2 = from;
            obj.prm_3 = to;
            obj.Logic = "IPDCreditSalebydate";
            dataSet dsResult = APIProxy.CallWebApiMethod("Pharmacy/Hospital_Queries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            StringBuilder f = new StringBuilder();

            string invoiceNo = string.Empty;
            string InvoiceType = string.Empty;
            string IPDNo = string.Empty;
            string TotalIPDNo = ds.Tables[0].Rows[0]["hosp_ipop_no"].ToString();
            string TotalIPDNoForDate = ds.Tables[0].Rows[0]["hosp_ipop_no"].ToString();
            string SaleDate = ds.Tables[0].Rows[0]["sale_date"].ToString()+ ds.Tables[0].Rows[0]["hosp_ipop_no"].ToString();
            int totalLength = ds.Tables[0].Rows.Count;
            string Prm1 = string.Empty;
            decimal total = 0;
            decimal discount = 0;
            decimal amount = 0;
            decimal ttotal = 0;
            decimal tdiscount = 0;
            decimal tamount = 0;
            decimal Itotal = 0;
            decimal Idiscount = 0;
            decimal Iamount = 0;
            var totalIPDInfo = string.Empty;

            b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
            b.Append("<div style='text-align:left;width:auto;float:left;width:100%;'>");
            b.Append("<h2 style='font-weight:bold;margin:0'>Chandan Hospital Ltd.</h2>");
            b.Append("<span style='text-align:left;'>Vijayant Khand, Faizabad Road, Near High Court, Lucknow</span><br/>");
            b.Append("<h4 style='font-weight:bold;margin:0'>Credit Sale Summary From  : "+from.Split('-')[2]+'-'+ from.Split('-')[1]+"-"+from.Split('-')[0]+", To : " + to.Split('-')[2] + '-' + from.Split('-')[1] + "-" + from.Split('-')[0] + "</h4>");
            b.Append("</div>");
            b.Append("</div>");
            b.Append("<hr/>");
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                int count = 0;
                int IPDcount2 = 0;
                b.Append("<table border='0' style='width:100%;font-size:12px;border:0px solid #ddd;margin-top:10px;'>");
                b.Append("<tr>");
                b.Append("<th style='text-align:left'>Sale Inv No</th>");
                b.Append("<th style='text-align:right'>Pay Mode</th>");
                b.Append("<th style='text-align:right'>Total</th>");
                b.Append("<th style='text-align:right'>Discount</th>");
                b.Append("<th style='text-align:right'>Amount</th>");
                b.Append("<th style='text-align:right'>Item Count</th>");
                b.Append("</tr>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    count++;
                    IPDcount2++;

                    ttotal += Convert.ToDecimal(dr["Total"].ToString());
                    tdiscount += Convert.ToDecimal(dr["discount"].ToString());
                    tamount += Convert.ToDecimal(dr["amount"].ToString());
                    if (SaleDate != dr["sale_date"].ToString() + dr["hosp_ipop_no"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right'><b>Total</b></td>");
                        b.Append("<td style='text-align:right'><b>" + total + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + discount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + amount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        total = 0;
                        discount = 0;
                        amount = 0;
                        SaleDate = dr["sale_date"].ToString() + dr["hosp_ipop_no"].ToString();
                    }
                    total += Convert.ToDecimal(dr["Total"].ToString());
                    discount += Convert.ToDecimal(dr["discount"].ToString());
                    amount += Convert.ToDecimal(dr["amount"].ToString());

                    if (TotalIPDNo != dr["hosp_ipop_no"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right;font-size:11px;'><b>Total of IPD No : " + totalIPDInfo + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Itotal + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Idiscount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Iamount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        Itotal = 0;
                        Idiscount = 0;
                        Iamount = 0;
                        TotalIPDNo = dr["hosp_ipop_no"].ToString();
                    }
                    Itotal += Convert.ToDecimal(dr["Total"].ToString());
                    Idiscount += Convert.ToDecimal(dr["discount"].ToString());
                    Iamount += Convert.ToDecimal(dr["amount"].ToString());
                    if (IPDNo != dr["hosp_ipop_no"].ToString())
                    {
                        b.Append("<tr style='background:#ddd'>");
                        b.Append("<td colspan='7'>IPD No : " + dr["hosp_ipop_no"].ToString() + ", Patient Name : " + dr["pt_name"].ToString() + "</td>");
                        b.Append("<tr>");
                        IPDNo = dr["hosp_ipop_no"].ToString();
                        totalIPDInfo = dr["hosp_ipop_no"].ToString() + ", Patient Name : " + dr["pt_name"].ToString();
                        Prm1 = string.Empty;
                        IPDcount2 = 0;
                    }
                    
                    if (Prm1 != dr["sale_date"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='text-decoration:underline' colspan='7'>Sale Date : " + dr["sale_date"].ToString() + "</td>");
                        b.Append("<tr>");
                        Prm1 = dr["sale_date"].ToString();
                    }

                    b.Append("<tr>");
                    b.Append("<td>" + dr["sale_inv_no"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["pay_mode"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["Total"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["discount"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["amount"].ToString() + "</td>");
                    b.Append("<td style='text-align:center'>" + dr["saleCount"].ToString() + "</td>");
                    b.Append("</tr>");
                                      
                    if (count == totalLength)
                    {
                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right'><b>Total</b></td>");
                        b.Append("<td style='text-align:right'><b>" + total + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + discount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + amount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        total = 0;
                        discount = 0;
                        amount = 0;

                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right;font-size:11px;'><b>Total of IPD No : " + totalIPDInfo + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Itotal + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Idiscount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Iamount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        Itotal = 0;
                        Idiscount = 0;
                        Iamount = 0;
                    }
                }
            }

            b.Append("</table>");
            b.Append("<div style='width:100%;float:left;margin-top:5px'>");
            b.Append("<hr/>");
            b.Append("<div style='width:40%;float:left'>");
            b.Append("</div>");
            b.Append("<div style='width:60%;float:right'>");
            b.Append("<table style='font-size:12px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Total</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + ttotal.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Discount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + tdiscount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Amount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + tamount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Footer_Hight = 132;
            pdfConverter.Header_Hight = 70;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), f.ToString(), "IPDCreditSalebydate.pdf");
        }
        public FileResult IPDCreditSalebyIPD(string ipdno)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            ipPharmacyInfo obj = new ipPharmacyInfo();
            obj.prm_1 = ipdno;
            obj.prm_2 ="";
            obj.prm_3 = "";
            obj.Logic = "IPDCreditSalebyIPD";
            dataSet dsResult = APIProxy.CallWebApiMethod("Pharmacy/Hospital_Queries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            StringBuilder f = new StringBuilder();

            string invoiceNo = string.Empty;
            string InvoiceType = string.Empty;
            string IPDNo = string.Empty;
            string TotalIPDNo = ds.Tables[0].Rows[0]["hosp_ipop_no"].ToString();
            string TotalIPDNoForDate = ds.Tables[0].Rows[0]["hosp_ipop_no"].ToString();
            string SaleDate = ds.Tables[0].Rows[0]["sale_date"].ToString() + ds.Tables[0].Rows[0]["hosp_ipop_no"].ToString();
            int totalLength = ds.Tables[0].Rows.Count;
            string Prm1 = string.Empty;
            decimal total = 0;
            decimal discount = 0;
            decimal amount = 0;
            decimal ttotal = 0;
            decimal tdiscount = 0;
            decimal tamount = 0;
            decimal Itotal = 0;
            decimal Idiscount = 0;
            decimal Iamount = 0;
            var totalIPDInfo = string.Empty;

            b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
            b.Append("<div style='text-align:left;width:auto;float:left;width:100%;'>");
            b.Append("<h2 style='font-weight:bold;margin:0'>Chandan Hospital Ltd.</h2>");
            b.Append("<span style='text-align:left;'>Vijayant Khand, Faizabad Road, Near High Court, Lucknow</span><br/>");
            b.Append("<h4 style='font-weight:bold;margin:0'>Credit Sale Summary</h4>");
            b.Append("</div>");
            b.Append("</div>");
            b.Append("<hr/>");
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                int count = 0;
                int IPDcount2 = 0;
                b.Append("<table border='0' style='width:100%;font-size:12px;border:0px solid #ddd;margin-top:10px;'>");
                b.Append("<tr>");
                b.Append("<th style='text-align:left'>Sale Inv No</th>");
                b.Append("<th style='text-align:right'>Pay Mode</th>");
                b.Append("<th style='text-align:right'>Total</th>");
                b.Append("<th style='text-align:right'>Discount</th>");
                b.Append("<th style='text-align:right'>Amount</th>");
                b.Append("<th style='text-align:right'>Item Count</th>");
                b.Append("</tr>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    count++;
                    IPDcount2++;

                    ttotal += Convert.ToDecimal(dr["Total"].ToString());
                    tdiscount += Convert.ToDecimal(dr["discount"].ToString());
                    tamount += Convert.ToDecimal(dr["amount"].ToString());
                    if (SaleDate != dr["sale_date"].ToString() + dr["hosp_ipop_no"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right'><b>Total</b></td>");
                        b.Append("<td style='text-align:right'><b>" + total + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + discount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + amount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        total = 0;
                        discount = 0;
                        amount = 0;
                        SaleDate = dr["sale_date"].ToString() + dr["hosp_ipop_no"].ToString();
                    }
                    total += Convert.ToDecimal(dr["Total"].ToString());
                    discount += Convert.ToDecimal(dr["discount"].ToString());
                    amount += Convert.ToDecimal(dr["amount"].ToString());

                    if (TotalIPDNo != dr["hosp_ipop_no"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right;font-size:11px;'><b>Total of IPD No : " + totalIPDInfo + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Itotal + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Idiscount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Iamount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        Itotal = 0;
                        Idiscount = 0;
                        Iamount = 0;
                        TotalIPDNo = dr["hosp_ipop_no"].ToString();
                    }
                    Itotal += Convert.ToDecimal(dr["Total"].ToString());
                    Idiscount += Convert.ToDecimal(dr["discount"].ToString());
                    Iamount += Convert.ToDecimal(dr["amount"].ToString());
                    if (IPDNo != dr["hosp_ipop_no"].ToString())
                    {
                        b.Append("<tr style='background:#ddd'>");
                        b.Append("<td colspan='7'>IPD No : " + dr["hosp_ipop_no"].ToString() + ", Patient Name : " + dr["pt_name"].ToString() + "</td>");
                        b.Append("<tr>");
                        IPDNo = dr["hosp_ipop_no"].ToString();
                        totalIPDInfo = dr["hosp_ipop_no"].ToString() + ", Patient Name : " + dr["pt_name"].ToString();
                        Prm1 = string.Empty;
                        IPDcount2 = 0;
                    }

                    if (Prm1 != dr["sale_date"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='text-decoration:underline' colspan='7'>" + dr["sale_date"].ToString() + "</td>");
                        b.Append("<tr>");
                        Prm1 = dr["sale_date"].ToString();
                    }

                    b.Append("<tr>");
                    b.Append("<td>" + dr["sale_inv_no"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["pay_mode"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["Total"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["discount"].ToString() + "</td>");
                    b.Append("<td style='text-align:right'>" + dr["amount"].ToString() + "</td>");
                    b.Append("<td style='text-align:center'>" + dr["saleCount"].ToString() + "</td>");
                    b.Append("</tr>");

                    if (count == totalLength)
                    {
                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right'><b>Total</b></td>");
                        b.Append("<td style='text-align:right'><b>" + total + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + discount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + amount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        total = 0;
                        discount = 0;
                        amount = 0;

                        b.Append("<tr>");
                        b.Append("<td colspan='2' style='text-align:right;font-size:11px;'><b>Total of IPD No : " + totalIPDInfo + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Itotal + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Idiscount + "</b></td>");
                        b.Append("<td style='text-align:right'><b>" + Iamount + "</b></td>");
                        b.Append("<td></td>");
                        b.Append("<tr>");
                        Itotal = 0;
                        Idiscount = 0;
                        Iamount = 0;
                    }
                }
            }

            b.Append("</table>");
            b.Append("<div style='width:100%;float:left;margin-top:5px'>");
            b.Append("<hr/>");
            b.Append("<div style='width:40%;float:left'>");
            b.Append("</div>");
            b.Append("<div style='width:60%;float:right'>");
            b.Append("<table style='font-size:12px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Total</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + ttotal.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Discount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + tdiscount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Amount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + tamount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Footer_Hight = 132;
            pdfConverter.Header_Hight = 70;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), f.ToString(), "IPDCreditSalebydate.pdf");
        }
    }
}