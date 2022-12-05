$(document).ready(function () {
    OnLoad();
    searchTable('txtSearchRateList', 'tblRateList')
    searchTable('txtSearchCategory', 'tblCategory')
});

function OnLoad() {
    $("#tblRateList tbody").empty();
    $("#tblCategory tbody").empty();
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    var tbody = "";
                    $.each(data.ResultSet.Table2, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td><input type='checkbox'/></td>";
                        tbody += "<td style='display:none'>" + val.RateListId + "</td>";
                        tbody += "<td>" + val.RateListName + "</td>";
                        tbody += "<td><button onclick=selectRow(this);GetSubCatRateByRateListId('" + val.RateListId + "') class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblRateList tbody").append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table5).length > 0) {
                    var tbody1 = "";
                    $.each(data.ResultSet.Table5, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td><input type='checkbox'/></td>";
                        tbody1 += "<td style='display:none'>" + val.ItemId + "</td>";
                        tbody1 += "<td>" + val.SubCatName + "</td>";
                        tbody1 += "<td><input type='text' class='form-control text-right' placeholder='rate'/></td>";
                        tbody1 += "</tr>";
                    });
                    $("#tblCategory tbody").append(tbody1);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSubCatRateByRateListId(prm1) {
    $("#tblCategory tbody").empty();
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.prm_1 = prm1;
    objBO.Logic = "GetSubCatRateByRateListId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {           
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody1 = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td><input type='checkbox'/></td>";
                        tbody1 += "<td style='display:none'>" + val.ItemId + "</td>";
                        tbody1 += "<td>" + val.SubCatName + "</td>";
                        tbody1 += "<td><input type='text' class='form-control text-right' value="+val.rate+" placeholder='rate'/></td>";
                        tbody1 += "</tr>";
                    });
                    $("#tblCategory tbody").append(tbody1);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function RoomChargesUpdate() {
    var url = config.baseUrl + "/api/EDP/PanelItemRateInsertUpdate";
    var objBO = [];
    $('#tblRateList tbody tr').find('input[type=checkbox]:checked').each(function () {
        var RateListId = $(this).closest('tr').find('td:eq(1)').text();
        $('#tblCategory tbody tr').find('input[type=checkbox]:checked').each(function () {
            objBO.push({
                'RateListId': RateListId,
                'ItemId': $(this).closest('tr').find('td:eq(1)').text(),
                'rate': $(this).closest('tr').find('td:eq(3)').find('input:text').val(),
                'ExtItemCode': '-',
                'ExtItemName': '-',
                'RoomBillCategory': $(this).closest('tr').find('td:eq(2)').text(),
                'hosp_id': Active.HospId,
                'login_id': Active.userId,
                'Logic': 'RoomChargesUpdate',
            });
        });
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Success') {
                alert(data);
                $('table tbody').find('input[type=checkbox]').prop('checked', false);
                $('table tbody').find('input[type=text]').val('');
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