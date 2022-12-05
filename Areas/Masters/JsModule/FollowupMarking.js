$(document).ready(function () {
    CloseSidebar();
    Onload();
    $('#txtSeachDoctorPanel').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblDrPanelDetails tbody tr').filter(function () {
            if ($(this).closest('tr').find("input[type=text]").length) {
                $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
            }
        });
    });
    $(document).on('keyup', 'input[id*="txtfollowup"]', function (ev) {
        var followupval = $(this).val();
        if (followupval.length <= 0) {
            $("#tblDrPanelDetails tbody tr").each(function (i) {
                if ($(this).closest('tr').find("input[type=text]").length) {
                    $(this).closest('tr').find("td:eq(1) input").val('');
                }
            });
        }
    });
});

function Onload() {
    var url = config.baseUrl + "/api/Master/mPanelQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    objBO.login_id = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlPanel").append($("<option></option>").val("All").html("All"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlPanel").append($("<option></option>").val(value.PanelId).html(value.PanelName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlDoctors").append($("<option></option>").val("All").html("All"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlDoctors").append($("<option></option>").val(value.DoctorId).html(value.DoctorName));
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

function GetDoctorPanel() {
    var url = config.baseUrl + "/api/Master/mPanelQueries";
    var objBO = {};
    var drid = $("#ddlDoctors option:selected").val();
    var pnlid = $("#ddlPanel option:selected").val();

    objBO.DoctorId = drid;
    objBO.PanelId = pnlid;
    objBO.Logic = "GetDoctorPanel";
    objBO.login_id = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = ""; var drname = "";
            $("#tblDrPanelDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        
                        if (drname != v.DoctorName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + v.DoctorName + '</td>';
                            htmldata += '</tr>';
                            drname = v.DoctorName;
                        }
                        htmldata += '<tr>';
                        htmldata += '<td>' + parseInt(k + 1) + '</td>';
                        htmldata += '<td>' + v.PanelName + '</td>';
                        if (v.FollowupDays == 0) {
                            htmldata += '<td><input type="text" class="form-control"/></td>';
                        }
                        else {
                            htmldata += '<td><input type="text" value="' + v.FollowupDays + '" class="form-control"/></td>';
                        }
                        //htmldata += '<td><a href = "javascript:void(0)" id = "btnDelete' + k + ' onclick = "selectRow(this);DeleteFollowup()"><i class="fa fa-trash fa-lg text-red"></i></a ></td>';
                        htmldata += '<td style="display:none">' + v.DoctorId + '</td>';
                        htmldata += '<td style="display:none">' + v.PanelId + '</td>';
                        htmldata += '</tr>';
                    });
                    $("#tblDrPanelDetails tbody").append(htmldata);
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

function SetValues() {
    
    var followupval = $("#txtfollowup").val();
    if (followupval == "" || followupval == "0") {
        alert('follow up days cannot be empty or zero(0)');
        return false;
    }
    $("#tblDrPanelDetails tbody tr").each(function () {
        if ($(this).closest('tr').find("input[type=text]").length) {
            if ($(this).closest('tr').find("input[type=text]").val() == "") {
                $(this).closest('tr').find("td:eq(2) input").val(followupval);
            }
        }
    });
    //$("#txtfollowup").val('');
}
function ClearValues() {
    if (confirm('Are you sure to clear values')) {
        $("#tblDrPanelDetails tbody tr").each(function () {
            if ($(this).closest('tr').find("input[type=text]").length) {
                $(this).closest('tr').find("td:eq(2) input").val('');
            }
        });
    }
}

function InsertUpdateFollowup() {
    var followuparry = [];
    var url = config.baseUrl + "/api/Master/mPanelFollowupInsertUpdate";
    var objBO = {};
    $('#tblDrPanelDetails tbody tr').each(function () {
        if ($(this).find('td:eq(2)').find("input[type=text]").length) {
            var FollowpDays = $(this).find("td:eq(2) input").val();
            var DoctorId = $(this).find("td:eq(3)").text();
            var PanelId = $(this).find("td:eq(4)").text();
            followuparry.push({ 'PanelId': PanelId, 'DoctorId': DoctorId, 'FollowpDays': FollowpDays });
        }
    });
   
    if (followuparry.length > 0) {
        objBO.FollowpDetails = JSON.stringify(followuparry);
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        objBO.Logic = "Insert";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var splitval = data.split('|');
                if (splitval[0] == '1' && splitval[1] == 'success') {
                    alert('Follow up created successfully');
                    //GetDoctorPanel();
                }
                else if (splitval[0] == '2' && splitval[1] == 'success') {
                    alert('Follow up Updated successfully');
                    //GetDoctorPanel();
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
