using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HiQPdf;
namespace MediSoftTech_HIS.Repository
{
    public class PdfGenerator_Old
    {
        public int  PageMarginLeft { set; get; }
        public int  PageMarginRight { set; get; }
        public int  PageMarginTop { set; get; }
        public int  PageMarginBottom { set; get; }
        public int  Header_Hight { set; get; }
        public bool Header_Enabled { set; get; }
        public int  Footer_Hight { set; get; }
        public bool Footer_Enabled { set; get;}
        public FileResult ConvertToPdf_old(string htmlHeader,string htmlBody,string htmlFooter,string pdf_fileName)
        {
            // create the HTML to PDF converter
            HtmlToPdf htmlToPdfConverter = new HtmlToPdf();
            // set a demo serial number
           
            htmlToPdfConverter.SerialNumber = "g8vq0tPn‐5c/q4fHi‐8fq7rbOj‐sqO3o7uy‐t6Owsq2y‐sa26urq6";
            htmlToPdfConverter.Document.Security.AllowEditContent = false;
            htmlToPdfConverter.Document.Security.AllowCopyContent = false;
            htmlToPdfConverter.Document.Security.PermissionsPassword = "Itdose@123456";
            //htmlToPdfConverter.SerialNumber = "YCgJMTAE-BiwJAhIB-EhlWTlBA-UEBRQFBA-U1FOUVJO-WVlZWQ==";
            // set browser width
            htmlToPdfConverter.BrowserWidth = 850;
            htmlToPdfConverter.RenderWebFonts = true;
           
            //htmlToPdfConverter.BrowserHeight =800;
            // set HTML Load timeout
            htmlToPdfConverter.HtmlLoadedTimeout = 120;
            // set PDF page size and orientation
            htmlToPdfConverter.Document.PageSize=GetSelectedPageSize("A4");
            htmlToPdfConverter.Document.PageOrientation = GetSelectedPageOrientation("Portrait");
            
            //set the PDF standard used by the document
            //htmlToPdfConverter.Document.PdfStandard = collection["checkBoxPdfA"] != null ? PdfStandard.PdfA : PdfStandard.Pdf;
            htmlToPdfConverter.Document.PdfStandard = PdfStandard.Pdf;
            // set PDF page margins
            htmlToPdfConverter.Document.Margins = new PdfMargins(PageMarginLeft, PageMarginRight, PageMarginTop, PageMarginBottom);
            // set whether to embed the true type font in PDF
            htmlToPdfConverter.Document.FontEmbedding = true;
            htmlToPdfConverter.Document.FitPageWidth = false;


            string triggerMode = "WaitTime";
            // set triggering mode; for WaitTime mode set the wait time before convert
            switch (triggerMode)
            {
                case "Auto":
                    htmlToPdfConverter.TriggerMode = ConversionTriggerMode.Auto;
                    break;
                case "WaitTime":
                    htmlToPdfConverter.TriggerMode = ConversionTriggerMode.WaitTime;
                    htmlToPdfConverter.WaitBeforeConvert =2;
                    break;
                case "Manual":
                    htmlToPdfConverter.TriggerMode = ConversionTriggerMode.Manual;
                    break;
                default:
                    htmlToPdfConverter.TriggerMode = ConversionTriggerMode.Auto;
                    break;
            }
            // set header and footer
            PdfHtml headerHtml = new PdfHtml(10, 5, htmlHeader, null);
            PdfHtml headerFooter = new PdfHtml(10, 5, htmlFooter, null);

            SetHeader(htmlToPdfConverter.Document,headerHtml);
            SetFooter(htmlToPdfConverter.Document,headerFooter);

            // set the document security
            htmlToPdfConverter.Document.Security.OpenPassword = "";
            htmlToPdfConverter.Document.Security.AllowPrinting = true;

            // set the permissions password too if an open password was set
            if(htmlToPdfConverter.Document.Security.OpenPassword != null && htmlToPdfConverter.Document.Security.OpenPassword != String.Empty)
            htmlToPdfConverter.Document.Security.PermissionsPassword = htmlToPdfConverter.Document.Security.OpenPassword + "_admin";
            // convert HTML to PDF
            byte[] pdfBuffer = null;
            //string url = collection["textBoxUrl"];
            //pdfBuffer = htmlToPdfConverter.ConvertUrlToMemory(url);
            pdfBuffer = htmlToPdfConverter.ConvertHtmlToMemory(htmlBody,null);
            //pdfBuffer = htmlToPdfConverter.ConvertHtmlToPdfDocument(htmlBody, null);
            FileResult fileResult = new FileContentResult(pdfBuffer, "application/pdf");
            //for downloading use below line and direct view do not write below line
            fileResult.FileDownloadName = pdf_fileName;
            return fileResult;
        }
        private void SetHeader(PdfDocumentControl htmlToPdfDocument,PdfHtml headerHtml)
        {
            // enable header display
            htmlToPdfDocument.Header.Enabled = Header_Enabled;
            if (!htmlToPdfDocument.Header.Enabled)
                return;
            // set header height
            htmlToPdfDocument.Header.Height = Header_Hight;
            //htmlToPdfDocument.FitPageWidth = false;
            float pdfPageWidth = htmlToPdfDocument.PageOrientation == PdfPageOrientation.Portrait ?
                                        htmlToPdfDocument.PageSize.Width : htmlToPdfDocument.PageSize.Height;

            float headerWidth = pdfPageWidth - htmlToPdfDocument.Margins.Left - htmlToPdfDocument.Margins.Right+20;
            float headerHeight = htmlToPdfDocument.Header.Height;

            // set header background color
            //htmlToPdfDocument.Header.BackgroundColor=System.Drawing.Color.WhiteSmoke;

            //string headerImageFile = "D:\\ChandanLogo.jpg";
            //PdfImage logoHeaderImage = new PdfImage(5, 5, 60, System.Drawing.Image.FromFile(headerImageFile));
            //htmlToPdfDocument.Header.Layout(logoHeaderImage);

            //layout HTML in header
            //PdfHtml headerHtml = new PdfHtml(50, 5, @"<span style=""color:Navy; font-family:Times New Roman; font-style:italic"">
            //Quickly Create High Quality PDFs with </span><a href=""http://www.hiqpdf.com"">HiQPdf</a>", null);

            headerHtml.FitDestHeight = true;
            headerHtml.FontEmbedding = true;
            htmlToPdfDocument.Header.Layout(headerHtml);

            // create a border for header
            PdfRectangle borderRectangle = new PdfRectangle(1,1, headerWidth - 2, headerHeight - 2);
            borderRectangle.LineStyle.LineWidth = 0.5f;
            borderRectangle.ForeColor = System.Drawing.Color.Navy;
            borderRectangle.ForeColor = System.Drawing.Color.Navy;
            htmlToPdfDocument.Header.Layout(borderRectangle);
        }
        private void SetFooter(PdfDocumentControl htmlToPdfDocument,PdfHtml footerHtml)
        {
            // enable footer display
            htmlToPdfDocument.Footer.Enabled = Footer_Enabled;
            if (!htmlToPdfDocument.Footer.Enabled)
                return;
            // set footer height
            htmlToPdfDocument.Footer.Height = Footer_Hight;
            // set footer background color
            htmlToPdfDocument.Footer.BackgroundColor = System.Drawing.Color.WhiteSmoke;
            float pdfPageWidth = htmlToPdfDocument.PageOrientation == PdfPageOrientation.Portrait ?
                                        htmlToPdfDocument.PageSize.Width : htmlToPdfDocument.PageSize.Height;

            float footerWidth = pdfPageWidth - htmlToPdfDocument.Margins.Left - htmlToPdfDocument.Margins.Right + 20; 
            float footerHeight = htmlToPdfDocument.Footer.Height;

            // layout HTML in footer
            //PdfHtml footerHtml = new PdfHtml(5, 5, @"<span style=""color:Navy; font-family:Times New Roman; font-style:italic"">
            //                Quickly Create High Quality PDFs with </span><a href=""http://www.hiqpdf.com"">HiQPdf</a>", null);
            footerHtml.FitDestHeight = true;
            footerHtml.FontEmbedding = false;
            htmlToPdfDocument.Footer.Layout(footerHtml);

            // add page numbering
            System.Drawing.Font pageNumberingFont = new System.Drawing.Font(new System.Drawing.FontFamily("Times New Roman"),
                                        8, System.Drawing.GraphicsUnit.Point);
            PdfText pageNumberingText = new PdfText(5, footerHeight - 12, "Page {CrtPage} of {PageCount}", pageNumberingFont);
            pageNumberingText.HorizontalAlign = PdfTextHAlign.Center;
            pageNumberingText.EmbedSystemFont = true;
            pageNumberingText.ForeColor = System.Drawing.Color.DarkGreen;
            htmlToPdfDocument.Footer.Layout(pageNumberingText);

            ////string footerImageFile = Server.MapPath("~") + @"\DemoFiles\Images\HiQPdfLogo.png";
            //string footerImageFile = "~/images/chandanlogo.jpg";
            //PdfImage logoFooterImage = new PdfImage(footerWidth - 40 - 5, 5, 40, System.Drawing.Image.FromFile(footerImageFile));
            //htmlToPdfDocument.Footer.Layout(logoFooterImage);

            // create a border for footer
            PdfRectangle borderRectangle = new PdfRectangle(1, 1, footerWidth - 2, footerHeight - 2);
            borderRectangle.LineStyle.LineWidth = 0.5f;
            borderRectangle.ForeColor = System.Drawing.Color.DarkGreen;
            htmlToPdfDocument.Footer.Layout(borderRectangle);
        }
        private PdfPageSize GetSelectedPageSize(string PageName)
        {
            switch (PageName)
            {
                case "A0":
                    return PdfPageSize.A0;
                case "A1":
                    return PdfPageSize.A1;
                case "A10":
                    return PdfPageSize.A10;
                case "A2":
                    return PdfPageSize.A2;
                case "A3":
                    return PdfPageSize.A3;
                case "A4":
                    return PdfPageSize.A4;
                case "A5":
                    return PdfPageSize.A5;
                case "A6":
                    return PdfPageSize.A6;
                case "A7":
                    return PdfPageSize.A7;
                case "A8":
                    return PdfPageSize.A8;
                case "A9":
                    return PdfPageSize.A9;
                case "ArchA":
                    return PdfPageSize.ArchA;
                case "ArchB":
                    return PdfPageSize.ArchB;
                case "ArchC":
                    return PdfPageSize.ArchC;
                case "ArchD":
                    return PdfPageSize.ArchD;
                case "ArchE":
                    return PdfPageSize.ArchE;
                case "B0":
                    return PdfPageSize.B0;
                case "B1":
                    return PdfPageSize.B1;
                case "B2":
                    return PdfPageSize.B2;
                case "B3":
                    return PdfPageSize.B3;
                case "B4":
                    return PdfPageSize.B4;
                case "B5":
                    return PdfPageSize.B5;
                case "Flsa":
                    return PdfPageSize.Flsa;
                case "HalfLetter":
                    return PdfPageSize.HalfLetter;
                case "Ledger":
                    return PdfPageSize.Ledger;
                case "Legal":
                    return PdfPageSize.Legal;
                case "Letter":
                    return PdfPageSize.Letter;
                case "Letter11x17":
                    return PdfPageSize.Letter11x17;
                case "Note":
                    return PdfPageSize.Note;
                default:
                    return PdfPageSize.A4;
            }
        }
        private PdfPageOrientation GetSelectedPageOrientation(string PageOrientation)
        {
            return (PageOrientation == "Portrait") ?
                PdfPageOrientation.Portrait : PdfPageOrientation.Landscape;
        }
    }
}