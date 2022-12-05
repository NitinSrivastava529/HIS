
$(document).ready(function () {
    GetDispatchLabInfo();
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
   
});



function GetDispatchLabInfo() {
    var url = config.baseUrl + "/api/Lab/LabOutSourceQueries";
    var objBO = {};
    objBO.subcatId = $('#ddlCategory option:selected').val();
    objBO.prm1 = "Y";
    objBO.logic = "GetTestBySubCategory";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    //$("#ddlCategory").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.LabCode).html(value.LabName)).select2();
                    });
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDispatchInfoByDate() {
    var url = config.baseUrl + "/api/Lab/SampleLabReceivingQueries";
    var objBO = {}
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.DispatchLabCode = $('#ddlCategory option:selected').val();
    objBO.Logic = "GetDispatchInfoToReceiveByDate";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblDispatch tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.LabCode + "</td>";                        
                        tbody += "<td>" + val.DispatchNo + "</td>";
                        tbody += "<td>" + val.dispatch_date + "</td>";
                        tbody += "<td>" + val.Status + "</td>";
                        tbody += "<td class='text-right'>" + val.Nos + "</td>";
                        tbody += "<td><button class='btn-warning' onclick=GetPatientDispatch('" + val.DispatchNo + "')>View</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDispatch tbody').append(tbody);
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDispatchInfoToReceive() {
    var url = config.baseUrl + "/api/Lab/SampleLabReceivingQueries";
    var objBO = {}
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = $('#ddlCategory option:selected').val();
    objBO.Logic = "GetDispatchInfoToReceive";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblDispatch tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;                 
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.LabCode + "</td>";                        
                        tbody += "<td>" + val.DispatchNo + "</td>";
                        tbody += "<td>" + val.dispatch_date + "</td>";
                        tbody += "<td>" + val.Status + "</td>";
                        tbody += "<td class='text-right'>" + val.Nos + "</td>";
                        tbody += "<td><button class='btn-warning' onclick=GetPatientDispatch('" + val.DispatchNo + "')>View</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDispatch tbody').append(tbody);
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDispatch(DispatchNo) {   
    var url = config.baseUrl + "/api/Lab/SampleLabReceivingQueries";
    var objBO = {}
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.DispatchNo = DispatchNo;
    objBO.Logic = "GetPatientInDispatch";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblPatientDetail tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.VisitNo + "</td>";
                        tbody += "<td>" + val.barcodeNo + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td>" + val.TestDeetail + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblPatientDetail tbody').append(tbody);
                  
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
