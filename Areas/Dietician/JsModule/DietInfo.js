
var _dietId = '';
var _logic = 'InsertDietMaster';
var _AutoId = 0;
$(document).ready(function () {
    $('#tblDietItemDetail tbody').on('click', '#btnDelete', function () {
        var autoid = $(this).data('autoid');
        DeleteItem(autoid);
    });
    $('select').select2();
    $('#btnClearDiet').on('click', function () {
        clear();
    });
    $('#tblDietMaster thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetDietMasterInfo('Y');
        else
            GetDietMasterInfo('N');
    });
    $('#tblDietMaster tbody').on('change', 'input:checkbox', function () {
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logic = 'UpdateDietMasterStatus';
        InsertDietMaster();
    });
    $('#tblDietMaster tbody').on('click', '#btnEdit', function () {
        var Dietname = $(this).closest('tr').find('td:eq(5)').text();
        var dietId = $(this).closest('tr').find('td:eq(3)').text();
        var category = $(this).closest('tr').find('td:eq(4)').text();
        var Day = $(this).closest('tr').find('td:eq(6)').text();
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logic = 'UpdateDietMaster';
        $('#btnSaveDiet').text('Update').addClass('btn-warning').removeClass('btn-success');
        $('#txtDietName').val(Dietname);
        $('#ddlDietType option').each(function () {
            if ($(this).val() == dietId)
                $('#ddlDietType').prop('selectedIndex', '' + $(this).index() + '').change();
        });
        $('#ddlDietCategory option').each(function () {
            if ($(this).text() == category)
                $('#ddlDietCategory').prop('selectedIndex', '' + $(this).index() + '').change();
        });
        $('#ddlDietDay option').each(function () {
            if ($(this).text() == Day)
                $('#ddlDietDay').prop('selectedIndex', '' + $(this).index() + '').change();
        });
    });
    GetDietTypeList();
    GetDietCategory();
    GetDietMasterInfo('Y');
    GetItemNameList();
});
function GetItemNameList() {
    $("#ddlItemList").empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.DietTypeId = '-';
    objBO.prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetItemList";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlItemList").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlItemList").append($("<option></option>").val(value.itemId).html(value.ItemName)).select2();
                    });
                }
            }
            else {
                alert('No Data Found..')
            }
        }
    })
}
function GetDietTypeList() {
    $("#ddlDietType").empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.DietTypeId = '-';
    objBO.prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "DietTypeList";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlDietType").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlDietType").append($("<option></option>").val(value.DietTypeId).html(value.DietTypeName)).select2();
                    });
                }
            }
            else {
                alert('No Data Found..')
            }
        }
    })
}
function GetDietCategory() {
    $("#ddlDietCategory").empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.DietTypeId = '-';
    objBO.prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "DietCategoryList";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            // console.log(data);
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlDietCategory").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlDietCategory").append($("<option></option>").val(value.CategoryName).html(value.CategoryName)).select2();
                    });

                }
            }
            else {
                alert('No Data Found..')
            }
        }
    })
}
function InsertDietMaster() {
    var dietName = $('#txtDietName').val();
    var dietType = $("#ddlDietType option:selected").text();
    var dietcategory = $("#ddlDietCategory option:selected").text();
    var DietDay = $("#ddlDietDay option:selected").text();
    if (_logic != 'UpdateDietMasterStatus') {
        if (dietName == '') {
            alert('Please Select DietName');
            $("#txtDietName").css('border', '1px solid red').focus();
            return false;
        }
        if (dietType == 'Select') {
            alert('Please Select DietType');
            $("#ddlDietCategory").css('border', '1px solid red');
            return false;
        }
        if (dietcategory == 'Select') {
            alert('Please Select DietCategory');
            $("#ddlDietType").css('border', '1px solid red');
            return false;
        }
        if (DietDay == 'Select') {
            alert('Please Select Diet Day');
            $("#ddlDietDay").css('border', '1px solid red');
            return false;
        }
    }
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = _AutoId;
    objBO.DietTypeId = $('#ddlDietType option:selected').val();
    objBO.ItemId = '-';
    objBO.DietId = '-';
    objBO.DietName = $('#txtDietName').val();
    objBO.DietRoute = '-';
    objBO.DietTypeName = $('#ddlDietType option:selected').text();
    objBO.NutritionName = $('#ddlDietDay option:selected').text();
    objBO.Measuring = '-';
    objBO.NutritionValue = '-';
    objBO.CalorieCount = '-';
    objBO.MeasuringName = '-';
    objBO.CategoryName = $('#ddlDietCategory option:selected').text();
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.date = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = _logic;
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                GetDietMasterInfo(($('#tblDietMaster thead input:checkbox').is(':checked') == true) ? 'Y' : 'N');
                clear();
            }
            else {
                alert(data);
            }
        }
    })
}
function GetDietMasterInfo(inactive) {
    $('#tblDietMaster tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.AutoId = 0;
    objBO.DietTypeId = '-';
    objBO.prm1 = inactive;
    objBO.login_id = Active.userId;
    objBO.Logic = "DietMasterInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var temp = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.CategoryName) {
                            tbody += "<tr style='background:#fff1be'>";
                            tbody += "<td colspan='5'><b>Category : </b>" + val.CategoryName + "</td>";
                            tbody += "</tr>";
                            temp = val.CategoryName;
                        }
                        tbody += "<tr>";
                        tbody += "<td>";
                        tbody += "<label class='switch'>";
                        tbody += "<input type='checkbox' class='statusflag' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span></label>";
                        tbody += "<button  class='btn btn-warning btn-xs' id='btnEdit' style='line-height: 0;height: 14px;border:none;margin-left: 8px;'><spna class='fa fa-edit'></span></button>";
                        tbody += "</td>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td style='display:none;'>" + val.DietId + "</td>";
                        tbody += "<td style='display:none;'>" + val.DietTypeId + "</td>";
                        tbody += "<td style='display:none;'>" + val.CategoryName + "</td>";
                        tbody += "<td>" + val.Dietname + "</td>";
                        tbody += "<td>" + val.DietAvailableDay + "</td>";
                        tbody += "<td>" + val.Calories + "</td>";
                        tbody += "<td><button  class='btn-success' onclick=selectRow(this);GetDietItem('" + val.DietId + "');  style='border:none;'><spna class='fa fa-sign-in'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDietMaster tbody').append(tbody);
                }
            }
        },
        error: function (err) {
            alert('Server Error');
        }
    });
}
function InsertDietitemLink() {
    if (_dietId == '') {
        alert('Please Select Diet.');
        return;
    }
    var ItemList = $('#ddlItemList option:selected').text();
    var Qty = $('#txtQty').val();
    if (ItemList == 'Select') {
        alert('Please Select Item Name');
        $("#ddlItemName").css('border', '1px solid red');
        return;
    }
    if (Qty == '') {
        alert('Please Enter Qty');
        $("#txtQty").css('border', '1px solid red');
        return;
    }
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = 0;
    objBO.DietTypeId = '-';
    objBO.ItemId = $('#ddlItemList option:selected').val();
    objBO.ItemName = '-';
    objBO.DietId = _dietId;
    objBO.DietName = '-'
    objBO.qty = $('#txtQty').val();
    objBO.DietRoute = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = '-';
    objBO.Measuring = '-';
    objBO.NutritionValue = '-';
    objBO.CalorieCount = '-';
    objBO.MeasuringName = '-';
    objBO.CategoryName = '-';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.date = '1900/01/01';
    objBO.IsActive = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "InsertDietitemLink";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(objBO),
        success: function (data) {
            if (data.includes('Success')) {               
                GetDietItem(_dietId)
                clear();
            }
            else {
                alert(data);
            }
        }
    })
}
function GetDietItem(dietId) {
    _dietId = dietId;
    $('.SpanDietName').text($('#tblDietMaster tbody').find('tr.select-row').find('td:eq(5)').text());
    $('#tblDietItemDetail tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.AutoId = 0;
    objBO.DietTypeId = '-';
    objBO.prm1 = dietId;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetDietItemLink";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var TotalCalCount = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        TotalCalCount += val.TotalCalCount;
                        tbody += "<tr>";
                        tbody += "<td style='display:none;'>" + val.DietId + "</td>";
                        tbody += "<td style='display:none;'>" + val.DietName + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td class='text-right'>" + val.qty + "</td>";
                        tbody += "<td class='text-right'>" + val.TotalCalCount + "</td>";
                        tbody += "<td><button  class='btn-danger' id='btnDelete'  style='border:none;' data-autoid=" + val.AutoId + "><spna class='fa fa-trash'></span></button></td>";
                        tbody += "</tr>";
                    });
                    tbody += "<tr style='background:#ddd'>";
                    tbody += "<td colspan='2'><b>Total Calory Count</b></td>";
                    tbody += "<td class='text-right'><b>" + TotalCalCount.toFixed(2) + "</b></td>";
                    tbody += "<td>-</td>";
                    tbody += "</tr>";
                    $('#tblDietItemDetail tbody').append(tbody);
                }
            }
        },
        error: function (err) {
            alert('Server Error');
        }
    });
}
function DeleteItem(autoid) {
    if (confirm('Are you Sure To delete this Record?')) {
        var objBO = {};
        var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
        objBO.Autoid = autoid;
        objBO.servefrom = '1900/01/01';
        objBO.serveto = '1900/01/01';
        objBO.date = '1900/01/01';
        objBO.login_id = Active.userId;
        objBO.Logic = "DeleteDietItemLink";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetDietItem(_dietId);
                clear();
            }
        })
    }
}
function clear() {
    $('#txtDietName').val('');
    $('#txtQty').val('');
    $("#ddlItemList").prop('selectedIndex', '0').change();
    $("#ddlDietType").prop('selectedIndex', '0').change();
    $("#ddlDietDay").prop('selectedIndex', '0').change();
    $("#ddlDietCategory").prop('selectedIndex', '0').change();
    $('#btnSaveDiet').text('Save').addClass('btn-success').removeClass('btn-warning');
    _logic = 'InsertDietMaster';
}