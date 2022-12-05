var _index;
var _AutoId;
$(document).ready(function () {
    $('#dash-dynamic-section').find('label.title').text('Patient Vital').show();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    $('select').select2();
    GetVitalSign();
    $('#tblVitalSign tbody').on('click', 'button', function () {
        selectRow($(this));
        _AutoId = $(this).closest('tr').find('td:eq(0)').text();
    });
});
function GetVitalSign() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientVital';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $('#tblVitalSign tbody').empty();
                var tbody = "";
                var count = 0;
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;
                    if (temp != val.read_date) {
                        tbody += "<tr style='background:#f7edba'>";
                        tbody += "<td colspan='13'><b>Date : </b>" + val.read_date + "</td>";
                        tbody += "</tr>";
                        temp = val.read_date;
                    }
                    tbody += "<tr>"
                    tbody += "<td style='display:none'>" + val.auto_id + "</td>";
                    tbody += "<td>" + count + "</td>";
                    tbody += "<td>" + val.BP_Sys + '/' + val.BP_Dys + "</td>";
                    tbody += "<td>" + val.Pulse + "</td>";
                    tbody += "<td>" + val.Resp + "</td>";
                    tbody += "<td>" + val.Temprarture + "</td>";
                    tbody += "<td>" + val.HT + "</td>";
                    tbody += "<td>" + val.WT + "</td>";
                    tbody += "<td>-</td>";
                    tbody += "<td>" + val.ArmSpan + "</td>";
                    tbody += "<td>" + val.SittingHeight + "</td>";
                    tbody += "<td>" + val.IBW + "</td>";
                    tbody += "<td>" + val.SPO2 + "</td>";
                    //tbody += "<td>" + val.login_id + "</td>";
                    //tbody += "<td>" + val.read_date + "</td>";
                    tbody += "<td><button onclick=VitalSignForUpdate('" + val.auto_id + "') class='btn-flat btn-warning'>Edit</button></td>";
                    tbody += "</tr>"
                });
                $('#tblVitalSign tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function VitalSignForUpdate(autoid) {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '-';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = autoid;
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientVitalByID';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtBpSys').val(val.BP_Sys);
                    $('#txtBpDys').val(val.BP_Dys);
                    $('#txtPulse').val(val.Pulse);
                    $('#txtResp').val(val.Resp);
                    $('#txtHT').val(val.HT);
                    $('#txtWT').val(val.WT);
                    $('#txtArmSpan').val(val.ArmSpan);
                    $('#txtTemprarture').val(val.Temprarture);
                    $('#txtIBW').val(val.IBW);
                    $('#txtSPO2').val(val.SPO2);
                    $('#txtSittingHeight').val(val.SittingHeight);
                });
                $('#btnSaveVital').text('Update').removeClass('btn-success').addClass('btn-warning');
            }
            else {
                alert('No Record Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertVitalSign() {
    if (_IPDNo == '') {
        alert('IPD No Not Found.');
        return
    }
    var url = config.baseUrl + "/api/Prescription/CPOE_InsertVitalSign";
    var objBO = {};
    objBO.AutoId = _AutoId;
    objBO.RefNo = _IPDNo;
    objBO.UHID = _UHID;
    objBO.DoctorId = _doctorId;
    objBO.EntrySource = 'IPD';
    objBO.BP_Sys = $('#txtBpSys').val();
    objBO.BP_Dys = $('#txtBpDys').val();
    objBO.Pulse = $('#txtPulse').val();
    objBO.Resp = $('#txtResp').val();
    objBO.Temprarture = $('#txtTemprarture').val();
    objBO.HT = $('#txtHT').val();
    objBO.WT = $('#txtWT').val();
    objBO.ArmSpan = $('#txtArmSpan').val();
    objBO.SittingHeight = $('#txtSittingHeight').val();
    objBO.IBW = $('#txtIBW').val();
    objBO.SPO2 = $('#txtSPO2').val();
    objBO.login_id = Active.userId;
    objBO.Logic = ($('#btnSaveVital').text() == 'Save') ? 'Insert' : 'Update';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                GetVitalSign();
                Clear();
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
function Clear() {
    $('input:text').val('');
    $('#btnSaveVital').text('Save').addClass('btn-success').removeClass('btn-warning');
}



