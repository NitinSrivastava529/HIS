$(document).ready(function () {
    GetCart();
    GeSetMasterInfo();
    $("#ddlSetList").on('change', function () {
        var type = $(this).find('option:selected').data('type');
        if (type == 'SET')
            $('#txtQty').val(1).prop('disabled', true);
        else
            $('#txtQty').val('').prop('disabled', false);
    });
});

function GetCart() {
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetCartByLogin';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#ddlCart").append($("<option></option>").val('0').html('Select'));
            $.each(data.ResultSet.Table, function (key, val) {
                $("#ddlCart").append($("<option></option>").val(val.CartId).html(val.CartName)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GeSetMasterInfo() {
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = 'ALL';
    objBO.Logic = 'GeSetMasterInfoForIndent';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#ddlSetList").append($("<option></option>").val('0').html('Select'));
            $.each(data.ResultSet.Table, function (key, val) {
                $("#ddlSetList").append($("<option data-type=" + val.ItemType + "></option>").val(val.SetId).html(val.SetName)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetIndentInfo() {
    $("#tblIndentInfo tbody").empty();
    $('#txtIndentNo').val('New');
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = $('#txtIndentNo').val();
    objBO.Prm_2 = $('#ddlCart option:selected').val();
    objBO.Logic = 'GetIndentInfoByIndentNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td style='padding-right:10px' class='text-right'>" + val.qty + "</td>";
                        tbody += "<td><button class=' btn-danger' onclick=DeleteIndent('" + val.AutoId + "')><i class='fa fa-trash'></i></button></td>";
                        tbody += "</tr>";
                        $('#txtIndentNo').val(val.IndentNo);
                    });
                    $("#tblIndentInfo tbody").append(tbody);
                    $("#ddlCart").prop('disabled', true);
                }
                else {
                    //alert("Data Not Found");
                };
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertIndent() {
    if (Validation()) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateMovement";
        var objBO = {};
        objBO.CartdId = $('#ddlCart option:selected').val();
        objBO.IndentNo = $('#txtIndentNo').val();
        objBO.SetId = $('#ddlSetList option:selected').val();
        objBO.qty = $('#txtQty').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "IndentRequest";
        objBO.ExpDate = "1900/01/01";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    var indentNo = data.split('|')[1];
                    $('#txtIndentNo').val(indentNo);
                    GetIndentInfo();
                    $('#txtQty').val('');
                    $('#ddlSetList').prop('selectedIndex', '0').change();
                }
                else {
                    alert(data);
                };
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function CompleteIndent() {
    if ($('#txtIndentNo').val() == 'New') {
        alert('Indent Request Not Available..');
        return
    }
    if (confirm('Are you sure to Complete Indent?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateMovement";
        var objBO = {};
        objBO.IndentNo = $('#txtIndentNo').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "CompleteIndent";
        objBO.ExpDate = "1900/01/01";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Indent Completed..');
                    $('#txtIndentNo').val('New');
                    $('#tblIndentInfo tbody').empty();
                    $('#txtQty').val('');
                    $('#ddlSetList').prop('selectedIndex', '0').change();
                    $('#ddlCart').prop('selectedIndex', '0').change();
                    $("#ddlCart").prop('disabled', false);
                }
                else {
                    alert(data);
                };
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function DeleteIndent(AutoId) {
    if (confirm('Are you sure to delete This?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateMovement";
        var objBO = {};
        objBO.AutoId = AutoId;
        objBO.Logic = "DeleteIndent";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetIndentInfo();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function Clear() {
    $('#txtIndentNo').val('New');
    $('#tblIndentInfo tbody').empty();
    $('#txtQty').val('');
    $('#ddlSetList').prop('selectedIndex', '0').change();
    $('#ddlCart').prop('selectedIndex', '0').change();
    $("#ddlCart").prop('disabled', false);
}
function Validation() {
    var Cart = $('#ddlCart option:selected').text();
    var IndentNo = $('#txtIndentNo').val();
    var Set = $('#ddlSetList option:selected').val();
    var qty = $('#txtQty').val();

    if (Cart == 'Select') {
        alert('Please Select Cart');
        $('#ddlCart').focus();
        return false;
    }
    if (IndentNo == '') {
        alert('Please Provide Indent No');
        $('#txtIndentNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtIndentNo').removeAttr('style')
    }
    if (Set == 'Select') {
        alert('Please Select Set Name');
        $('#ddlSetList').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlSetList').removeAttr('style')
    }
    if (qty == '') {
        alert('Please Provide Qty');
        $('#txtQty').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtQty').removeAttr('style')
    }
    return true;
}