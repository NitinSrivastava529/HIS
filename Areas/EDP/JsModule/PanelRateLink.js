$(document).ready(function () {  
    CloseSidebar();
    Onload();
    searchTable('txtSearch', 'tblRateLinkDetails');
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
                if (Object.keys(data.ResultSet.Table2).length > 0) {       
                    $("#ddlRateList").empty().append($("<option></option>").val("0").html("Select")).select2();
                    $("#ddlBulkRatePanel").empty().append($("<option></option>").val("0").html("Select")).select2();
                    $("#ddlRateListCopyTo").empty().append($("<option></option>").val("0").html("Select")).select2();
                    $.each(data.ResultSet.Table2, function (key, value) {
                        $("#ddlRateList").append($("<option></option>").val(value.RateListId).html(value.RateListName));
                        $("#ddlBulkRatePanel").append($("<option></option>").val(value.RateListId).html(value.RateListName));
                        $("#ddlRateListCopyTo").append($("<option></option>").val(value.RateListId).html(value.RateListName));
                    });
                }
                if (Object.keys(data.ResultSet.Table3).length > 0) {
                    $("#ddlPanel").empty().append($("<option></option>").val("0").html("Select")).select2();
                    $("#ddlPanel").append($("<option></option>").val("All").html("All")).select2();
                    $.each(data.ResultSet.Table3, function (key, value) {
                        $("#ddlPanel").append($("<option></option>").val(value.PanelId).html(value.PanelName));
                    });
                }
                if (Object.keys(data.ResultSet.Table4).length > 0) {
                    $("#ddlRateListCopyFrom").empty().append($("<option></option>").val("0").html("Select")).select2();
                    $.each(data.ResultSet.Table4, function (key, value) {
                        $("#ddlRateListCopyFrom").append($("<option></option>").val(value.RateListId).html(value.RateListName));
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
function CopyRateList() {
    if (validateCopyRateList()) {
        var url = config.baseUrl + "/api/EDP/PanelRateListLinkInsertUpdate";
        var objBO = {};
        objBO.PanelId = $("#ddlRateListCopyFrom option:selected").val();
        objBO.RateListId = $("#ddlRateListCopyTo option:selected").val();
        objBO.Srno = '-';
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        objBO.Logic = "CopyRateList";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
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
}
function InsertUpdatePanelRateLink() {
    var url = config.baseUrl + "/api/EDP/PanelRateListLinkInsertUpdate";
    var objBO = {};
    objBO.PanelId = $("#ddlPanel option:selected").val();
    objBO.RateListId = $("#ddlRateList option:selected").val();
    objBO.Srno = $("#txtSno").val();
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "Insert";
    if (validate()) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    $("#txtSno").val('');
                    BindPanelRateLinkItem(objBO.PanelId);
                    //alert('Panel RateList linked successfully');
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
}
function BindPanelRateLinkItem(PanelId) {
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    var objBO = {};
    objBO.Logic = "BindPanelRateLinkItem";
    objBO.PanelId = PanelId;//$("#ddlPanel option:selected").val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = ""; var pnlname = "";
            $("#tblRateLinkDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        if (pnlname != v.PanelName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + v.PanelName + '</td>';
                            htmldata += '</tr>';
                            pnlname = v.PanelName;
                        }
                        htmldata += '<tr>';
                        htmldata += '<td style="display:none"><a class="btn btn-warning btn-xs" href="javascript:void(0)" data-panelid=' + v.PanelId + ' data-ratelistid=' + v.RateListId + '>Update</a ></td>'; //onclick="selectRow(this);UpdateItemRateListSingle(this)"                        
                        htmldata += '<td>' + v.RateListName + '</td>';
                        htmldata += '<td>' + v.seqNo + '</td>';
                        htmldata += '</tr>';
                    });
                    $("#tblRateLinkDetails tbody").append(htmldata);
                }
                else {
                    $("#tblRateLinkDetails tbody").empty();
                    htmldata += '<tr>';
                    htmldata += '<td colspan="10" style="color:red;"> No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblRateLinkDetails tbody").append(htmldata);
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
function onPanelChange() {
    var PanelId = $("#ddlPanel option:selected").val();
    BindPanelRateLinkItem(PanelId);
}
function DownloadPanelRateList() {
    var objBO = {};
    var url = config.baseUrl + "/api/EDP/PanelRateQueries";
    objBO.Logic = "DownloadRateList";
    objBO.FileType = "Excel";
    objBO.RateListId = $("#ddlBulkRatePanel option:selected").val();
    Global_DownloadExcel(url, objBO, $("#ddlBulkRatePanel option:selected").text() + ".xlsx");
}
function UploadPanelRateList() {
    var RateListId = $("#ddlBulkRatePanel option:selected").val();
    if (RateListId != "0" && RateListId != "" && typeof RateListId != 'undefined') {
        var uploadFile = $("#ExcelImage");
        var files = uploadFile.get(0).files;
        var formData = new FormData();
        if (files.length > 0) {
            formData.append("ExcelFile", files[0]);
            formData.append("LoginId", Active.userId);
            formData.append("HospId", Active.HospId);
            formData.append("Logic", "RoomChargesUpdate");
            $.ajax({
                url: config.baseUrl + '/api/EDP/ReadFile',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    alert('RateListId Updated successfully');
                },
                error: function (response) {
                    alert('Server Error...!');
                }
            });
        }
    }
}
function validate() {
    var PanelId = $("#ddlPanel option:selected").val();
    var RateListId = $("#ddlRateList option:selected").val();
    var Srno = $("#txtSno").val();

    if (PanelId == "0") {
        alert('Please select panel');
        return false;
    }
    if (RateListId == "0") {
        alert('Please select panel');
        return false;
    }
    if (Srno == "" || Srno == "0") {
        alert('Serial no can not be empty or zero');
        return false;
    }
    return true;
}
function validateCopyRateList() {
    var RateListCopyFrom = $("#ddlRateListCopyFrom option:selected").text();
    var RateListCopyTo = $("#ddlRateListCopyTo option:selected").text();

    if (RateListCopyFrom == "Select") {
        alert('Please select Rate List Copy From.');
        return false;
    }
    if (RateListCopyTo == "Select") {
        alert('Please select Rate List Copy To.');
        return false;
    }
    return true;
}



