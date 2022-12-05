var _itemid = '';
var _AutoId = 0;
var _logic = 'InsertItemName';
$(document).ready(function () {
    $('#tblDietNutrition tbody').on('click', '#btnDelete', function () {
        var autoid = $(this).data('autoid');
        DeleteItemNutrition(autoid);
    });
    $('#tblItemDetail tbody').on('click', '.NOS', function () {
        $('#ulLinkedDietName').empty();
        var diet = $(this).data('diet').split('|');
        for (var i = 0; i < diet.length - 1; i++) {
            $('#ulLinkedDietName').append($('<li></li>').html(diet[i]));
        }
        $('#modalDietLinked').modal('show');
    });
    $('#tblItemDetail thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetItemDetail('Y');
        else
            GetItemDetail('N');
    });
    $('#tblItemDetail tbody').on('change', 'input:checkbox', function () {
        _AutoId = $(this).closest('tr').find('td:eq(7)').text();
        _logic = 'UpdateItemMasterStatus';
        InsertItemMaster();
    });
    $('#tblCalorieCount tbody').on('click', '#btnEdit', function () {
        var NutritionName = $(this).closest('tr').find('td:eq(1)').text();
        var calorie = $(this).closest('tr').find('td:eq(2)').text();
        $('#txtNutritionCalorieCount').val(NutritionName);
        $('#txtCalorieCount').val(calorie);
        $('#btnCaloriCount').text('Update').removeClass('btn-success').addClass('btn-warning');
    });
    $('#tblItemDetail tbody').on('click', '#btnEdit', function () {
        selectRow($(this));
        _itemid = $(this).closest('tr').find('td:eq(1)').text();
        var name = $(this).closest('tr').find('td:eq(2)').text();
        var Fluidvalue = $(this).closest('tr').find('td:eq(4)').text();
        var measuring = $(this).closest('tr').find('td:eq(6)').text();
        _AutoId = $(this).closest('tr').find('td:eq(7)').text();
        _logic = 'UpdateItemName';
        $('#txtItemName').val(name);
        $('#txtFluidValue').val(Fluidvalue);
        $('#ddlMeasuring').val(measuring).change();
        $('button[id=btnSaveItem]').text('Update').removeClass('btn-success').addClass('btn-warning');
    });
    $('#btnClearItem').on('click', function () {
        clear()
    });
    $('#btnCalorieCount').on('click', function () {
        $('#CalorieCountModal').modal('show');
        GetCalorieCount();
    });
    $('select').select2();
    GetMeasuringList();
    GetNutritionList();
    GetItemDetail('Y');
});
function GetMeasuringList() {
    $("#ddlMeasuring").empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.DietTypeId = '-';
    objBO.prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "MeasuringList";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //console.log(data);
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlMeasuring").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlMeasuring").append($("<option></option>").val(value.MeasuringName).html(value.MeasuringName)).select2();
                    });
                }
            }
            else {
                alert('No Data Found..')
            }
        }
    })
}
function GetNutritionList() {
    $("#ddlNutritionName").empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.DietTypeId = '-';
    objBO.prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "NutritionList";
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
                    $("#ddlNutritionName").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlNutritionName").append($("<option></option>").val(value.NutritionName).html(value.NutritionName)).select2();
                    });
                }
            }
            else {
                alert('No Data Found.');
            }
        }
    })
}
function InsertItemMaster() {
    if (_logic != 'UpdateItemMasterStatus') {
        var ItemName = $('#txtItemName').val();
        var Measuring = $('#ddlMeasuring option:selected').text();
        if (ItemName == '') {
            alert('Please Enter ItemName');
            $("#txtItemName").css('border-color', 'red').focus();
            return false;
        }
        if (Measuring == 'Select') {
            alert('Please Select Measuring');
            $("#ddlMeasuring").css('border', '1px solid red');
            return false;
        }
    }
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = _AutoId;
    objBO.DietTypeId = '-';
    objBO.ItemId = _itemid;
    objBO.ItemName = $('#txtItemName').val();
    objBO.DietRoute = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = '-';
    objBO.NutritionValue = $('#txtFluidValue').val();
    objBO.Measuring = $('#ddlMeasuring option:selected').val();
    objBO.MeasuringName = '-';
    objBO.CategoryName = '-';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.date = '1900/01/01';
    objBO.IsActive = '-';
    objBO.Logic = _logic;
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(objBO),
        success: function (data) {
            //console.log(data);
            if (data.includes('Success')) {
                GetItemDetail(($('#tblItemDetail thead input:checkbox').is(':checked') == true) ? 'Y' : 'N');
                clear();
            }
            else {
                alert(data);
            }
        }
    });
}
function GetItemDetail(active) {
    $('#tblItemDetail tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.prm1 = active;
    objBO.Logic = "GetItemDetail";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //console.log(data);
            var tbody = '';
            var temp = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.Measuring) {
                            tbody += "<tr style='background:#fff1be'>";
                            tbody += "<td colspan='6'><b>Measuring : </b>" + val.Measuring + "</td>";
                            tbody += "</tr>";
                            temp = val.Measuring;
                        }
                        tbody += "<tr>";
                        tbody += "<td>";
                        if (val.Nos == 0)
                            tbody += "<label class='switch'>";
                        else
                            tbody += "<label class='switch toggleBlock'>";

                        tbody += "<input type='checkbox' class='statusflag' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span></label>";
                        tbody += "<button  class='btn btn-warning btn-xs' id='btnEdit' style='line-height: 0;height: 14px;border:none;margin-left: 8px;'><spna class='fa fa-edit'></span></button>";
                        tbody += "</td>";
                        tbody += "<td style='display:none;'>" + val.itemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td class='text-right'>" + val.Calroies + "</td>";
                        tbody += "<td class='text-right'>" + val.FluidValue + "</td>";
                        if (val.Nos == 0)
                            tbody += "<td class='text-right'><label style='background: #a9a0a0;' class='NOS'>" + val.Nos + "</label></td>";
                        else
                            tbody += "<td class='text-right'><label class='NOS' data-diet='" + val.DietName + "'>" + val.Nos + "</label></td>";

                        tbody += "<td style='display:none;'>" + val.Measuring + "</td>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td>";
                        tbody += "<button  class='btn-success'  onclick=selectRow(this);GetDietNutrition('" + val.itemId + "');  style='border:none;'><spna class='fa fa-sign-in'></span></button>";
                        tbody += "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblItemDetail tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
function clear() {
    $('#txtItemName').val('');
    $('#txtMeasuring').val('');
    $('#txtNutritionValue').val('');
    $('#txtCaloryCount').val('');
}
function InsertDietItemNutrition() {
    var NutritionName = $('#ddlNutritionName option:selected').text();
    var NutritionValue = $('#txtNutritionValue').val();
    if (NutritionName == 'Select') {
        alert('Please Select NutritionName');
        $("#ddlNutritionName").css('border', '1px solid red');
        return false;
    }
    if (NutritionValue == '') {
        alert('Please Enter NutritionValue');
        $("#txtNutritionValue").css('border', '1px solid red');
        return false;
    }
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = 0;
    objBO.ItemId = _itemid;
    objBO.DietTypeId = '-';
    objBO.ItemName = '-';
    objBO.DietRoute = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = $('#ddlNutritionName option:selected').val();
    objBO.Measuring = 'GRAM';
    objBO.NutritionValue = NutritionValue;
    objBO.CalorieCount = 0;
    objBO.MeasuringName = '-';
    objBO.CategoryName = '-';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.date = '1900/01/01';
    objBO.IsActive = '-';
    objBO.Logic = "InsertDietItemNutrition";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                GetDietNutrition(_itemid);
                clear();
            }
            else {
                alert(data);
            }
        }
    });
}
function GetDietNutrition(itemId) {
    _itemid = itemId;
    $('.spanItemName').text($('#tblItemDetail tbody').find('tr.select-row').find('td:eq(2)').text());
    $('#tblDietNutrition tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.AutoId = 0;
    objBO.DietTypeId = '-';
    objBO.prm1 = _itemid;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetDietItemNutrition";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var TotalCalCount = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        TotalCalCount += val.TotalCalCount;
                        tbody += "<tr>";
                        tbody += "<td>" + val.NutritionName + "</td>";
                        tbody += "<td class='text-right'>" + val.NutritionValue + "</td>";
                        tbody += "<td class='text-center'>" + val.Measuring + "</td>";
                        tbody += "<td class='text-right'>" + val.PerGramCalCount + "</td>";
                        tbody += "<td class='text-right'>" + val.TotalCalCount + "</td>";
                        tbody += "<td><button  class='btn-danger' id='btnDelete'   style='border:none;' data-autoid=" + val.AutoId + " ><spna class='fa fa-trash'></span></button></td>";
                        tbody += "</tr>";
                    });
                    tbody += "<tr style='background:#ddd'>";
                    tbody += "<td colspan='4'><b>Total Calory Count</b></td>";
                    tbody += "<td class='text-right'><b>" + TotalCalCount.toFixed(2) + "</b></td>";
                    tbody += "<td>-</td>";
                    tbody += "</tr>";
                    $('#tblDietNutrition tbody').append(tbody);
                }
            }
        }
    })
}
function InsertCaloriCount() {
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    //objBO.Autoid = '21';
    objBO.Autoid = $('#tblCalorieCount tbody').find('tr.select-row').find('td:eq(0)').text();
    objBO.DietTypeId = '-';
    objBO.ItemId = _itemid;
    objBO.ItemName = '-';
    objBO.DietRoute = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = $('#txtNutritionCalorieCount').val();
    objBO.CalorieCount = $('#txtCalorieCount').val();
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.date = '1900/01/01';
    objBO.IsActive = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = ($('#btnCaloriCount').text() == 'Save') ? 'InsertCalorieCountPerGram' : 'UpdateCalorieCountPerGram';
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.includes('Success')) {
                GetCalorieCount();
                $('#txtNutritionCalorieCount').val('');
                $('#txtCalorieCount').val('');
                $('#btnCaloriCount').text('Save').removeClass('btn-warning').addClass('btn-success');
            }
            else {
                alert(data);
            }
        }
    })
}
function GetCalorieCount() {
    $('#tblCalorieCount tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.Logic = "GetCalorieCountPerGram";
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td style='display:none'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.NutritionName + "</td>";
                        tbody += "<td>" + val.CalorieCount + "</td>";
                        tbody += "<td><button class='btn-warning' id='btnEdit'  onclick=selectRow(this);  style='border:none;'><spna class='fa fa-edit'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblCalorieCount tbody').append(tbody);
                }
            }
        }
    });
}
function DeleteItemNutrition(autoid) {
    if (confirm('Are you Sure To delete this Record?')) {
        var objBO = {};
        var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
        objBO.Autoid = autoid;
        objBO.servefrom = '1900/01/01';
        objBO.serveto = '1900/01/01';
        objBO.date = '1900/01/01';
        objBO.login_id = Active.userId;
        objBO.Logic = "DeleteItemNutrition";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetDietNutrition(_itemid);
                clear();
            }
        });
    }
}
function clear() {
    $('#txtItemName').val('');
    $('#txtNutritionValue').val('');
    $("#ddlNutritionName").prop('selectedIndex', '0').change();
    $("#ddlMeasuring").prop('selectedIndex', '0').change();
    $('button[id=btnSaveItem]').text('Save').removeClass('btn-warning').addClass('btn-success');
    _logic = 'InsertItemName';
}