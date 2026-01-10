/*
 * Pattern name...: RFQ_InWork_Review.aspx
 * Descriptions...: RFQ 搜尋階段明細表
 * Modify.........: P2019002 19/03/22 by Estelle 正式上線 
 * Modify.........: P2020006 20/07/08 by Owen 搜尋階段明細表加入批次成本分析
 * Modify.........: P2020006 20/07/08 by Owen 搜尋階段明細表加入工程師欄位
 * Modify.........: P2025005 25/06/04 by Owen 搜尋階段明細表加入成本分析修改日期、取消欄位合併、依據傳入MFG產出報表
 * Modify.........: P2025011 25/08/04 by Owen 搜尋階段明細表架構調整並調整匯出資料
 */
 
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Web.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Text.RegularExpressions;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.SS.UserModel;
using System.Text;
/*
DataTable dt = new DataTable();

// Must be 16 columns
dt.Columns.Add("College");
dt.Columns.Add("Major");
dt.Columns.Add("SchoolRanking");
dt.Columns.Add("MajorRanking");
dt.Columns.Add("AvgNetCost");
dt.Columns.Add("Location");
dt.Columns.Add("AvgAcceptanceRate");
dt.Columns.Add("MajorAcceptanceRate");
dt.Columns.Add("SAT25");
dt.Columns.Add("SAT75");
dt.Columns.Add("YourSAT");
dt.Columns.Add("YourECL");
dt.Columns.Add("AvgAid");
dt.Columns.Add("Scholarship");
dt.Columns.Add("DiningRanking");
dt.Columns.Add("AvgLivingCost");

// Add data
dt.Rows.Add(
    "MIT",
    "Computer Science",
    "1",
    "1",
    "$18,000",
    "Cambridge, MA",
    "7%",
    "6%",
    "1450",
    "1570",
    "1500",
    "Strong",
    "$45,000",
    "Yes",
    "Top 5",
    "$22,000"
);

// Works with your existing method
ExportExcel(dt);
*/

/*
Issue	Result
Wrong column count	IndexOutOfRangeException
Wrong order	Data under wrong headers
Null values	.ToString() throws
More than 16 columns	Header styling breaks
Different encoding expectations	Row height miscalculation
*/
public partial class Default4 : System.Web.UI.Page
{

    #region NPOI Excel匯出
    private void ExportExcel(DataTable DataTableTotal)
    {
        HttpContext MyHttpContext = HttpContext.Current;
        MyHttpContext.Response.ContentType = "application/vnd.ms-excel";
        MyHttpContext.Response.ContentEncoding = Encoding.UTF8;
        MyHttpContext.Response.Charset = "";
        MyHttpContext.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("Collegio", Encoding.UTF8));
        MyHttpContext.Response.BinaryWrite(RFQSUM(DataTableTotal).GetBuffer());
        MyHttpContext.Response.End();
    }

    private MemoryStream RFQSUM(DataTable DataTableTotal)
    {
        HSSFWorkbook MyHSSFWorkbook = new HSSFWorkbook();
        HSSFSheet MyHSSFSheet = (HSSFSheet)MyHSSFWorkbook.CreateSheet("SearchPrice");
        HSSFPatriarch patr = (HSSFPatriarch)MyHSSFWorkbook.GetSheetAt(MyHSSFWorkbook.ActiveSheetIndex).CreateDrawingPatriarch();
        HSSFRow MyHSSFRow;
        //HSSFCell MyHSSFCell;
        //MyHSSFSheet.CreateFreezePane(3, 1);///凍結欄位
        //MyHSSFSheet.AddMergedRegion(new CellRangeAddress(2, 3, 0, 2));  //合併儲存格
        //儲存格框線
        HSSFCellStyle MyHSSFCellStyle01 = (HSSFCellStyle)MyHSSFWorkbook.CreateCellStyle();
        MyHSSFCellStyle01.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle01.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle01.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle01.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle01.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;
        MyHSSFCellStyle01.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;
        MyHSSFCellStyle01.WrapText = true;

        //文字水平、垂直置中儲存格框線
        HSSFCellStyle MyHSSFCellStyle02 = (HSSFCellStyle)MyHSSFWorkbook.CreateCellStyle();
        MyHSSFCellStyle02.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle02.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle02.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle02.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle02.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;
        MyHSSFCellStyle02.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;
        MyHSSFCellStyle02.WrapText = true;
        HSSFFont font02 = (HSSFFont)MyHSSFWorkbook.CreateFont();
        font02.FontHeightInPoints = 12;    //字的大小

        MyHSSFCellStyle02.SetFont(font02);

        HSSFCellStyle MyHSSFCellStyle03 = (HSSFCellStyle)MyHSSFWorkbook.CreateCellStyle();
        MyHSSFCellStyle03.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle03.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle03.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle03.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
        MyHSSFCellStyle03.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;
        MyHSSFCellStyle03.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
        MyHSSFCellStyle03.WrapText = true;
        HSSFFont font03 = (HSSFFont)MyHSSFWorkbook.CreateFont();
        font03.Color = NPOI.HSSF.Util.HSSFColor.Red.Index;    //字的顏色
        MyHSSFCellStyle03.SetFont(font03);

        MyHSSFRow = (NPOI.HSSF.UserModel.HSSFRow)MyHSSFSheet.CreateRow(0);
        MyHSSFRow.CreateCell(0);

        MyHSSFSheet.CreateRow(0).HeightInPoints = 40;
        MyHSSFSheet.SetColumnWidth(0, 15 * 256);
        MyHSSFSheet.SetColumnWidth(1, 15 * 256);
        MyHSSFSheet.SetColumnWidth(2, 15 * 256);
        MyHSSFSheet.SetColumnWidth(3, 15 * 256);
        MyHSSFSheet.SetColumnWidth(4, 25 * 256);
        MyHSSFSheet.SetColumnWidth(5, 15 * 256);
        MyHSSFSheet.SetColumnWidth(6, 15 * 256);
        MyHSSFSheet.SetColumnWidth(7, 15 * 256);
        MyHSSFSheet.SetColumnWidth(8, 25 * 256);
        MyHSSFSheet.SetColumnWidth(9, 25 * 256);
        MyHSSFSheet.SetColumnWidth(10, 15 * 256);
        MyHSSFSheet.SetColumnWidth(11, 15 * 256);
        MyHSSFSheet.SetColumnWidth(12, 15 * 256);
        MyHSSFSheet.SetColumnWidth(13, 12 * 256);
        MyHSSFSheet.SetColumnWidth(14, 15 * 256);
        MyHSSFSheet.SetColumnWidth(15, 12 * 256);

        //MyHSSFSheet.SetColumnWidth(16, 15 * 256);
        MyHSSFSheet.GetRow(0).CreateCell(0).SetCellValue("College");
        MyHSSFSheet.GetRow(0).CreateCell(1).SetCellValue("Major");
        MyHSSFSheet.GetRow(0).CreateCell(2).SetCellValue("School Ranking");
        MyHSSFSheet.GetRow(0).CreateCell(3).SetCellValue("School Major Ranking");
        MyHSSFSheet.GetRow(0).CreateCell(4).SetCellValue("AVG Net Cost");
        MyHSSFSheet.GetRow(0).CreateCell(5).SetCellValue("Location");
        MyHSSFSheet.GetRow(0).CreateCell(6).SetCellValue("AVG Acceptance Rate");
        MyHSSFSheet.GetRow(0).CreateCell(7).SetCellValue("Major Acceptance Rate");
        MyHSSFSheet.GetRow(0).CreateCell(8).SetCellValue("25% SAT");
        MyHSSFSheet.GetRow(0).CreateCell(9).SetCellValue("75% SAT");
        MyHSSFSheet.GetRow(0).CreateCell(10).SetCellValue("Your SAT");
        MyHSSFSheet.GetRow(0).CreateCell(11).SetCellValue("Your ECL");
        MyHSSFSheet.GetRow(0).CreateCell(12).SetCellValue("AVG Aid");
        MyHSSFSheet.GetRow(0).CreateCell(13).SetCellValue("Scholarship");
        MyHSSFSheet.GetRow(0).CreateCell(14).SetCellValue("Dining Hall Ranking");
        MyHSSFSheet.GetRow(0).CreateCell(15).SetCellValue("AVG 1yr Living Cost");



        for (int j = 0; j < DataTableTotal.Columns.Count; j++)
        {
            MyHSSFSheet.GetRow(0).GetCell(j).CellStyle = MyHSSFCellStyle02;

        }

        Int32 RowNumber = 1;

        foreach (DataRow MyTableRFQ in DataTableTotal.Rows)
        {

            MyHSSFRow = (NPOI.HSSF.UserModel.HSSFRow)MyHSSFSheet.CreateRow(RowNumber);
            if (RowNumber == 0)
            {
                MyHSSFRow.Height = 200;
            }
            else
            {
                for (int i = 0; i < DataTableTotal.Columns.Count; i++)
                {
                    MyHSSFRow.CreateCell(i).SetCellValue(MyTableRFQ[i].ToString());
                    MyHSSFRow.GetCell(i).CellStyle = MyHSSFCellStyle01;

                    //int length = Encoding.UTF8.GetBytes(currentCell.ToString()).Length;
                    MyHSSFRow.HeightInPoints = 20 * 2;
                    //MyHSSFRow.Height = 300;
                }
                //wrapped text can fully display instead of being cut off.
                string descript = MyHSSFRow.GetCell(4).ToString();
                int length = Encoding.UTF8.GetBytes(descript).Length;
                MyHSSFRow.HeightInPoints = 20 * (length / 25 + 1);
            }



            RowNumber++;
        }
        using (MemoryStream MyMemoryStream = new MemoryStream())
        {
            MyHSSFWorkbook.Write(MyMemoryStream);
            MyMemoryStream.Flush();
            MyMemoryStream.Position = 0;

            return MyMemoryStream;
        }
    }

    public HSSFCellStyle SetWaterBorderStyle(HSSFCellStyle oStyle)
    {
        //設定儲存格框線
        oStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
        oStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        oStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
        oStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
        oStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;
        oStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
        oStyle.BottomBorderColor = NPOI.HSSF.Util.HSSFColor.Black.Index;
        oStyle.LeftBorderColor = NPOI.HSSF.Util.HSSFColor.Black.Index;
        oStyle.RightBorderColor = NPOI.HSSF.Util.HSSFColor.Black.Index;
        oStyle.TopBorderColor = NPOI.HSSF.Util.HSSFColor.Black.Index;
        return oStyle;
    }

    #endregion
    //------------------Add by Owen 2025/8/4 P2025011------------↑

}