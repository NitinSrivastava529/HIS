$(document).ready(function () {
    CloseSidebar();
    Onload();
    searchTable('txtSeachRatePanel', 'tblRatePanelDetails');
    $("select").select2();
});

function Onload() {
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
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCategory").append($("<option></option>").val("0").html("Please Select")).select2();
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.CatID).html(value.CatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select")).select2();
                    $("#ddlSubCategory").append($("<option selected></option>").val("ALL").html("ALL"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    $("#ddlRateList").append($("<option></option>").val("0").html("Please Select")).select2();
                    //$("#ddlRateList").append($("<option selected></option>").val("ALL").html("ALL"));
                    $.each(data.ResultSet.Table2, function (key, value) {
                        $("#ddlRateList").append($("<option></option>").val(value.RateListId).html(value.RateListName));
                    });
                }
                //if (Object.keys(data.ResultSet.Table4).length > 0) {
                //    //Room Type
                //}
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BindSubCategory() {
    var catid = $("#ddlCategory option:selected").val();
    if (catid != "0") {
        var url = config.baseUrl + "/api/EDP/PanelRateQueries";
        var objBO = {};
        objBO.Logic = "GetSubCategoryByCategory";
        objBO.catid = catid;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {

                $("#ddlSubCategory").empty();
                if (Object.keys(data.ResultSet).length > 0) {
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select"));
                        $("#ddlSubCategory").append($("<option selected></option>").val("ALL").html("ALL"));
                        $.each(data.ResultSet.Table, function (key, value) {
                            $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                        });
                    }
                }
                else {
                    MsgBox('No Data Found')
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
    else {
        alert('Please select  category');
        return false;
    }
}
function GetItemRateList() {
    $("#tblRatePanelDetails tbody").empty();
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.Logic = "SearchItemRateList";
    objBO.RateListId = $("#ddlRateList option:selected").val();
    objBO.subcatid = $("#ddlSubCategory option:selected").val();
    objBO.prm_1 = $("#ddlRoomType option:selected").val();
    objBO.catid = $("#ddlCategory option:selected").val();
    if (ValidateRatePanel()) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var htmldata = "";
                if (Object.keys(data.ResultSet).length > 0) {
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        $.each(data.ResultSet.Table, function (k, v) {

                            htmldata += '<tr>';
                            htmldata += '<td><a class="btn btn-warning btn-xs" href="javascript:void(0)" data-roombillcat=' + v.RoomBillingCategory + ' data-rateid=' + v.RateListId + ' id="btnEdit' + k + '" onclick="selectRow(this);UpdateItemRateListSingle(this)">Update</a ></td>';
                            htmldata += '<td>' + parseInt(k + 1) + '</td>';
                            htmldata += '<td>' + v.ItemId + '</td>';
                            htmldata += '<td>' + v.ItemName + '</td>';
                            htmldata += '<td>' + v.RoomBillingCategory + '</td>';
                            htmldata += '<td><input type="text" value="' + v.GenRate + '" style="width:70%" /></td>';
                            htmldata += '<td><input type="text" value="' + v.rate + '" style="width:70%" /></td>';
                            htmldata += '<td><input type="text" value="' + v.ext_itemname + '" style="width:100%" /></td>';
                            htmldata += '<td><input type="text" value="' + v.ext_itemCode + '" style="width:100%" /></td>';
                            htmldata += '</tr>';
                        });
                        $("#tblRatePanelDetails tbody").append(htmldata);
                    }
                    else {
                        $("#tblRatePanelDetails tbody").empty();
                        htmldata += '<tr>';
                        htmldata += '<td colspan="10" style="color:red;"> No Data Found</td>';
                        htmldata += '</tr>';
                        $("#tblRatePanelDetails tbody").append(htmldata);
                    }
                }
                else {
                    MsgBox('No Data Found')
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }

}
function InsertUpdateRateList() {
    var url = config.baseUrl + "/api/EDP/PanelItemRateInsertUpdate";
    var objBO = [];
    $('#tblRatePanelDetails tbody tr').each(function () {
        var rate = $(this).find("td:eq(6) input").val();
        if (rate != '') {
            objBO.push({
                'RateListId': $(this).closest('tr').find('td:eq(0)').find('a').data('rateid'),
                'ItemId': $(this).closest('tr').find("td:eq(2)").text(),
                'rate': $(this).closest('tr').find("td:eq(6) input").val(),
                'ItemCode': $(this).closest('tr').find("td:eq(8) input").val(),
                'ItemName': $(this).closest('tr').find("td:eq(7) input").val(),
                'RoomBillCategory': $(this).closest('tr').find('td:eq(0)').find('a').data('roombillcat'),
                'hosp_id': Active.HospId,
                'login_id': Active.userId,
                'Logic': 'Insert',
            });
        }  
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var splitval = data.split('|');
            if (splitval[0] == '1' && splitval[1] == 'success') {
                alert('PanelItemRate List created successfully');
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
function UpdateItemRateListSingle(element) {
    var url = config.baseUrl + "/api/EDP/PanelItemRateInsertUpdate";
    var objBO = [];
    if ($(element).closest('tr').find("td:eq(6) input").val() == '') {
        alert('Please Provide Rate.');
        return
    }
    objBO.push({
        'RateListId': $(element).data('rateid'),
        'ItemId': $(element).closest('tr').find("td:eq(2)").text(),
        'rate': $(element).closest('tr').find("td:eq(6) input").val(),
        'ItemCode': $(element).closest('tr').find("td:eq(8) input").val(),
        'ItemName': $(element).closest('tr').find("td:eq(7) input").val(),
        'RoomBillCategory': $(element).data('roombillcat'),
        'hosp_id': Active.HospId,
        'login_id': Active.userId,
        'Logic': 'Insert',
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var splitval = data.split('|');
            if (splitval[0] == '1' && splitval[1] == 'success') {
                alert('PanelItemRate List created successfully');
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
function ValidateRatePanel() {
    var ratelist = $("#ddlRateList option:selected").val();
    var subcatid = $("#ddlSubCategory option:selected").val();
    if (ratelist == "0") {
        alert('Please select rate list');
        return false;
    }
    if (subcatid == "0") {
        alert('Please select sub category id');
        return false;
    }
    return true;
} 

