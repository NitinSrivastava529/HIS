using System;
using System.IO;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Warehouse.Controllers
{
	public class PurchaseController : Controller
	{
		// GET: Warehouse/Purchase
		public ActionResult PurchaseEntry()
		{
			return View();
		}
		public ActionResult CreatePurchaseOrder()
		{
			return View();
		}
		public ActionResult PurchasePosting()
		{
			return View();
		}
		public ActionResult ReceiveInStock()
		{
			return View();
		}
		public ActionResult PurchaseBills()
		{
			return View();
		}
		public ActionResult PrintPurchaseBills()
		{
			return View();
		}
		public ActionResult PrintInvoice()
		{
			return View();
		}
        public ActionResult GoodsReturn()
        {
            return View();
        }
        public ActionResult PrintGoodsReturn()
        {
            return View();
        }
        public ActionResult GoodsReturnPrint()
        {
            return View();
        }
        public ActionResult PurchaseOrder()
        {
            return View();
        }
        public ActionResult GoodsReceived()
        {
            return View();
        }
        //public Byte[] PdfSharpConvert(String html)
        //{
        //	Byte[] res = null;
        //	using (MemoryStream ms = new MemoryStream())
        //	{
        //		var pdf = TheArtOfDev.HtmlRenderer.PdfSharp.PdfGenerator.GeneratePdf(html, PdfSharp.PageSize.A4);
        //		pdf.Save(ms);
        //		res = ms.ToArray();
        //	}
        //	return res;
        //}
    }
}