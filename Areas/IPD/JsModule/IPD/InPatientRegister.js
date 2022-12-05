var _ActivePageName;
$(document).ready(function () {
    CloseSidebar();
    FloorAndPanelList();
    $('select').select2();
    FillCurrentDate('txtSearchFrom');
    FillCurrentDate('txtSearchTo');
   _ActivePageName = window.location.pathname.split('/')[3].toLowerCase()
});
function FloorAndPanelList() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'FloorAndPanelList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlFloor').append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlFloor').append($('<option></option>').val(val.FloorName).html(val.FloorName));
                    });
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    $('#ddlPanel').append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlPanel').append($('<option></option>').val(val.PanelId).html(val.PanelName));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AdmittedPatientList(logic) {
    $('#tblServiceRegister tbody').empty();
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.Floor = $('#ddlFloor option:selected').val();
    objBO.PanelId = $('#ddlPanel option:selected').val();
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {           
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";                   
                    $.each(data.ResultSet.Table, function (key, val) {                        
                        if (val.PaymentStatus =='Zero-Advance')
                            tbody += "<tr style='background:#ffb9b9'>";
                        else if (val.PaymentStatus == 'Below-Threshold')
                            tbody += "<tr style='background:#f2fba6'>";
                        else
                            tbody += "<tr>";

                        if (_ActivePageName=='ipd_nursingpatientregister')
                            tbody += "<td><button onclick=NursingGateway('" + val.IPDNo + "') class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        else if (_ActivePageName == 'ipd_billingpatientregister')
                            tbody += "<td><button onclick=BillingGateway('" + val.IPDNo + "') class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        else if (_ActivePageName == 'ipd_doctorpatientregister')
                            tbody += "<td><button onclick=DoctorGateway('" + val.IPDNo + "') class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";

                        tbody += "<td>" + val.UHID + "</td>";
                        tbody += "<td>" + val.IPDNo+"</td>";
                        tbody += "<td>" + val.patient_name+"</td>";
                        tbody += "<td>" + val.ageInfo+"</td>";
                        tbody += "<td>" + val.AdmitDate+"</td>";
                        tbody += "<td>" + val.roomFullName+"</td>";
                        tbody += "<td>" + val.PanelName+"</td>";
                        tbody += "<td>" + val.DepartmentName+"</td>";
                        tbody += "</tr>";
                    });
                    $('#tblServiceRegister tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function NursingGateway(ipdNo) {
    //SM229 --Nursing Ward 
    var url = "GatewayNursing?mid=SM229&IPDNo=" + ipdNo;
    window.location.href = url;
}
function DoctorGateway(ipdNo) {
    //SM229 --Nursing Ward 
    var url = "GatewayDoctor?mid=SM264&IPDNo=" + ipdNo;
    window.location.href = url;
}
function BillingGateway(ipdNo) {
    //SM229 --Nursing Ward 
    var url = "GatewayBilling?mid=SM263&IPDNo=" + ipdNo;
    window.location.href = url;
}