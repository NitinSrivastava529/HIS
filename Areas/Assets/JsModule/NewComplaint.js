
$(document).ready(function () {
    AssetsQueries();
    $('#txtSearchComplaint').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblEqComplaint tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblEqComplaint tbody').on('click', '.complaint', function () { 
        GetFilterComplaintByEqNo($(this).data('eqno'));
    });
    $('#btnSaveComplaint').on('click', function () {
        var compl = $('#txtComplaint').val();
        if (compl != '') {
            $('#txtComplaint').removeAttr('style');
            insertIntoComplaints();
            $('#txtComplaint').val('');
        }
        else {           
            $('#txtComplaint').css('border-color', 'red');
            alert('Please Fill Complaints..');
        }
       
    });
    $('#btnFilterByEq').on('click', function () {
        var Eq = $('#txtEqNo').val();
        if (Eq != '') {
            GetFilterComplaintByEqNo(Eq);
        }
        else {
            alert('Please Fill Equipment Number..');
            $('#txtEqNo').css('border-color','red');
        }
    });
    $('#btnDownloadExcel').on('click', function () {
        AssetUnderHeadExcel();
    });
});

function AssetsQueries() {
    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "GetAssetsComplaint";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblEqComplaint tbody").empty();
            if (data != '') {             
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.DeptName + '</td><td>' + val.SectionName + '</td><td>' + val.eq_no + '</td> <td>' + val.eq_category + '</td>' +
                        '<td class="btn text-green complaint" data-dept="' + val.DeptName + '" data-note="' + val.note + '" data-section="' + val.SectionName + '" data-eqno="' + val.eq_no + '" data-eqcategory="' + val.eq_category + '" data-description="' + val.eq_description + '">' +
                        '<span class="fa fa-arrow-right"></span></td></tr>').appendTo($("#tblEqComplaint tbody"));
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetAssetsComplaintByEqNo(Eq) {
    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.eq_no =Eq;
    objBO.Logic = "GetAssetsComplaintByEqNo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblAssetsComplaint tbody").empty();            
            if (data != '') {              
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.Compl_code + '</td><td>' + val.Complaint + '</td><td>' + val.cr_date + '</td><td>' + val.close_date + '</td><td>' + val.Client_status + '</td><td>' + val.Amount + '</td></tr>').appendTo($("#tblAssetsComplaint tbody"));                                                
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetFilterComplaintByEqNo(Eq) {
    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.eq_no = Eq;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetAssetsComplaintByEqNo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblAssetsComplaint tbody").empty();
            if (data != '') {             
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('span[data-dept]').text(val.DeptName);
                    $('span[data-section]').text(val.SectionName);
                    $('span[data-eqno]').text(val.eq_no);
                    $('span[data-eqcategory]').text(val.eq_category);
                    $('span[data-description]').text(val.eq_description);
                    $('span[data-note]').html(val.note); 
                    if (val.enable_button == 'N') {                       
                        $('#btnSaveComplaint').attr('disabled', true);
                    }
                    else {
                        $('#btnSaveComplaint').removeAttr('disabled');
                    }
                    GetAssetsComplaintByEqNo(Eq);
                    $('#txtEqNo').val('');
                });
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function insertIntoComplaints() {
    var url = config.baseUrl + "/api/Asset/insertIntoComplaints";
    var objBO = {};
    objBO.EmpCode = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.EqNo = $('span[data-eqno]').text();
    objBO.Complaint = $('#txtComplaint').val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {          
            if (data != '') {                       
                alert(data);
                GetAssetsComplaintByEqNo($('span').data('eqno').text());

            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AssetUnderHeadExcel()
{
    var url = config.baseUrl + "/api/Asset/AssetUnderHeadExcel";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "MovementReportByHead";
    Global_DownloadExcel(url, objBO, "AssetUnderHead.xlsx");
   
}
