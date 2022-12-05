$(document).ready(function () {
    $('.deathSection').hide();
    GetCurrentDateTime();
    SummarisedBilling();
    $('#dash-dynamic-section').find('label.title').text('IPD Manager Clearance').show();
    $('select').select2();   
    $('#ddlDischargeType').on('change', function () {
        var val = $(this).find('option:selected').text();       
        if (val == 'Death')
            $('.deathSection').slideDown();
        else
            $('.deathSection').slideUp();
    });
});
function GetCurrentDateTime() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetCurrentDateTime';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('input[type=datetime-local]').val(val.currentDate);
                    });
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        if (val.IsDischargeInit == 'Y') {
                            $('.IsDischargeInit').text('Discharge Initiated By Doctor.').addClass('text-success');
                            $('#btnDischarge').removeClass('disabled');
                        } else {
                            $('.IsDischargeInit').text('Discharge is not Initiated By Doctor.').addClass('text-danger');
                            $('#btnDischarge').addClass('disabled');
                        }
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SummarisedBilling() {   
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
    objBO.Prm1 = '-';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'SummarisedBilling';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtGrossAmt').val(val.GrossAmount.toFixed(2));
                        $('#txtPDiscount').val(val.panel_discount.toFixed(2));
                        $('#txtAdlDiscount').val(val.adl_discount.toFixed(2));
                        $('#txtDiscount').val(val.Discount.toFixed(2));
                        $('#txtNetAmt').val(val.NetAmount.toFixed(2));
                        $('#txtAdvanceAmt').val(val.AdvanceAmount.toFixed(2));
                        $('#txtBalanceAmt').val(val.BalanceAmount.toFixed(2));
                        $('#txtApprovalAmt').val(val.ApprovalAmount.toFixed(2));
                    });
                }
            }          
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SaveDischargeStatus() {
    if (confirm('Are you sure to Discharge?')) {

        var url = config.baseUrl + "/api/IPDNursingService/IPD_InsertDischargeStatus";
        var objBO = {};
        objBO.IPDNo = _IPDNo;
        objBO.discharge_Init_date = $('#txtDischargeDate').val();
        objBO.InitCallBy = Active.userName;
        objBO.DischargeType = $('#ddlDischargeType option:selected').text();
        objBO.DischargeDate = $('#txtDischargeDate').val();
        objBO.DeathDateTime = $('#txtDeathDateTime').val();
        objBO.CauseOfDeath = $('#txtCauseOfDeath').val();
        objBO.TypeOfDeath = $('#ddlTypeOfDeath option:selected').text();
        objBO.Remark = $('#txtDeathRemark').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "IPDManager";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    $('.deathSection').hide();
                    $('.deathSection input').val('');
                    $('.deathSection textarea').val('');
                    $('#ddlDischargeType').prop('selectedIndex', '0').change();
                    $('#ddlTypeOfDeath').prop('selectedIndex', '0').change();
                    GetCurrentDateTime();
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
}