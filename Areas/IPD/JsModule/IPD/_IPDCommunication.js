var _section;
$(document).ready(function () {
    $('select').select2();
});
function CommunicationLog() {
    $('#modalCommunication').modal('show');
    $('#CommunicationLog').empty();
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingQuerries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.DoctorId = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'CommunicationLog';
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
                        tbody += "<div class='remarkLog'>";
                        tbody += "<label>" + val.RemarkBy + "</label>";
                        tbody += "<p>" + val.Remarks + "</p>";
                        tbody += "</div>";
                    });
                    $('#CommunicationLog').append(tbody);
                    $('#modalCommunication').modal('show');
                    UpdateComLog();
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertComLog() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    objRateList.push({
        'AutoId':0,
        'TnxId': '-',
        'RateListId': '-',
        'CatId': '-',
        'ItemId': '-',
        'RateListName': '-',
        'ItemSection': $('#ddlSection option:selected').text(),
        'IsPackage': '-',
        'IsRateEditable': 'N',
        'IsPatientPayable': 'N',
        'IsDiscountable': 'N',
        'qty': 0,
        'mrp_rate': 0,
        'panel_rate': 0,
        'panel_discount': 0,
        'adl_disc_perc': 0,
        'adl_disc_amount': 0,
        'net_amount': 0,
        'IsUrgent': '-',
        'Remark': $('#txtCommunicationRemark').val()
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "InsertCommunicationLog";
    var MasterObject = {};
    MasterObject.objBooking = objBooking;
    MasterObject.objRateList = objRateList;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(MasterObject),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        traditional: true,
        success: function (data) {
            if (data.includes('Success')) {
                CommunicationLog();
                $('#txtCommunicationRemark').val('');
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
function UpdateComLog() {
    var url = config.baseUrl + "/api/IPDBilling/IPD_BillingInsertModifyItems";
    var objBooking = {};
    var objRateList = [];
    objRateList.push({
        'AutoId': 0,
        'TnxId': '-',
        'RateListId': '-',
        'CatId': '-',
        'ItemId': '-',
        'RateListName': '-',
        'ItemSection': '-',
        'IsPackage': '-',
        'IsRateEditable': 'N',
        'IsPatientPayable': 'N',
        'IsDiscountable': 'N',
        'qty': 0,
        'mrp_rate': 0,
        'panel_rate': 0,
        'panel_discount': 0,
        'adl_disc_perc': 0,
        'adl_disc_amount': 0,
        'net_amount': 0,
        'IsUrgent': '-',
        'Remark': '-'
    });
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = '-';
    objBooking.ipAddress = _section;
    objBooking.login_id = Active.userId;
    objBooking.Logic = "UpdateCommunicationLog";
    var MasterObject = {};
    MasterObject.objBooking = objBooking;
    MasterObject.objRateList = objRateList;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(MasterObject),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        traditional: true,
        success: function (data) {
            if (data.includes('Success')) {    
                GetComSeenCount();
            }            
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
