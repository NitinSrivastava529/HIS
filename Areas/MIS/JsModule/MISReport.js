
$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    CloseSidebar();
    $('#btnXLReport').on('click', function () {
        MIS_Report();
    });
});
function DropDownBinding() {

   
    var url = config.baseUrl + "/api/IPOPAudit/MIS_Report";
    var objBO = {};
    objBO.DoctorId = "";
    objBO.tnxType = "";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.CatId = "-";
    objBO.SubCatId = "-";
    objBO.Logic = "MasterList";
    objBO.OutPutType = "data";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#ddlTnxType').empty().append($('<option value="ALL" selected="selected" >ALL</option>'));
            $('#ddlDoctorName').empty().append($('<option value="ALL" selected="selected" >ALL</option>'));
            $('#ddlCat').empty().append($('<option value="ALL" selected="selected" >ALL</option>'));
            $('#ddlSubCat').empty().append($('<option value="ALL" selected="selected">ALL</option>'));
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlDoctorName').append($('<option></option>').val(val.DoctorId).html(val.DoctorName)).select2();
                });
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#ddlCat').append($('<option></option>').val(val.CatId).html(val.CategoryName)).select2();
                });
                $.each(data.ResultSet.Table2, function (key, val) {
                    $('#ddlSubCat').append($('<option></option>').val(val.SubCatId).html(val.SubCatName)).select2();
                });
                $.each(data.ResultSet.Table2, function (key, val) {
                    $('#ddlSubCat').append($('<option></option>').val(val.SubCatId).html(val.SubCatName)).select2();
                });
                $.each(data.ResultSet.Table3, function (key, val) {
                    $('#ddlTnxType').append($('<option></option>').val(val.DeptName).html(val.DeptName)).select2();
                });
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DropDownCaseMix() {
    var url = config.baseUrl + "/api/IPOPAudit/MIS_Report";
    var objBO = {};
    objBO.DoctorId = "";
    objBO.tnxType = "";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.CatId = "-";
    objBO.SubCatId = "-";
    objBO.Logic = "CaseMixType";
    objBO.OutPutType = "data";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlCaseType').empty().append($('<option value="ALL" selected="selected" >ALL</option>'));
            $('#ddlYear').empty().append($('<option value="ALL" selected="selected" >ALL</option>'));
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlCaseType').append($('<option></option>').val(val.caseType).html(val.caseType)).select2();
                });
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#ddlYear').append($('<option></option>').val(val.YearName).html(val.YearName)).select2();
                });
              
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function MIS_Report() {
    $('#spnStatus').html("Loding......")
    var url = config.baseUrl + "/api/IPOPAudit/MIS_Report";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var FileName = $('#ddlLogic').val() +".xlsx";
    var objBO = {};
    objBO.DoctorId = $('#ddlDoctorName').val();
    objBO.tnxType = $('#ddlTnxType').val();
    objBO.from = from;
    objBO.to = to;
    objBO.CatId = $('#ddlCat').val();
    objBO.SubCatId = $('#ddlSubCat').val();;
    objBO.Logic = $('#ddlLogic').val();
    objBO.OutPutType = "Excel";
    Global_DownloadExcel(url, objBO, FileName);
    $('#spnStatus').html("")
}
function MIS_ReportCaseMix() {
    var url = config.baseUrl + "/api/IPOPAudit/MIS_Report";
    var objBO = {};
    objBO.DoctorId = "";
    objBO.tnxType = "";
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.CatId = $('#ddlCaseType').val();
    objBO.SubCatId = $('#ddlYear').val();;
    objBO.Logic = "MixCase-Report";
    objBO.OutPutType = "Excel";
    Global_DownloadExcel(url, objBO, "Report.xlsx");
}