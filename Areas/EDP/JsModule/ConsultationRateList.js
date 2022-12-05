var _doctorId;
$(document).ready(function () {
    searchTable('txtSearch', 'tblDoctorsList');
    searchTable('txtSearchRateList', 'tblPanels');
    searchTable('txtSearchPanelRateList', 'tblPanelRateList');
    BindDoctorList('Y');
    $('table thead').on('change', 'input:checkbox', function () {
        var isCheck = $(this).is(':checked');       
        if (isCheck)
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', true);
        else
            $(this).parents('table').find('tbody').find('input:checkbox').prop('checked', false);
    });
});
function BindDoctorList(status) {
    $('#tblDoctorsList tbody').empty();
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = status;
    objBO.prm_2 = '-';
    objBO.Logic = "GetDoctorsList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var Deptname = ""
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (Deptname != val.DepartmentName) {
                            tbody += '<tr>';
                            tbody += '<td colspan="4" style="font-weight:bold;background:#fbead1">' + val.DepartmentName + '</td>';
                            tbody += '</tr>';
                            Deptname = val.DepartmentName;
                        }
                        tbody += '<tr>';
                        tbody += '<td>' + val.DoctorId + '</td>';
                        tbody += '<td>' + val.DoctorName + '</td>';
                        tbody += '<td><button class="btn-warning btn-tbl" onclick=selectRow(this);GetRateRoomVisit("' + val.DoctorId + '")><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $('#tblDoctorsList tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRateRoomVisit(doctorId) {
    _doctorId = doctorId;
    $('#tblPanels tbody').empty();
    $('#tblRoomType tbody').empty();
    $('#tblVisit tbody').empty();
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.prm_1 = $("input[name='status']:checked").val();
    objBO.prm_2 = '-';
    objBO.login_id = Active.userId;
    objBO.doctorId = doctorId;
    objBO.Logic = "OnLoadBindRateRoomVisit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmlPanels, htmlRoom, htmlVisit;
            htmlPanels = htmlRoom = htmlVisit = "";
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmlPanels += '<tr>';
                    htmlPanels += '<td><input id="chkpnl" data-ratelistid="' + val.RateListId + '" type="checkbox" class="pnlchk"> </td>';
                    htmlPanels += '<td>' + val.RateListName + '</td>';
                    htmlPanels += '<td><a href="javascript:void(0)" onclick=GetPanelRateList(' + "'" + val.RateListId + "'" + ')><i class="fa fa-eye fa-lg text-red"></i></a></td>';
                    htmlPanels += '</tr>';
                });
                $('#tblPanels tbody').append(htmlPanels);
            }
            if (data.ResultSet.Table1.length > 0) {

                $.each(data.ResultSet.Table1, function (key, val) {
                    htmlRoom += '<tr>';
                    htmlRoom += '<td><input id="chkRoom" data-billingcategory="' + val.BillingCategory + '" type="checkbox" class="roomchk"> </td>';
                    htmlRoom += '<td>' + val.BillingCategory + '</td>';
                    htmlRoom += '</tr>';
                });
                $('#tblRoomType tbody').append(htmlRoom);
            }
            if (data.ResultSet.Table2.length > 0) {
                $.each(data.ResultSet.Table2, function (key, val) {
                    htmlVisit += '<tr>';
                    htmlVisit += '<td><input id="chkvisit" data-itemid="' + val.item_id + '" type="checkbox" class="checkbox" checked="checked"> </td>';
                    htmlVisit += '<td style="width:30%">' + val.SubCatName + '</td>';
                    htmlVisit += '<td><input type="text" onkeypress="return isNumberKey(event)" value=' + val.rate + ' maxlength="4" style="width:80%"  class="form-control text-right"/></td>';
                    htmlVisit += '</tr>';
                });
                $('#tblVisit tbody').append(htmlVisit);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SaveRateList() {
    var docId = _doctorId;
    if (docId == "" || typeof docId == 'undefined') {
        alert('Please select doctor from doctor list');
        return false;
    }
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.doctorId = _doctorId;
    var RateListData = []
    $('#tblPanels tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            var pnlids = $(this).find('td:eq(0)').find('input').data('ratelistid');
            var types = "RateList";
            var Rate = "0";
            RateListData.push({ ids: pnlids.toString(), typeval: types, Rates: Rate });
        }
    });
    $('#tblRoomType tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            var billcatids = $(this).find('td:eq(0)').find('input').data('billingcategory');
            var types = "Room";
            var Rate = "0";
            RateListData.push({ ids: billcatids, typeval: types, Rates: Rate });
        }
    });
    $('#tblVisit tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            var itemid = $(this).find('td:eq(0)').find('input').data('itemid');
            var types = "Rates";
            var Rate = $(this).find('td:eq(2)').find('input').val();
            RateListData.push({ ids: itemid, typeval: types, Rates: Rate });
        }
    });

    if (RateListData.length == 0) {
        alert('Please load the record first');
        return false;
    }

    objBO.lstarrvalues = JSON.stringify(RateListData);
    var url = config.baseUrl + "/api/master/mInsertDoctorRateList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            $('input:checkbox').removeAttr('checked');
            $("input:text").val("");
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPanelRateList(RateListId) {
    var url = config.baseUrl + "/api/master/DoctorMasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.prm_1 = RateListId;
    objBO.Logic = "GetDoctorRateListByPanel";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata, roombillcategory;
            htmldata = roombillcategory = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblPanelRateList').show();
                $('#tblPanelRateList tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    if (roombillcategory != val.RoomBillingCategory) {
                        htmldata += '<tr class="uprow">';
                        htmldata += '<td colspan="4" style="font-weight:bold;background-color:#d1ebfb">' + val.RoomBillingCategory + '</td>';
                        htmldata += '</tr>';
                        roombillcategory = val.RoomBillingCategory;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.SubCatName + '</td>';
                    htmldata += '<td>' + val.rate + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblPanelRateList tbody').append(htmldata);
            }
            else {
                $('#tblPanelRateList').show();
                $('#tblPanelRateList tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                $('#tblPanelRateList tbody').append(htmldata);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
