$(document).ready(function () {
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    $('select').select2();
    BookingInfoByIPDNo();
    searchTable('txtFilterSearch', 'tblItemInfo');
    $('#dash-dynamic-section').find('label.title').text('Patient Service Booking').show();
    GetCategory();
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var keyCode = evt.keyCode;
        if (keyCode >= 37 && keyCode <= 40) {
            return false;
        }
    };
    var count = 0;
    $('#txtDBSearch').on('keydown', function (e) {        
        var tbody = $('#tblItemInfo').find('tbody');
        var selected = tbody.find('.selected');
        var KeyCode = e.keyCode;
        switch (KeyCode) {
            case (KeyCode = 40):
                count++;
                if (selected.length == 0) {
                    //tbody.find('.selected').removeClass('selected');
                    tbody.find('tr:first').addClass('selected');
                    //$("#ProductList, body").animate({ scrollTop: 0 }, "fast");
                    return false;
                }
                if (selected.next().length == 0) {
                    //tbody.find('.selected').removeClass('selected');
                    tbody.find('tr:last').addClass('selected');
                    //$("#ProductList, body").animate({ scrollTop: 0 }, "fast");
                    return false;
                }
                else {
                    tbody.find('.selected').removeClass('selected');
                    selected.next().addClass('selected');
                }
                if (count > 5) {
                    $('#ProductList').animate({ scrollTop: '+=22px' }, 0);
                }
                break;
            case (KeyCode = 38):
                tbody.find('.selected').removeClass('selected');
                if (selected.prev().length == 0) {
                    tbody.find('tr:first').addClass('selected');
                    count = 0;
                    $("#ProductList, body").animate({ scrollTop: 0 }, "fast");
                }
                else {
                    selected.prev().addClass('selected');
                }
                $('#ProductList').animate({ scrollTop: '-=22px' }, 0);
                break;
            case (KeyCode = 13):
                GetBookingDetails();
                break;
            case (KeyCode = 32):
                $('#txtDBSearch').val($(this).val() + ' ');
                break;
            default:
                ItemSearch('Billing:ItemSearch');
                break;
        }
    });
    $('#tblItemInfo tbody').on('click', 'button', function () {
        $('#tblItemInfo tbody').find('tr.selected').removeClass('selected');
        $(this).closest('tr').addClass('selected');
        GetBookingDetails();
    });
    $('#tblItemInfo tbody').on('click', 'tr', function () {
        $('#tblItemInfo tbody').find('tr.selected').removeClass('selected');
        $(this).closest('tr').addClass('selected');
        $("#txtDBSearch").focus();
    });
});
function searchTable12(txt, tbl) {
    $('#' + txt).on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $(ItemData).filter(function () {
            alert($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
}
function GetBookingDetails() {
    _itemId = $('#tblItemInfo tbody').find('tr.selected').find('td:eq(0)').text();
    var itemIds = [];
    $('#tblBookingInfo tbody tr').each(function () { itemIds.push($(this).find('td:eq(1)').text()) });
    if ($.inArray(_itemId, itemIds) == -1)
        BookingInfo();
    else
        alert('This Item Already Added');
}
function GetCategory() {
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
    objBO.Logic = 'Billing:CategoryList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet.Table).length) {
                $('#ddlCategory').empty().change();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlCategory').append($('<option></option>').val(val.CatID).html(val.CatName));
                });
            }
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
            $('#ddlCategory').prop('selectedIndex', '0').change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSubCategory() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = '';
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlCategory option:selected').val();
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'Billing:SubCatList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $('#ddlSubCategory').empty().append($('<option>ALL</option>')).select2();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlSubCategory').append($('<option></option>').val(val.SubCatID).html(val.SubCatName));
                });
            }
            else {
                //alert('Data Not Found...!');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemSearch(logic) {
    $('#tblItemInfo tbody').empty();
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.Floor = $('#txtDBSearch').val();
    objBO.PanelId = _panelId;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlCategory option:selected').val();
    objBO.Prm2 = $('#ddlSubCategory option:selected').val();
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr class='searchitems' data-itemid=" + val.ItemId + " data-itemname=" + val.ItemName + ">";
                        tbody += "<td style='display:none'>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td><span class='pover'>" + val.SubCatName + "</span></td>";
                        tbody += "<td><button style='height: 15px;line-height:0;' class='btn btn-danger btn-xs'><i class='fa fa-plus'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblItemInfo tbody').append(tbody);
                    //$('#tblItemInfo tbody').find('tr:first').addClass('selected');
                    //$("#tblItemInfo body").animate({ scrollTop: 0 }, "fast");
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function FilterData(data) {
    $('#tblItemInfo tbody').empty();
    var tbody = "";
    $.each(data, function (key, val) {
        tbody += "<tr class='searchitems' data-itemid=" + val.ItemId + " data-itemname=" + val.ItemName + ">";
        tbody += "<td style='display:none'>" + val.ItemId + "</td>";
        tbody += "<td>" + val.ItemName + "</td>";
        tbody += "<td><span class='pover'>" + val.SubCatName + "</span></td>";
        tbody += "<td><button style='height: 15px;line-height:0;' class='btn btn-danger btn-xs'><i class='fa fa-plus'></i></button></td>";
        tbody += "</tr>";
    });
    $('#tblItemInfo tbody').append(tbody);
}
function BookingInfo() {
    // $('#tblBookingInfo tbody').empty();
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
    objBO.ItemIds = _itemId;
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
            var tbody = '';
            var count = 0;
            var counter = $('#tblBookingInfo tbody tr').length + 1;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (parseFloat(val.panel_rate) > 1) {
                            tbody += "<tr>";
                            tbody += "<td style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</td>";
                            tbody += "<td style='display:none'>" + val.ItemId + "</td>";
                            tbody += "<td>" + counter + "</td>";
                            tbody += "<td>" + val.ItemName + "</td>";
                            tbody += "<td><input type='text' style='width:80%;height: 17px;' class='form-control text-right' value='1'/></td>";
                            tbody += "<td><input type='checkbox'/></td>";
                            tbody += "<td><button style='height: 15px;line-height:0;' onclick=$(this).closest('tr').remove() class='btn btn-danger btn-xs'><i class='fa fa-remove'></i></button></td>";
                            tbody += "</tr>";
                            count++;
                        }
                        else {
                            alert('This Item has no Rate');
                        }
                      
                    });
                    $('#tblBookingInfo tbody').append(tbody);
                }
                else {
                    alert('This Item has no Record.');
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BookingInfoByIPDNo() {
    $('#tblServiceBookingInfo tbody').empty();
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
    objBO.Logic = "Billing:IPDBookingInfoByIPDNo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = '';
            var temp = '';
            var count = 0;
            var counter = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        if (temp != val.CatName) {
                            count = 1;
                            tbody += "<tr style='background:#fff1be'>";
                            tbody += "<td colspan='8'><b>Category : </b>" + val.CatName + "</td>";
                            tbody += "</tr>";
                            temp = val.CatName;
                        }
                        if (eval(val.rnk1) > 1)
                            tbody += "<tr style='background:#ff00004f'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td style='display:none'>" + JSON.stringify(data.ResultSet.Table[count]) + "</td>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td>" + val.tnxDate + "</td>";
                        tbody += "<td>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td>" + val.Qty + "</td>";
                        tbody += "<td>" + val.SubCatName + "</td>";

                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td><button style='height: 15px;line-height:0;' class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i>Track Status</button></td>";
                        tbody += "</tr>";
                        count++;
                    });
                    $('#tblServiceBookingInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemInsert() {
    var url = config.baseUrl + "/api/IPDNursingService/IPD_NursingItemInsert";
    var objBooking = {};
    var objRateList = [];
    $('#tblBookingInfo tbody tr').each(function () {
        var Info = JSON.parse($(this).find('td:eq(0)').text());
        objRateList.push({
            'RateListId': Info.RateListId,
            'ItemId': Info.ItemId,
            'RateListName': Info.RateListName,
            'ItemSection': Info.ItemSection,
            'IsPackage': Info.IsPackage,
            'Rate': Info.mrp_rate,
            'panel_discount': Info.panel_discount,
            'panel_rate': Info.panel_rate,
            'qty': $(this).find('td:eq(4)').find('input:text').val(),
            'adl_disc_perc': 0,
            'adl_disc_amount': 0,
            'net_amount': parseFloat(Info.panel_rate) - parseFloat(Info.panel_discount),
            'IsUrgent': ($(this).find('td:eq(5)').find('input:checkbox').is(':checked')) ? 'Y' : 'N'
        });
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
                alert('Successfully Submited');
                BookingInfoByIPDNo();
                $('#tblBookingInfo tbody').empty();
                //$('#ddlSubCategory').prop('selectedIndex', '0');
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


