$(document).ready(function () {
    $('#dash-dynamic-section').find('label.title').text('Doctor Shifting').show();
    $('select').select2();
    GetDoctor(); 
});
function GetDoctor() {
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
    objBO.Logic = 'Service:CategoryList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlDoctor').empty().append($("<option data-id='Select'></option>").val('Select').html('Select')).select2();
            $.each(data.ResultSet.Table1, function (key, val) {
                $("#ddlDoctor").append($("<option></option>").val(val.DoctorId).html(val.DoctorName));
            });
        },
        complete: function () {
            $('#ddlDoctor option').each(function () {
                if ($(this).val() == _doctorId) {
                    $('#ddlDoctor').prop('selectedIndex', '' + $(this).index() + '').change()
                }
            });          
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DoctorShift() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_RoomAndDoctorShift";
    var objBO = {};   
    objBO.IPDNo = '-';
    objBO.DoctorId = $('#ddlDoctor option:selected').val();
    objBO.RoomBedId = '-';
    objBO.RoomBillingCategory = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.RoomChangeDateTime = '1900/01/01';  
    objBO.login_id = Active.userId;
    objBO.Logic = 'DoctorShifting';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
            }
            else {
                alert(data)
            }
        },       
        error: function (response) {
            alert('Server Error...!');
        }
    });
}



