var _index;
$(document).ready(function () {
    $('#dash-dynamic-section').find('label.title').text('Doctor Visit').show();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    $('select').select2();
    GetDoctor();  
    $('#tblCurrentVisit tbody').on('click', 'button', function () {
        _index = $(this).closest('tr').index();
        BookingInfo($(this).closest('tr').find('td:eq(1)').text());
    });
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
    objBO.Logic = 'DoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlDoctor').empty().append($("<option data-id='Select'></option>").val('Select').html('Select')).select2();
            $.each(data.ResultSet.Table, function (key, val) {
                $("#ddlDoctor").append($("<option></option>").val(val.DoctorId).html(val.DoctorName));
            });
        },
        complete: function () {
            $('#ddlDoctor option').each(function () {
                if ($(this).val() == _doctorId) {
                    $('#ddlDoctor').prop('selectedIndex', '' + $(this).index() + '').change()
                }
            });
            $('#ddlCategory').prop('selectedIndex', '1').change();            
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TodayDoctorVisits() {
    $('#tblCurrentVisit tbody').empty();
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlDoctor option:selected').val();
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'Today:DoctorVisits';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (val.Visitstatus!='Pending')
                            tbody += "<tr style='background:#94e7c1'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td>" + count+ "</td>";
                        tbody += "<td style='display:none'>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td>" + val.Visitstatus + "</td>";
                        if (val.Visitstatus == 'Pending')
                            tbody += "<td><button class='btn btn-warning btn-xs' style='height: 17px;line-height: 0;'><i class='fa fa-plus'>&nbsp;</i>Add</button></td>";
                        else
                            tbody += "<td><button disabled class='btn btn-warning btn-xs' style='height: 17px;line-height: 0;'><i class='fa fa-plus'>&nbsp;</i>Add</button></td>";

                        tbody += "</tr>";
                    });
                    $('#tblCurrentVisit tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BookingInfo(itemId) {  
    var url = config.baseUrl + "/api/IPDNursingService/pIPD_ItemsRate";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.IPDNo = _IPDNo;
    objBO.UHID = $('#tblAdviceHeader tbody').find('tr:eq(5)').find('td:eq(3)').text();
    objBO.DoctorId = $("#ddlDoctor option:selected").val();
    objBO.PanelId = _panelId;
    objBO.CPT_Code = '';
    objBO.RoomBillingCategory = _RoomBillingCategory;
    objBO.SearchType = 'ByCPTCode';
    objBO.ItemIds = itemId;
    objBO.Qty = 1;
    objBO.login_id = Active.userId;
    objBO.Logic = "BookingInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {          
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    ItemInsert(JSON.stringify(data.ResultSet.Table[0]));                    
                }
                else {
                    alert('This Item has no Rate');
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemInsert(data) {
    debugger
    $('#tblCurrentVisit tbody').find('tr:eq(' + _index + ')').find('button').prop('disabled', true);              
    var url = config.baseUrl +  "/api/IPDNursingService/IPD_NursingItemInsert";
    var objBooking = {};
    var objRateList = [];   
        var Info = JSON.parse(data);
        objRateList.push({
            'RateListId': Info.RateListId,
            'ItemId': Info.ItemId,
            'RateListName': Info.RateListName,
            'ItemSection': Info.ItemSection,
            'IsPackage': Info.IsPackage,
            'Rate': Info.mrp_rate,
            'panel_discount': Info.panel_discount,
            'panel_rate': Info.panel_rate,
            'qty': 1,
            'adl_disc_perc': 0,
            'adl_disc_amount': 0,
            'net_amount': parseFloat(Info.panel_rate) - parseFloat(Info.panel_discount),
            'IsUrgent':'N'
        });   
    objBooking.hosp_id = Active.HospId;
    objBooking.IPDNo = _IPDNo;
    objBooking.DoctorId = $("#ddlDoctor option:selected").val();
    objBooking.ipAddress = '-';
    objBooking.login_id = Active.userId;
    objBooking.Logic = "BookingInfo";
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
                GetVisitsBetweenDate();                
                $('#tblCurrentVisit tbody').find('tr:eq(' + _index + ')').css('background', '#94e7c1');
                $('#tblCurrentVisit tbody').find('tr:eq(' + _index + ')').find('td:eq(3)').text('Applied');
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

function GetVisitsBetweenDate() {
    $('#tblAppliedVisits tbody').empty();
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = $('#ddlDoctor option:selected').val();
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'DateWise:DoctorVisits';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var count = 0;
                    var temp = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (temp != val.tnxDate) {
                            tbody += "<tr style='background:#f9eec4'>";         
                            tbody += "<td colspan='4'><b>Applied Date : </b>" + val.tnxDate + "</td>";
                            tbody += "<tr>";
                            temp= val.tnxDate;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.tnxDate + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td>" + val.DoctorName + "</td>";                                               
                        tbody += "</tr>";
                    });
                    $('#tblAppliedVisits tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}


