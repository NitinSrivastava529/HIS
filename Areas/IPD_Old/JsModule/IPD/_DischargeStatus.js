var _InitCallBy;
$(document).ready(function () {  
    GetCurrentDateTime();
    GetDischargeInfo();
    $('.SecondGroup').on('click', 'button.btnSave', function () {
        SaveDischargeStatus($(this));
    });
});
function GetCurrentDateTime() {
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
                        $('.Status').find('input[type=datetime-local]').val(val.currentDate);
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDischargeInfo() {    
    $('.DischargeStatus').find('.Status').find('.lblStatus').text('Pending');
    $('.DischargeStatus').find('.Status').addClass('UnAuthorized').removeClass('Authorized');
    if ($('.Status.proceed').length == 0)
        $('.Status:first').addClass('proceed'); 
    else
        $('.Status.proceed').removeClass('proceed'); 
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
    objBO.Logic = 'GetDischargeInfoByIPDNo';
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
                        if (val.Discharge_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(0)').find('.lblStatusDateTime').html(val.Discharge_DateTime);
                            $('.DischargeStatus').find('.Status:eq(0)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(0)').addClass('Done');                                                                               
                        }
                        if (val.RMO_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(1)').find('.lblStatusDateTime').html(val.RMO_DateTime);
                            $('.DischargeStatus').find('.Status:eq(1)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(1)').addClass('Done'); 
                        }
                        if (val.Consult_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(2)').find('.lblStatusDateTime').html(val.Consult_DateTime);
                            $('.DischargeStatus').find('.Status:eq(2)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(2)').addClass('Done'); 
                        }
                        if (val.Medicine_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(3)').find('.lblStatusDateTime').html(val.Medicine_DateTime);
                            $('.DischargeStatus').find('.Status:eq(3)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(3)').addClass('Done'); 
                        }
                        if (val.Nursing_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(4)').find('.lblStatusDateTime').html(val.Nursing_DateTime);
                            $('.DischargeStatus').find('.Status:eq(4)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(4)').addClass('Done'); 
                        }
                        if (val.IPDManger_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(5)').find('.lblStatusDateTime').html(val.IPDManger_DateTime);
                            $('.DischargeStatus').find('.Status:eq(5)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(5)').addClass('Done');                            
                        }
                        if (val.Pharmacy_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(6)').find('.lblStatusDateTime').html(val.Pharmacy_DateTime);
                            $('.DischargeStatus').find('.Status:eq(6)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(6)').addClass('Done');
                        }
                        if (val.Billing_DateTime != null) {
                            $('.DischargeStatus').find('.Status:eq(7)').find('.lblStatusDateTime').html(val.Billing_DateTime);
                            $('.DischargeStatus').find('.Status:eq(7)').find('.lblStatus').text('Done');
                            $('.DischargeStatus').find('.Status:eq(7)').addClass('Done');
                        }                    
                    });
                }
            }
        },
        complete: function () {      
      
            if (_InitCallBy == 'Nursing') {
                $('.DischargeStatus').find('.Status:eq(0)').removeClass('UnAuthorized').addClass('Authorized');
                $('.DischargeStatus').find('.Status:eq(3)').removeClass('UnAuthorized').addClass('Authorized');
                $('.DischargeStatus').find('.Status:eq(4)').removeClass('UnAuthorized').addClass('Authorized');

                $('.DischargeStatus').find('.Status:eq(0)').find('.btnSave').text('Save');
                $('.DischargeStatus').find('.Status:eq(3)').find('.btnSave').text('Save');
                $('.DischargeStatus').find('.Status:eq(4)').find('.btnSave').text('Save');
                $('.Status.Done:last').next('.Status').addClass('proceed');
                $('.Status.proceed').find('.btnSave').addClass('unlock');

            }
            if (_InitCallBy == 'RMO') {
                $('.DischargeStatus').find('.Status:eq(1)').removeClass('UnAuthorized').addClass('Authorized');   
                $('.DischargeStatus').find('.Status:eq(2)').removeClass('UnAuthorized').addClass('Authorized');  

                $('.DischargeStatus').find('.Status:eq(1)').find('.btnSave').text('Save');
                $('.DischargeStatus').find('.Status:eq(2)').find('.btnSave').text('Save');            
                $('.Status.Done:last').next('.Status').addClass('proceed');
                $('.Status.proceed').find('.btnSave').addClass('unlock');
            }           
            if (_InitCallBy == 'IPDManager') {
                $('.DischargeStatus').find('.Status:eq(5)').removeClass('UnAuthorized').addClass('Authorized');
                $('.DischargeStatus').find('.Status:eq(5)').find('.btnSave').text('Save');  
                $('.Status.Done:last').next('.Status').addClass('proceed');
                $('.Status.proceed').find('.btnSave').addClass('unlock');
            }           
            if (_InitCallBy == 'IPDBilling') {
                $('.DischargeStatus').find('.Status:eq(6)').removeClass('UnAuthorized').addClass('Authorized');
                $('.DischargeStatus').find('.Status:eq(7)').removeClass('UnAuthorized').addClass('Authorized');
                $('.Status.Done:last').next('.Status').addClass('proceed');

                $('.DischargeStatus').find('.Status:eq(6)').find('.btnSave').text('Save');  
                $('.DischargeStatus').find('.Status:eq(7)').find('.btnSave').text('Save'); 
                $('.Status.Done:last').next('.Status').addClass('proceed');
                $('.Status.proceed').find('.btnSave').addClass('unlock');
            }    
            //if ($('.Status.Authorized.proceed').length == 0)
            //    $('.Status.Authorized:first').addClass('proceed');
            //else
            //    $('.Status.Authorized').next('.Status').addClass('proceed');



            //$('.Status.Authorized').each(function () {
                
            //});               
            //else
            //    $('.Status.proceed').removeClass('Authorized'); 
            //$('.DischargeStatus').find('.Status').each(function () {
            //    if ($(this).find('button').text() == 'Lock')
            //        $(this).find('button').addClass('disabled');
            //    else
            //        $(this).find('button').removeClass('disabled');
            //});
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SaveDischargeStatus(elem) {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_InsertDischargeStatus";
    var objBO = {};
    objBO.IPDNo = _IPDNo;
    objBO.discharge_Init_date = $('.DischargeStatus').find('input[type=datetime-local]').val();
    objBO.InitCallBy = Active.userName;
    objBO.DischargeType = '-';
    objBO.DischargeDate = '1900/01/01';
    objBO.DeathDateTime = '1900/01/01';
    objBO.CauseOfDeath = '-';
    objBO.TypeOfDeath = '-';
    objBO.Remark = $(elem).closest('.Status').find('.SecondGroup').find('input:text').val();  
    objBO.login_id = Active.userId;
    objBO.Logic = $(elem).data('callby');
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                //alert(data);
                GetDischargeInfo();
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