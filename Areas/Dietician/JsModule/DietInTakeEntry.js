var _IPDNo
$(document).ready(function () {
    FillCurrentDate('txtInputDate');
    GetPatientDetails();
    $('#txtSearchPatient').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#IPDPatientList .section').filter(function () {
            $(this).toggle($(this).data('name').toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#ddlRoom').on('change', function () {
        _SelectedFloor = this.value;
        updateFilters();
        totalCount();
    });
    $('input[name=New]').on('change', function () {
        if ($(this).is(':checked'))
            _SelectedNew = this.value;
        else
            _SelectedNew = 'ALL';
        updateFilters();
        totalCount();
    });
    $('#tblScheduledInfo tbody').on('keyup', 'input:text', function () {
        var IntakePerc = $(this).val();
        if ($(this).closest('tr').hasClass('intakeDiet')) {
            if (parseFloat(IntakePerc) > 100) {
                $(this).val('');
                return
            }
            $(this).parents('tr.intakeDiet').nextUntil('.intakeDiet').each(function () {
                var qty = parseFloat($(this).find('td:eq(5)').text());
                var fluid = parseFloat($(this).find('td:eq(6)').data('fluid'));
                var IntakeQty = qty * IntakePerc / 100;
                var fluidPerc = fluid * IntakePerc / 100;
                $(this).find('td:eq(6)').text(fluidPerc.toFixed(2));
                $(this).find('td:eq(7)').find('input:text').val(IntakeQty.toFixed(2));
            });
        }
        else {
            var itemQty = parseFloat($(this).val());
            var qty = parseFloat($(this).closest('tr').find('td:eq(5)').text());
            if (itemQty > qty)
                $(this).val(0.00);
        }
        totalFluidCal();
    });
    $('#ddlRoomType').on('change', function () {
        _SelectedRoomType = this.value;
        updateFilters();
        totalCount();
    });
});
function GetPatientDetails() {
    $('#IPDPatientList').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = '-';
    objBO.from = $('#txtInputDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetPatientInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var count = 0;
            var totalCount = 0;
            var html = ""; var room = []; var roomType = [];
            $.each(data.ResultSet.Table, function (key, val) {
                totalCount++;
                room.push(val.FloorName);
                roomType.push(val.RoomType);
                if (val.IsDischarged == "Y")
                    html += "<div  class='section dischargeInfo'  data-ipd='" + val.IPDNo + "' data-name='" + val.PatientName + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";
                else if (val.IsDietscheduled == "N")
                    html += "<div style='background:#def3e8' class='section dischargeInfo' data-new='New'  data-ipd='" + val.IPDNo + "' data-name='" + val.PatientName + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";
                else
                    html += "<div class='section' data-ipd='" + val.IPDNo + "' data-name='" + val.PatientName + "' data-roomtype='" + val.RoomType + "' data-floor='" + val.FloorName + "'>";

                html += "<label style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</label>";
                html += "<img src='/images/new.png' class='newRemark'/>";
                html += "<table class='table'>";
                if (val.IsDietscheduled == "N") {
                    html += "<tr>";
                    html += "<td colspan='7' style='text-align:left'><span class='NewPatientBlock'><i class='fa fa-check-circle'>&nbsp;</i>New Admission</span></td>";
                    html += "<tr>";
                }

                if (val.IsDischarged == "Y") {
                    html += "<tr>";
                    html += "<td colspan='7' style='text-align:right'><button data-ipdno='" + val.IPDNo + "' class='btn btn-info btn-xs pull-right' onclick=ExitFromDiet(this)><i class='fa fa-eye'>&nbsp;</i>Exit Diet&nbsp;&nbsp;</button></td>";
                    html += "<tr>";
                }
                html += "<tr>";
                html += "<td>IPD No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.IPDNo + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Patient Name</th>";
                html += "<td>:</th>";
                html += "<td>" + val.PatientName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Age</th>";
                html += "<td>:</th>";
                html += "<td>" + val.Age + "</td>";
                html += "<td style='display:none'>" + val.Gender + "</td>";
                html += "<td>&nbsp</th>";
                html += "<td>Room No</th>";
                html += "<td>:</th>";
                html += "<td>" + val.RoomName + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Admitted Under</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'>" + val.DoctorName + "</td>";
                html += "</tr>";

                html += "<tr>";
                html += "<td>Admit Date</th>";
                html += "<td>:</th>";
                html += "<td colspan='5'><span1>" + val.AdmitDate + "</span1> Discharge : <span1>" + val.DischargeDateTime + "</span1><span2 style='display:none'>" + val.DoctorId + "</span2><span3 style='display:none'>" + val.FloorName + "</span3>";
                html += "<span class='text-right' style='margin: -4px 0;float:right'>";
                html += "<button data-ipd=" + val.IPDNo + " class='btn btn-success btn-xs pull-right' onclick=GetDietInfo(this)><i class='fa fa-eye'>&nbsp;</i>View</button>";
                html += "</span>";
                html += "</td>";
                html += "</tr>";
                html += "</tr>";
                html += "<tr>";
                html += "<td colspan='7' id='dietscheduled'>";
                if (val.DietCategories != null) {
                    var DietCategory = val.DietCategories.split(',');
                    if (DietCategory.length > 0) {
                        for (var i = 0; i < DietCategory.length; i++)
                            html += "<span class='dietScheduled'><i class='fa fa-check-circle'>&nbsp;</i>" + DietCategory[i] + "</span>";
                    }
                }
                html += "</td>";
                html += "</tr>";
                //Remark Block
                html += "<tr style='background:#f7d6d6'>";
                html += "<td><b>Remark</b></td>";
                html += "<td>:</td>";
                html += "<td colspan='5'>" + val.Remark;             
                html += "<button data-ipd=" + val.IPDNo + " class='btn btn-warning btn-xs pull-right' onclick=GetDietInfo(this)><i class='fa fa-eye'>&nbsp;</i>Ack</button>";              
                html += "</td>";
                html += "</tr>";
                html += "</tr>";

                html += "</table>";
                html += "</div>";
                count++;
            });
            $('#IPDPatientList').append(html);
            $('#ddlRoom').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique = room.filter(function (itm, i, room) {
                return i == room.indexOf(itm);
            });
            for (i = 0; i < unique.length; i++) {
                var data = '<option>' + unique[i] + '</option>'
                $('#ddlRoom').append(data);
            }

            $('#ddlRoomType').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
            var unique1 = roomType.filter(function (itm, i, room) {
                return i == roomType.indexOf(itm);
            });
            for (i = 0; i < unique1.length; i++) {
                var data = '<option>' + unique1[i] + '</option>'
                $('#ddlRoomType').append(data);
            }
            $('#totaFilterCount').text('Total : ' + totalCount);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDietInfo(elem) {
    $(elem).parents('#IPDPatientList').find('.section*').removeClass('selected');
    $(elem).parents('.section').addClass('selected');
    _IPDNo = $(elem).data('ipd');
    GetScheduledDietInfo($(elem).data('ipd'));
    $('#txtScheduleDate').trigger('change');
    $('#modalSchedule').modal('show');
}
function GetScheduledDietInfo(ipdNo) {
    $('#tblScheduledInfo tbody').empty();
    var url = config.baseUrl + "/api/Dietician/diet_DiticianQueries";
    var objBO = {};
    objBO.IPDNo = ipdNo;
    objBO.from = $('#txtInputDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetDietInfoForInTakeEntry';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var temp = "";
            var count = 0;
            var counter = 0;
            $.each(data.ResultSet.Table, function (key, val) {
                count++;
                if (temp != val.DietName) {
                    if (counter > 0) {
                        counter = 0;
                        tbody += "<tr style='background:#ddd' class='total'>";
                        tbody += "<td colspan='2'><b>Total<b></td>";
                        tbody += "<td><b>-</b></td>";
                        tbody += "<td class='text-right'><b>0</b></td>";
                        tbody += "<td><b>-</b></td>";
                        tbody += "</tr>";
                        _fluidValue = 0;

                    }
                    count = 1;
                    tbody += "<tr style='background:#fff1be' class='intakeDiet'>";
                    tbody += "<td colspan='5'><b>Diet Name : </b>" + val.DietName;
                    tbody += "<span class='flex pull-right' style='height:16px;width:19%'>";
                    tbody += "<input type='text' class='form-control InTakeValue' maxlength='3'/>";
                    tbody += "<button onclick=InsertDietEntry(this) class='btn btn-success InTakeBtn'>Save</button>";
                    tbody += "</span>";
                    tbody += "</td>";
                    tbody += "</tr>";
                    temp = val.DietName;
                    counter++;
                }
                if (eval(val.InTake) > 0)
                    tbody += "<tr style='background:#a3efc8'>";
                else
                    tbody += "<tr class='data'>";

                tbody += "<td>" + count + "</td>";
                tbody += "<td style='display:none'>" + val.RequestId + "</td>";
                tbody += "<td style='display:none'>" + val.DietId + "</td>";
                tbody += "<td style='display:none'>" + val.ItemId + "</td>";
                tbody += "<td>" + val.ItemName + "</td>";
                tbody += "<td class='text-right'>" + val.qty + "</td>";
                tbody += "<td class='text-right' data-fluid=" + val.FluidValue + ">" + val.FluidValue + "</td>";
                tbody += "<td style='padding-left: 4px;'><input type='text' class='form-control InTakeValue' value=" + val.InTake.toFixed(2) + " style='margin: 2px 0;height:17px;width:100%;border-color: #b5b5b5;'/></td>";
                tbody += "</tr>";
            });
            tbody += "<tr style='background:#ddd' class='total'>";
            tbody += "<td colspan='2'><b>Total<b></td>";
            tbody += "<td><b>-</b></td>";
            tbody += "<td class='text-right'><b>0</b></td>";
            tbody += "<td><b>-</b></td>";
            tbody += "</tr>";
            tbody += "<tr style='background:#ffc7c7' class='total'>";
            tbody += "<td colspan='2'><b>Overall Total<b></td>";
            tbody += "<td><b>-</b></td>";
            tbody += "<td class='text-right'><b>0</b></td>";
            tbody += "<td><b>-</b></td>";
            tbody += "</tr>";
            $('#tblScheduledInfo tbody').append(tbody);
        },
        complete: function () {
            totalFluidCal();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function totalFluidCal() {
    var fluidPerc = 0;
    var AllfluidPerc = 0;
    $('#tblScheduledInfo tbody tr').each(function () {
        if ($(this).hasClass('data')) {
            fluidPerc += parseFloat($(this).find('td:eq(6)').text());
            AllfluidPerc += parseFloat($(this).find('td:eq(6)').text());
        }
        if ($(this).hasClass('total')) {
            $(this).find('td:eq(2)').text(fluidPerc.toFixed(2));
            fluidPerc = 0;
        }
    });
    $('#tblScheduledInfo tbody').find('tr:last').find('td:eq(2)').text(AllfluidPerc.toFixed(2));
}
function InsertDietEntry(elem) {
    var url = config.baseUrl + "/api/Dietician/diet_InsertDietSchedule";
    var objBO = [];
    $('#tblScheduledInfo tbody tr').eq($(elem).closest('tr').index()).nextUntil('.intakeDiet').each(function () {
        objBO.push({
            'IPDNo': _IPDNo,
            'FloorName': $(this).find('td:eq(1)').text(), /*Floor Name Contains RequestId*/
            'RoomNo': '-',
            'BedNo': '-',
            'ServingDate': '1900/01/01',
            'DietCategory': '-',
            'DietId': $(this).find('td:eq(2)').text(),
            'ItemId': $(this).find('td:eq(3)').text(),
            'qty': $(this).find('td:eq(6)').find('input:text').val(),
            'medicalProcedure': '-',
            'Remark': '-',
            'login_id': Active.userId,
            'Logic': 'InsertDietEntry'
        });
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data)
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