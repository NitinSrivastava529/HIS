$(document).ready(function () {
    $('.title').hide();
    _vacantLogic = "RoomShifting";
});
function IPDRoomShift() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_RoomAndDoctorShift";
    var objBO = {};
    objBO.IPDNo = _IPDNo;
    objBO.RoomBedId = $('#txtRoomBedId').text();
    objBO.RoomBillingCategory = '-';
    objBO.RoomChangeDateTime = $('#txtAdmissionDate').val() + ' ' + $('#txtAdmissionTime').val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'RoomShifting';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(9)').text($('#txtRoomBedName').text());
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