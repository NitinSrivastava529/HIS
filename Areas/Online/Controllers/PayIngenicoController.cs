using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotNetIntegrationKit;

namespace MediSoftTech_HIS.Areas.Online.Controllers
{
    public class PayIngenicoController : Controller
    {
        String PayDetail = "";
        // GET: Online/PayIngenico
        public ActionResult Index()
        {
            return View();
        }
        public void ResponsePage()
        {
            try
            {
                string strPGResponse = Request["msg"].ToString();  //Reading response of PG
                if (strPGResponse != "" || strPGResponse != null)
                {
                    RequestURL objRequestURL = new RequestURL();    //Creating Object of Class DotNetIntegration_1_1.RequestURL
                    string strDecryptedVal = null;                  //Decrypting the PG response
                    if (!String.IsNullOrEmpty(Convert.ToString(Session["PropertyFile"])))
                    {
                        string strFilePath = ConfigurationSettings.AppSettings["FilePath"].ToString();
                        string[] FilePath = strFilePath.Split('\\');
                        string MerchantCode = Convert.ToString(Session["Merchant_Code"]);
                        //strFilePath = FilePath[0] + "\\" + FilePath[2] + "\\" + MerchantCode + "\\" + FilePath[4];
                        strDecryptedVal = objRequestURL.VerifyPGResponse(strPGResponse,strFilePath);
                        PayDetail = "";
                        Response.Write(strDecryptedVal);
                    }
                    else
                    {
                        string strIsKey = ConfigurationSettings.AppSettings["Key"].ToString();
                        string strIsIv  = ConfigurationSettings.AppSettings["IV"].ToString();
                        strDecryptedVal = objRequestURL.VerifyPGResponse(strPGResponse, strIsKey, strIsIv);
                        Response.Write(strDecryptedVal);
                    }
                    
                    //if (strDecryptedVal.StartsWith("ERROR"))
                    //{
                    //    lblValidate.Text = strDecryptedVal;
                    //}
                    //else
                    //{
                    //    strSplitDecryptedResponse = strDecryptedVal.Split('|');
                    //    GetPGRespnseData(strSplitDecryptedResponse);

                    //    if (strPG_TxnStatus == "0300")
                    //    {
                    //        lblValidate.Text = "Transaction Success " + strPGTxnStatusCode;
                    //    }
                    //    else if (strPG_TxnStatus == "0200")
                    //    {
                    //        lblValidate.Text = "Transaction Success " + strPGTxnStatusCode;
                    //    }
                    //    else
                    //    {
                    //        strPGTxnString = strSplitDecryptedResponse[2].Split('=');
                    //        lblValidate.Text = "Transaction Fail " + "ERROR:" + strPGTxnString[1];
                    //    }
                    //}
                }
            }
            catch (Exception)
            {
                throw;
            }
            //return View();
        }
        public ActionResult doPayment()
        {
             return View();
        }
   
        public void MakePayment()
        {
            String response = "";
            try
            {
                var ResponseUrl = Request.UrlReferrer.Scheme+"://"+Request.UrlReferrer.Authority + "/Online/PayIngenico/ResponsePage";
                var Merchant_Code = ConfigurationSettings.AppSettings["Merchant_Code"].ToString();
                var Key = ConfigurationSettings.AppSettings["Key"].ToString();
                var IV = ConfigurationSettings.AppSettings["IV"].ToString();
                RequestURL objRequestURL = new RequestURL();
                string TXT_requesttype = "T";
                if (TXT_requesttype == "T")
                {
                    response = objRequestURL.SendRequest(
                               "T"
                              , Merchant_Code 
                              , "1254687/12-25"
                              , "Ajeet Kumar"
                              , "1.00" 
                              , "INR" 
                              , "Chandan123" 
                              , ResponseUrl
                              , ""
                              , "1254687/12-25"
                              , "FIRST_1.00_0.0" // sale item detail
                              , "07-12-2018"
                              , "-" //email
                              , "9838003146"//mobile
                              , ""
                              , ""
                              , ""
                              , ""
                              , Key
                              , IV
                             );
                }
                String strResponse = response.ToUpper();
                bool IsValid = false;
                if (strResponse.StartsWith("ERROR"))
                {
                    if (strResponse == "ERROR073")
                    {
                        response = objRequestURL.SendRequest(
                                 "T"
                                , Merchant_Code
                                , "1254687/12-25"
                                , "Ajeet Kumar"
                                , "1.00"
                                , "INR"
                                , "Chandan123"
                                , ResponseUrl
                                , ""
                                , "1254687/12-25"
                                , "FIRST_1.00_0.0" // sale item detail
                                , "07-12-2018"
                                , "-" //email
                                , "9838003146"//mobile
                                , ""
                                , ""
                                , ""
                                , ""
                                , Key
                                , IV
                               );
                        strResponse = response.ToUpper();
                    }
                    else
                    {

                    }
                }
                else
                {
                    IsValid = true;
                }
                if (TXT_requesttype == "T")
                {
                    if (IsValid)
                    {
                        Response.Write("<form name='s1_2' id='s1_2' action='" + response + "' method='post'> ");
                        Response.Write("<script type='text/javascript' language='javascript' >document.getElementById('s1_2').submit();");
                        Response.Write("</script>");
                        Response.Write("<script language='javascript' >");
                        Response.Write("</script>");
                        Response.Write("</form> ");
                    }
                }
                else
                {

                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        public void InvokePaymentMethod(string ReferenceNo)
        {
            String response = "";
            try
            {
                var ResponseUrl = Request.UrlReferrer.Scheme + "://" + Request.UrlReferrer.Authority + "/Online/PayIngenico/ResponsePage";
                var Merchant_Code = ConfigurationSettings.AppSettings["Merchant_Code"].ToString();
                var Key = ConfigurationSettings.AppSettings["Key"].ToString();
                var IV = ConfigurationSettings.AppSettings["IV"].ToString();
                RequestURL objRequestURL = new RequestURL();
                string TXT_requesttype = "T";
                if (TXT_requesttype == "T")
                {
                    response = objRequestURL.SendRequest(
                               "T"
                              , Merchant_Code
                              , "1254687/12-25"
                              , "Ajeet Kumar"
                              , "1.00"
                              , "INR"
                              , "Chandan123"
                              , ResponseUrl
                              , ""
                              , "1254687/12-25"
                              , "FIRST_1.00_0.0" // sale item detail
                              , "07-12-2018"
                              , "-" //email
                              , "9838003146"//mobile
                              , ""
                              , ""
                              , ""
                              , ""
                              , Key
                              , IV
                             );
                }
                String strResponse = response.ToUpper();
                bool IsValid = false;
                if (strResponse.StartsWith("ERROR"))
                {
                    if (strResponse == "ERROR073")
                    {
                        response = objRequestURL.SendRequest(
                                 "T"
                                , Merchant_Code
                                , "1254687/12-25"
                                , "Ajeet Kumar"
                                , "1.00"
                                , "INR"
                                , "Chandan123"
                                , ResponseUrl
                                , ""
                                , "1254687/12-25"
                                , "FIRST_1.00_0.0" // sale item detail
                                , "07-12-2018"
                                , "-" //email
                                , "9838003146"//mobile
                                , ""
                                , ""
                                , ""
                                , ""
                                , Key
                                , IV
                               );
                        strResponse = response.ToUpper();
                    }
                    else
                    {

                    }
                }
                else
                {
                    IsValid = true;
                }
                if (TXT_requesttype == "T")
                {
                    if (IsValid)
                    {
                        Response.Write("<form name='s1_2' id='s1_2' action='" + response + "' method='post'> ");
                        Response.Write("<script type='text/javascript' language='javascript' >document.getElementById('s1_2').submit();");
                        Response.Write("</script>");
                        Response.Write("<script language='javascript' >");
                        Response.Write("</script>");
                        Response.Write("</form> ");
                    }
                }
                else
                {

                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}