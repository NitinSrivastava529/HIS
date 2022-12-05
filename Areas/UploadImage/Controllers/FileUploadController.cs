using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MediSoftTech_HIS.Areas.UploadImage.Controllers
{
    public class FileUploadController : Controller
    {
        public JsonResult UploadFiles()
        {
            string fname = "";
            string finalpath = "";
            string retvirPath = "";
            string returnpath = "";
            string ext = "";
            if (Request.Files.Count > 0)
            {
                try
                {
                    HttpFileCollectionBase files = Request.Files;
                    byte[] imagebytes = null;
                    string[] types = Request.Form.AllKeys;
                    string type = types[0].ToString();
                    string Id = types[1].ToString();
                    string[] splitdata = Id.Split('/');
                    Id = splitdata[0] + "-" + splitdata[1] + "-" + splitdata[2];
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            int filelength = file.ContentLength;
                            imagebytes = new byte[filelength];
                            file.InputStream.Read(imagebytes, 0, filelength);
                            fname = file.FileName;
                            FileInfo fi = new FileInfo(fname);
                            ext = fi.Extension;
                        }
                        if (type == "Photo")
                        {
                            retvirPath = "~/Signature/" + fname;
                            finalpath = "http://exprohelp.com/hospdoc/" + "Signature/" + fname;
                            string retphyPath = "I:\\Hospital\\Signature\\";

                            //finalpath = "http://localhost:54687/" + "Signature/" + fname;
                            //string retphyPath = "D:\\Hospital\\Signature\\";
                            returnpath = finalpath + "#" + retphyPath + fname;
                            retvirPath = Path.Combine(Server.MapPath(retvirPath));
                            if (!Directory.Exists(retphyPath))
                            {
                                Directory.CreateDirectory(retphyPath);
                                retphyPath = retphyPath + fname;
                                file.SaveAs(retphyPath);
                            }
                            else
                            {
                                retphyPath = retphyPath + fname;
                                file.SaveAs(retphyPath);
                            }
                        }
                        if (type == "CovidCertificate")
                        {
                            //retvirPath = "~/CovidCertifcate/" + fname;

                            finalpath = "http://exprohelp.com/hospdoc/" + "CovidCertificate/" + Id + ext;
                            string retphyPath = "I:\\Hospital\\CovidCertificate\\";

                            //finalpath = "http://localhost:54687/" + "CovidCertificate/" + Id + ext;
                            //string retphyPath = "D:\\Hospital\\CovidCertificate\\";

                            returnpath = finalpath + "#" + retphyPath + Id + ext;

                            //retvirPath = Path.Combine(Server.MapPath(retvirPath));
                            if (!Directory.Exists(retphyPath))
                            {
                                Directory.CreateDirectory(retphyPath);
                                retphyPath = retphyPath + Id + ext;
                                file.SaveAs(retphyPath);
                            }
                            else
                            {
                                retphyPath = retphyPath + Id + ext;
                                file.SaveAs(retphyPath);
                            }
                        }

                        //file.SaveAs(retvirPath);
                    }
                    // Returns message that successfully uploaded  
                    return Json(returnpath);
                }
                catch (Exception ex)
                {
                    return Json("Error occurred. Error details: " + ex.Message);
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

    }
}