var _tnxid = "";
var _vacantLogic = "";
$(document).ready(function () {
    LoadRoomTypes();   
    getCurrentDateTime();      
    $('#tblRoomType tbody').on('click', 'button', function () {
        selectRow(this);
        var RoomType = $(this).closest('tr').find('td:eq(0)').text();
        BedAvailability(RoomType);
    });
    $('#ddlFloorForFilter').on('change', function () {
        var floor = $(this).find('option:selected').text().toLowerCase();
        if (floor == 'all') {
            $('#listBed h3').filter(function () {
                $(this).toggle($(this).data('floor').toLowerCase().indexOf('') > -1);
            });
            $('#listBed li').filter(function () {
                $(this).toggle($(this).data('floor').toLowerCase().indexOf('') > -1);
            });
            return
        };
        $('#listBed h3').filter(function () {
            $(this).toggle($(this).data('floor').toLowerCase().indexOf(floor) > -1);
        });
        $('#listBed li').filter(function () {
            $(this).toggle($(this).data('floor').toLowerCase().indexOf(floor) > -1);
        });
    });
    $('ul[id=listBed]').on('click', 'label.Vacant', function () {
        var roomBedId = $(this).closest('li').find('#RoomBedId').text();
        var roomBedName = $(this).closest('li').find('#RoomBedName').text();
        var RoomBillingCategory = $(this).closest('li').find('#RoomBillingCategory').text();
        if (_vacantLogic == 'RoomShifting') {
            $('#txtRoomBedId').text(roomBedId);
            $('#txtRoomBedName').text(roomBedName);
            $('#tblAdviceHeader tbody').find('tr:eq(1)').find('td:eq(9)').text(roomBedName);
            $('ul[id=listBed] li').removeClass('selectedBed');
            $(this).closest('li').addClass('selectedBed');
        }
        if (_vacantLogic == "IPDReg") {
            $('ul[id=listBed] li').removeClass('selectedBed');
            $(this).closest('li').addClass('selectedBed');
            $('#txtRoomBedId').val(roomBedId);
            $('#txtRoomBedName').val(roomBedName);
            $('#modalBedAvailability').modal('hide');
            $('#ddlBillingCategory option').map(function () {
                if ($(this).text() == RoomBillingCategory)
                    $('#ddlBillingCategory').prop('selectedIndex', '' + $(this).index() + '').change();
            });
        }
    });
});
function getCurrentDateTime() {
    var url = config.baseUrl + "/api/IPDNursing/IPD_RegistrationQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.DoctorId = '';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = '';
    objBO.Logic = 'GetCurrentDateTime';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $('#txtAdmissionDate').val(val.CurrDate.split('T')[0]);
                $('#txtAdmissionTime').val(val.CurrDate.split('T')[1].substring(0, 5));
            });

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function LoadRoomTypes() {
    $('#tblRoomType tbody').empty();
    var url = config.baseUrl + "/api/IPDNursing/IPD_RegistrationQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.DoctorId = '';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = '';
    objBO.Logic = 'All';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {                       
                if (Object.keys(data.ResultSet.Table5).length) {
                    var tbody = "";
                    var count = 0;
                    var total = 0;
                    var booked = 0;
                    var reserved = 0;
                    var vacant = 0;
                    $.each(data.ResultSet.Table5, function (key, val) {
                        count++;
                        total += val.total;
                        booked += val.booked;
                        reserved += val.reserved;
                        vacant += val.vacant;
                        tbody += "<tr>";
                        tbody += "<td>" + val.RoomType + "</td>";
                        tbody += "<td class='text-center'>" + val.total + "</td>";
                        tbody += "<td class='text-center'>" + val.booked + "</td>";
                        tbody += "<td class='text-center'>" + val.vacant + "</td>";
                        tbody += "<td><button class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblRoomType tbody').append(tbody);
                    $('#listTotal').find('div.status:eq(0)').find('label.total').find('label').text(total);
                    $('#listTotal').find('div.status:eq(1)').find('label.total').find('label').text(booked);
                    $('#listTotal').find('div.status:eq(2)').find('label.total').find('label').text(vacant);
                }                
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
function BedAvailability(roomType) {
    $('#listBed').empty();
    var url = config.baseUrl + "/api/IPDNursing/IPD_RegistrationQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.DoctorId = '';
    objBO.Prm1 = roomType;
    objBO.Prm2 = '';
    objBO.login_id = '';
    objBO.Logic = 'BedAvailability';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                var listBed = "";
                var temp = "";
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.groupName) {
                            listBed += "<h3 class='bed-group' data-floor='" + val.FloorName + "'><b>Room Type : </b>" + val.groupName + "</h3>";
                            temp = val.groupName;
                        }

                        if (val.roomStatus != 'Vacant')
                            listBed += "<li data-floor='" + val.FloorName + "' style='pointer-events:none'>";
                        else
                            listBed += "<li data-floor='" + val.FloorName + "'>";

                        listBed += "<div class='status'>";
                        //listBed += "<i class='fa fa-bed'>&nbsp;</i>";
                        if (val.roomStatus =='Vacant')
                            listBed += "<img src='/Content/logo/bedEmpty.png' />";
                        else
                            listBed += "<img src='/Content/logo/bedPatient.png' />";

                        listBed += "<label class=" + val.roomStatus + ">" + val.roomStatus + "</label>";
                        listBed += "</div>";

                        listBed += "<div class='info'>";
                        listBed += "<div id='RoomBedId' style='display:none'>" + val.RoomBedId + "</div>";
                        listBed += "<div id='RoomBedName' style='display:none'>" + val.roomFullName + "</div>";
                        listBed += "<div id='RoomBillingCategory' style='display:none'>" + val.RoomBillingCategory + "</div>";
                        listBed += "<div><b>Bed No. :</b>" + val.RoomAndBedNo + "</div>";
                        listBed += "<div><b>IPD No. :</b> " + val.IPDNo + "</div>";
                        listBed += "<div><b>Name :</b> " + val.patient_name + "</div>";
                        listBed += "</div>";

                        listBed += "</li>";
                    });
                    $('#listBed').append(listBed);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BedAvailabilityTotal(total) {
    $('#listBed').empty();
    var url = config.baseUrl + "/api/IPDNursing/IPD_RegistrationQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.DoctorId = '';
    objBO.Prm1 = total;
    objBO.Prm2 = '';
    objBO.login_id = '';
    objBO.Logic = 'BedAvailabilityTotal';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                var listBed = "";
                var temp = "";
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.groupName) {
                            listBed += "<h3 class='bed-group' data-floor='" + val.FloorName + "'><b>Room Type : </b>" + val.groupName + "</h3>";
                            temp = val.groupName;
                        }

                        if (val.roomStatus != 'Vacant')
                            listBed += "<li data-floor='" + val.FloorName + "' style='pointer-events:none'>";
                        else
                            listBed += "<li data-floor='" + val.FloorName + "'>";

                        listBed += "<div class='status'>";
                        if (val.roomStatus == 'Vacant')
                            listBed += "<img src='/Content/logo/bedEmpty.png' />";
                        else
                            listBed += "<img src='/Content/logo/bedPatient.png' />";
                        listBed += "<label class=" + val.roomStatus + ">" + val.roomStatus + "</label>";
                        listBed += "</div>";

                        listBed += "<div class='info'>";
                        listBed += "<div id='RoomBedId' style='display:none'>" + val.RoomBedId + "</div>";
                        listBed += "<div id='RoomBedName' style='display:none'>" + val.roomFullName + "</div>";
                        listBed += "<div id='RoomBillingCategory' style='display:none'>" + val.RoomBillingCategory + "</div>";
                        listBed += "<div><b>Bed No. :</b>" + val.RoomAndBedNo + "</div>";
                        listBed += "<div><b>IPD No. :</b> " + val.IPDNo + "</div>";
                        listBed += "<div><b>Name :</b> " + val.patient_name + "</div>";
                        listBed += "</div>";

                        listBed += "</li>";
                    });
                    $('#listBed').append(listBed);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    $('#ddlFloorForFilter').empty().append($('<option>ALL</option>')).change();
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlFloorForFilter').append($('<option></option>').val(val.FloorName).html(val.FloorName));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}