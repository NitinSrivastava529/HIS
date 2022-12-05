
$(document).ready(function () {
    FillCurrentDate('txtFilterFrom')
    FillCurrentDate('txtFilterTo')   
});
function DownloadExcel() {
    var url = config.baseUrl + "/api/Pharmacy/Hospital_Queries";
    var objBO = {};
    objBO.login_id =Active.userId;
    objBO.prm_2 = $('#txtFilterFrom').val();
    objBO.prm_3 = $('#txtFilterTo').val();
    objBO.Logic = "IPDCreditSalebydate";
    objBO.ReportType = 'Excel';   
    Global_DownloadExcel(url, objBO, "IPDCreditSalebydate.xlsx");
}
function PrintInfo() {   
    var from = $('#txtFilterFrom').val();
    var to = $('#txtFilterTo').val();
    var url = "../Print/PrintCreditSale?from=" + from+"&to="+to;
    window.open(url,'_blank')
}
function PrintInfoByIPD() {
    var from = $('#txtFilterFrom').val();
    var to = $('#txtFilterTo').val();
    var url = "../Print/IPDCreditSalebyIPD?ipdno=" + $('#txtSearchIPDNO').val();
    window.open(url, '_blank')
}