var _doctorId;
var _panelId;
var _rateListId;
var _IsHeirarch='N';
var _IsPayable='N';
$(document).ready(function () {
    $('select').select2();
    LoadPanel();
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
                LinkItemToPanel(tbody.find('.selected').data('itemid'));
                break;
            case (KeyCode = 32):
                $('#txtDBSearch').val($(this).val() + ' ');
                break;
            default:
                ItemSearch('RateForce:ItemSearch');
                break;
        }
    });
    $('#tblItemInfo tbody').on('click', 'button', function () {
        $('#tblItemInfo tbody').find('tr.selected').removeClass('selected');
        $(this).closest('tr').addClass('selected');
        LinkItemToPanel($(this).closest('tr').data('itemid'));
    });
    $('#tblItemInfo tbody').on('click', 'tr', function () {
        $('#tblItemInfo tbody').find('tr.selected').removeClass('selected');
        $(this).closest('tr').addClass('selected');
        $("#txtDBSearch").focus();
    });
});
function LoadPanel() {
    $('#tblPanel tbody').empty();
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.Logic = "PanelList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var count = 0;
            var Deptname = ""
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += '<tr>';
                        tbody += '<td>' + count + '</td>';
                        tbody += '<td class="hide">' + val.PanelId + '</td>';
                        tbody += '<td class="hide">' + val.RateListId + '</td>';
                        tbody += '<td>' + val.PanelName + '</td>';
                        tbody += '<td><button onclick=PanelInfo(this) class="btn-warning btn-tbl"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $('#tblPanel tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PanelInfo(elem) {
    selectRow($(elem));
    var PanelId = $(elem).closest('tr').find('td:eq(1)').text();
    var RateListId = $(elem).closest('tr').find('td:eq(2)').text();
    var PanelName = $(elem).closest('tr').find('td:eq(3)').text();
    _panelId = PanelId;
    _rateListId = RateListId;
    $('#selectedPanel span').text(PanelName).attr('data-pid', PanelId).attr('data-ratelistid', RateListId).addClass('text-success');
    AllotedItemsToPanel();
}
function GetCategory() {
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.PanelId = '';
    objBO.RateListId = '';
    objBO.DoctorId = '';
    objBO.catid = '';
    objBO.subcatid = '';
    objBO.ItemId = '';
    objBO.prm_1 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'RateForce:CategoryList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet.Table).length) {
                $('#ddlCategory').empty().select2();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlCategory').append($('<option></option>').val(val.CatID).html(val.CatName));
                });
            }
        },
        complete: function () {
            $('#ddlCategory').prop('selectedIndex', '0').change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSubCategory() {
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.PanelId = '';
    objBO.RateListId = '';
    objBO.DoctorId = '';
    objBO.catid = $('#ddlCategory option:selected').val();
    objBO.subcatid = '';
    objBO.ItemId = '';
    objBO.prm_1 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'RateForce:SubCatList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $('#ddlSubCategory').empty().append($('<option>ALL</option>')).change();
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
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.PanelId = '';
    objBO.RateListId = '';
    objBO.DoctorId = '';
    objBO.catid = $('#ddlCategory option:selected').val();
    objBO.subcatid = $('#ddlSubCategory option:selected').val();
    objBO.ItemId = '';
    objBO.prm_1 = $('#txtDBSearch').val();
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
                        tbody += "<td><button onclick=_IsHeirarch='Y';_IsPayable='N' style='height: 15px;line-height:0;' class='btn btn-warning btn-xs'>Hierarchical</button></td>";
                        tbody += "<td><button style='height: 15px;line-height:0;' onclick=_IsHeirarch='N';_IsPayable='Y' class='btn btn-primary btn-xs'>Is Payable</button></td>";
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
function LinkItemToPanel(itemid) {
    if ($('#selectedPanel span').data('pid') == null) {
        alert('Please Select Panel');
        return;
    }
    var url = config.baseUrl + "/api/EDP/PanelRateListLinkInsertUpdate";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.PanelId = _panelId;
    objBO.RateListId = _rateListId;
    objBO.Srno = itemid;
    objBO.Prm1 = _IsHeirarch;
    objBO.Prm2 = _IsPayable;
    objBO.Prm3 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "LinkItemToPanel";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                AllotedItemsToPanel()
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
function AllotedItemsToPanel() {
    $('#tblPanelItemInfo tbody').empty();
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.PanelId = _panelId;
    objBO.RateListId = '';
    objBO.DoctorId = '';
    objBO.catid = '';
    objBO.subcatid = '';
    objBO.ItemId = '';
    objBO.prm_1 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'AllotedItemsToPanel';
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
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;
                    if (temp != val.PanelName) {
                        tbody += '<tr class="bg-warning">';
                        tbody += '<td colspan="4"><b>Panel : </b>' + val.PanelName + '</td>';
                        tbody += '</tr>';
                        temp = val.PanelName;
                    }
                    tbody += '<tr>';
                    tbody += '<td>' + count + '</td>';
                    tbody += '<td class="hide">' + val.AutoId + '</td>';
                    tbody += '<td class="hide">' + val.ItemId + '</td>';
                    tbody += '<td>' + val.ItemName + '</td>';
                    tbody += "<td>";
                    tbody += "<label class='switch'>";
                    tbody += "<input type='checkbox' onchange=UpdateItemStatus(this) class='statusflag' id='chkActive' " + val.IsHeirarch + ">";
                    tbody += "<span class='slider round'></span></label>";
                    tbody += "</td>";
                    tbody += "<td>";
                    tbody += "<label class='switch'>";
                    tbody += "<input type='checkbox' onchange=UpdateItemStatus(this) class='statusflag' id='chkActive' " + val.IsPayable + ">";
                    tbody += "<span class='slider round'></span></label>";
                    tbody += "</td>";
                    tbody += '</tr>';
                });
                $('#tblPanelItemInfo tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateItemStatus(elem) {  
        var url = config.baseUrl + "/api/EDP/PanelRateListLinkInsertUpdate";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.PanelId = _panelId;
        objBO.RateListId = _rateListId;
        objBO.Srno = $(elem).closest('tr').find('td:eq(1)').text();
        objBO.Prm1 = ($(elem).closest('tr').find('td:eq(4)').find('input:checkbox').is(':checked'))?'Y':'N';
        objBO.Prm2 = ($(elem).closest('tr').find('td:eq(5)').find('input:checkbox').is(':checked')) ? 'Y' : 'N';
        objBO.Prm3 = '-';
        objBO.login_id = Active.userId;
        objBO.Logic = "UpdateItemStatus";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    AllotedItemsToPanel()
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
