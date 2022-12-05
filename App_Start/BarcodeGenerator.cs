using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;

namespace MediSoftTech_HIS.App_Start
{
	public class BarcodeGenerator
	{
		public  static string GenerateBarCode(string barcode,int w,int h)
		{
			string BarcodeImage = string.Empty;
			BarcodeLib.Barcode b = new BarcodeLib.Barcode();
			Image img;
			int W = Convert.ToInt32(w);
			int H = Convert.ToInt32(h);
			b.Alignment = BarcodeLib.AlignmentPositions.CENTER;
			BarcodeLib.TYPE type = BarcodeLib.TYPE.UPCA;
			type = BarcodeLib.TYPE.CODE128A;
          
            try
			{
				if (type != BarcodeLib.TYPE.UNSPECIFIED)
				{
					b.IncludeLabel = true;
					// b.RotateFlipType = (RotateFlipType)Enum.Parse(typeof(RotateFlipType), this.cbRotateFlip.SelectedItem.ToString(), true);
					b.LabelPosition = BarcodeLib.LabelPositions.BOTTOMCENTER;				
					img =b.Encode(type, barcode, Color.Black, Color.White, W, H);
				}
				using (MemoryStream memoryStream = new MemoryStream())
				{
					b.Encode(type, barcode, Color.Black, Color.White, W, H).Save(memoryStream, ImageFormat.Png);
					byte[] byteImage = memoryStream.ToArray();
					Convert.ToBase64String(byteImage);
					BarcodeImage = "data:image/png;base64," + Convert.ToBase64String(byteImage);
				}
			}
			catch (Exception ex)
			{
				BarcodeImage = ex.Message;
			}
			return BarcodeImage;
		}
        public static string GenerateBarCode2(string barcode, int w1, int h)
        {
            string BarcodeImage = string.Empty;
            int w = barcode.Length * 40;
            // Create a bitmap object of the width that we calculated and height of 100
            Bitmap oBitmap = new Bitmap(w, h);
            // then create a Graphic object for the bitmap we just created.
            Graphics oGraphics = Graphics.FromImage(oBitmap);
            // Now create a Font object for the Barcode Font
            // (in this case the IDAutomationHC39M) of 18 point size
            Font oFont = new Font("IDAutomationHC39M", 18);
            // Let's create the Point and Brushes for the barcode
            PointF oPoint = new PointF(2f, 2f);
            SolidBrush oBrushWrite = new SolidBrush(Color.Black);
            SolidBrush oBrush = new SolidBrush(Color.White);
            oGraphics.FillRectangle(oBrush, 0, 0, w, 100);
            oGraphics.DrawString("*" + barcode + "*", oFont, oBrushWrite, oPoint);
            MemoryStream memoryStream = new MemoryStream();
            oBitmap.Save(memoryStream,ImageFormat.Png);
            BarcodeImage = "data:image/png;base64," + Convert.ToBase64String(memoryStream.ToArray());
            return BarcodeImage;
        }


    }
}