using HISWebApi.Models;
using MediSoftTech_HIS.App_Start;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.Assets.Controllers
{
    public class AssetExcelController : Controller
    {
        // GET: Assets/AssetExcel
        [HttpGet]
        public ActionResult MovementExelReport()
        {
            return View();
        }

        [HttpPost]
        public void MovementReport_Download()
        {
            DataSet dsmain = new DataSet();
            ipAsset objBO = new ipAsset();
            objBO.eq_no = "-";
            objBO.DeptId = "-";
            objBO.from = "1900/01/01";
            objBO.to = "1900/01/01";
            objBO.prm_1 = "-";
            objBO.login_id = "";
            objBO.Logic = "MovementReport";
            dataSet ds = APIProxy.CallWebApiMethod("Asset/Hosp_AssetMovementQueries", objBO);
            dsmain = ds.ResultSet;
            string fileName = "MovementReport.xlsx";
            using (ClosedXML.Excel.XLWorkbook wb = new ClosedXML.Excel.XLWorkbook())
            {
                wb.Worksheets.Add(dsmain.Tables[0], "Sheet1");
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    Response.Clear();
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=" + fileName + "");
                    Response.BinaryWrite(stream.ToArray());
                    Response.End();
                }
            }

        }

    }
}