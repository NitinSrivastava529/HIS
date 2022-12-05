var _dietId = '';
var _logicDietType = 'InsertDietType';
var _logicDietRoute = 'InsertDietRoute';
var _logicNutrision = 'InsertDietNutrition';
var _logicMeasuring = 'InsertDietMeasuring';
var _logic = '';
var _AutoId = 0;
$(document).ready(function () {
    CloseSidebar();
    GetDietTypeName('Y');
    GetDietNutrision('Y');
    GetMeasuringDiet('Y');
    GetDietCategory();
    GetDietRoute('Y');
    //DietType
    $('#tblDiettypeMaster tbody').on('click', '#btnEdit', function () {
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicDietType = 'UpdateDietType';
        var DietTypeName = $(this).closest('tr').find('td:eq(2)').text();
        $('#txtDietType').val(DietTypeName);
        $('#btnDietType').text('Update').removeClass('btn-success').addClass('btn-warning');
    });
    $('#tblDiettypeMaster thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetDietTypeName('Y');
        else
            GetDietTypeName('N');
    });
    $('#tblDiettypeMaster tbody').on('change', 'input:checkbox', function () {
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicDietType = 'UpdateDietTypeStatus';
        InsertDietType();
    });
    //Diet Route
    $('#tblDietRouteDetail tbody').on('click', '#btnEdit', function () {
        var DietRoute = $(this).closest('tr').find('td:eq(2)').text();
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicDietRoute = 'UpdateDietRoute';
        $('#txtDietRoute').val(DietRoute);
        $('#btnDietRoute').text('Update').removeClass('btn-success').addClass('btn-warning');
    });
    $('#tblDietRouteDetail thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetDietRoute('Y');
        else
            GetDietRoute('N');
    });
    $('#tblDietRouteDetail tbody').on('change', 'input:checkbox', function () {
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicDietRoute = 'UpdateDietRouteStatus';
        InsertDietRoute();
    });
    //Diet Nutrision
    $('#tblNutrisionDetail tbody').on('click', '#btnEdit', function () {
        var NutritionName = $(this).closest('tr').find('td:eq(2)').text();
        var CalorieCount = $(this).closest('tr').find('td:eq(3)').text();
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicNutrision = 'UpdateDietNutrition';
        $('#txtDietNutrition').val(NutritionName);
        $('#txtCalorieCount').val(CalorieCount);
        $('#btnDietNutrision').text('Edit').removeClass('btn-success').addClass('btn-warning');
    });
    $('#tblNutrisionDetail thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetDietNutrision('Y');
        else
            GetDietNutrision('N');
    });
    $('#tblNutrisionDetail tbody').on('change', 'input:checkbox', function () {
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicNutrision = 'UpdateNutritionStatus';
        InsertNutrisionDiet();
    });
    //Diet Measuring
    $('#tblMeasuringDetail tbody').on('click', '#btnEdit', function () {
        var MeasuringDiet = $(this).closest('tr').find('td:eq(2)').text();
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicMeasuring = 'UpdateDietMeasuring';
        $('#txtMeasurement').val(MeasuringDiet);
        $('#btnMeasuring').text('Update').removeClass('btn-success').addClass('btn-warning');
    });
    $('#tblMeasuringDetail thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetMeasuringDiet('Y');
        else
            GetMeasuringDiet('N');
    });
    $('#tblMeasuringDetail tbody').on('change', 'input:checkbox', function () {
        _AutoId = $(this).closest('tr').find('td:eq(1)').text();
        _logicMeasuring = 'UpdateMeasuringStatus';
        InsertMeasuring();
    });
    $('#tblDietCategory tbody').on('click', '#btnDietEdit', function () {
        var DietCategory = $(this).closest('tr').find('td:eq(1)').text();
        var serverfrom = $(this).closest('tr').find('td:eq(2)').text();
        var serverto = $(this).closest('tr').find('td:eq(3)').text();
        $('#txtServedFrom').val(serverfrom);
        $('#txtServedTo').val(serverto);
        $('#txtDietCategory').val(DietCategory);
        $('#btnCategory').text('Update').removeClass('btn-success').addClass('btn-warning');
    });
});
//DietType
function InsertDietType() {
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = _AutoId;
    objBO.DietTypeId = '-';
    objBO.DietRoute = '-';
    objBO.NutritionName = '-';
    objBO.MeasuringName = '-';
    objBO.CategoryName = '-';
    objBO.CalorieCount = 0;
    objBO.DietTypeName = $('#txtDietType').val();
    objBO.date = '1900/01/01';
    objBO.IsActive = '-';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = _logicDietType;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8 ",
        success: function (data) {
            if (data.includes('Success')) {
                $('#btnDietType').text('Add').removeClass('btn-warning').addClass('btn-success');
                Clear();
                GetDietTypeName(($('#tblDiettypeMaster thead input:checkbox').is(':checked') == true) ? 'Y' : 'N');
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error..');
        }
    });
}
function GetDietTypeName(active) {
    $('#tblDiettypeMaster tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.AutoId = 0;
    objBO.DietTypeId = '-';
    objBO.prm1 = active;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetDietTypeName";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>";
                        tbody += "<label class='switch'>";
                        tbody += "<input type='checkbox' class='statusflag' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span></label>";
                        tbody += "</td>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.DietTypeName + "</td>";
                        tbody += "<td><button  class='btn-warning' id='btnEdit'  onclick=selectRow(this); style='border:none;'><spna class='fa fa-edit'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDiettypeMaster tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
//Diet Route
function InsertDietRoute() {
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = _AutoId;
    objBO.DietTypeId = '-';
    objBO.DietTypeName = '-';
    objBO.DietRoute = $('#txtDietRoute').val();
    objBO.MeasuringName = '-';
    objBO.CategoryName = '-';
    objBO.date = '1900/01/01';
    objBO.IsActive = '-';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = _logicDietRoute;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.includes('Success')) {
                $('#btnDietRoute').text('Add').removeClass('btn-warning').addClass('btn-success');
                $('#txtDietRoute').val('');
                GetDietRoute(($('#tblDietRouteDetail thead input:checkbox').is(':checked') == true) ? 'Y' : 'N');
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
function GetDietRoute(active) {
    $('#tblDietRouteDetail tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.prm1 = active;
    objBO.Logic = "GetDietRoute";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>";
                        tbody += "<label class='switch'>";
                        tbody += "<input type='checkbox' class='statusflag' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span></label>";
                        tbody += "</td>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.DietRoute + "</td>";
                        tbody += "<td><button  class='btn-warning' id='btnEdit'  onclick=selectRow(this); style='border:none;'><spna class='fa fa-edit'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDietRouteDetail tbody').append(tbody);
                }
            }
        }
    })
}
//Diet Nutrision
function InsertNutrisionDiet() {
    if (_logicNutrision != 'UpdateNutritionStatus') {
        if ($('#txtDietNutrition').val() == '') {
            alert('Please Provide Diet Nutrition.');
            $('#txtDietNutrition').focus();
            return;
        }
        if ($('#txtCalorieCount').val() == '') {
            alert('Please Provide Calorie Count.');
            $('#txtCalorieCount').focus();
            return;
        }
    }
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = _AutoId;
    objBO.DietTypeId = '-';
    objBO.ItemId = '-';
    objBO.ItemId = '-';
    objBO.ItemName = '-';
    objBO.DietRoute = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = $('#txtDietNutrition').val();
    objBO.Measuring = '-';
    objBO.NutritionValue = 0;
    objBO.date = '1900/01/01';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.IsActive = '-';
    objBO.CalorieCount = $('#txtCalorieCount').val();
    objBO.MeasuringName = '-';
    objBO.CategoryName = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = _logicNutrision;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                $('#btnDietNutrision').text('Add').removeClass('btn-warning').addClass('btn-success');
                $('#txtDietNutrition').val('');
                $('#txtCalorieCount').val('');
                Clear();
                GetDietNutrision(($('#tblNutrisionDetail thead input:checkbox').is(':checked') == true) ? 'Y' : 'N');
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
function GetDietNutrision(active) {
    $('#tblNutrisionDetail tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.prm1 = active;
    objBO.Logic = "GetDietNutrision";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>";
                        tbody += "<label class='switch'>";
                        tbody += "<input type='checkbox' class='statusflag' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span></label>";
                        tbody += "</td>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.NutritionName + "</td>";
                        tbody += "<td class='text-right'>" + val.CalorieCount + "</td>";
                        tbody += "<td><button  class='btn-warning' id='btnEdit'  onclick=selectRow(this); style='border:none;'><spna class='fa fa-edit'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblNutrisionDetail tbody').append(tbody);
                }
            }

        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
//Diet Measuring
function InsertMeasuring() {
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = _AutoId;
    objBO.DietTypeId = '-';
    objBO.ItemId = '-';
    objBO.DietRoute = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = '-';
    objBO.Measuring = '-';
    objBO.NutritionValue = '-';
    objBO.CalorieCount = 0;
    objBO.MeasuringName = $('#txtMeasurement').val();
    objBO.date = '1900/01/01';
    objBO.servefrom = '1900/01/01';
    objBO.serveto = '1900/01/01';
    objBO.IsActive = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = _logicMeasuring;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                $('#btnMeasuring').text('Add').removeClass('btn-warning').addClass('btn-success');
                $('#txtMeasurement').val('');
                GetMeasuringDiet(($('#tblMeasuringDetail thead input:checkbox').is(':checked') == true) ? 'Y' : 'N');
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
function GetMeasuringDiet(active) {
    $('#tblMeasuringDetail tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.prm1 = active;
    objBO.Logic = "GetDietMeasuring";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>";
                        tbody += "<label class='switch'>";
                        tbody += "<input type='checkbox' class='statusflag' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span></label>";
                        tbody += "</td>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.MeasuringName + "</td>";
                        tbody += "<td><button  class='btn-warning' id='btnEdit'  onclick=selectRow(this); style='border:none;'><spna class='fa fa-edit'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblMeasuringDetail tbody').append(tbody);
                }
            }

        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
//Diet Category
function GetDietCategory() {
    $('#tblDietCategory tbody').empty();
    var url = config.baseUrl + "/api/Dietician/dietMasterQueries";
    var objBO = {};
    objBO.Logic = "GetDietCategory";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td style='display:none;'>" + val.AutoId + "</td>";
                        tbody += "<td>" + val.CategoryName + "</td>";
                        tbody += "<td style='display:none;'>" + val.ServeFrom + "</td>";
                        tbody += "<td style='display:none;'>" + val.ServeTo + "</td>";
                        tbody += "<td><button  class='btn-warning' id='btnDietEdit'  onclick=selectRow(this); style='border:none;'><spna class='fa fa-edit'></span></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDietCategory tbody').append(tbody);
                }
            }

        },
        error: function (response) {
            alert('Server Error..')
        }
    });

}
function InsertDietCategory() {
    var url = config.baseUrl + "/api/Dietician/dietmasterInsertUpdate";
    var objBO = {};
    objBO.Autoid = $('#tblDietCategory tbody').find('tr.select-row').find('td:eq(0)').text();
    objBO.DietTypeId = '-';
    objBO.DietTypeName = '-';
    objBO.NutritionName = '-';
    objBO.MeasuringName = '-';
    objBO.CategoryName = $('#txtDietCategory').val();
    objBO.date = '1900/01/01';
    objBO.servefrom = $('#txtServedFrom').val();
    objBO.serveto = $('#txtServedTo').val();
    objBO.IsActive = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = ($('#btnCategory').text() == 'Add') ? 'InsertDietCategory' : 'UpdateDietCategory';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#btnCategory').text('Add').removeClass('btn-warning').addClass('btn-success');
                GetDietCategory();
                Clear();
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error..')
        }
    });
}
function Clear() {
    $('#txtDietType').val('');
    $('#txtDietNutrition').val('');
    $('#txtDietCategory').val('');
    $('#txtServedFrom').val('');
    $('#txtServedTo').val('');
    _logicDietType = 'InsertDietType';
    _logicDietRoute = 'InsertDietRoute';
    _logicNutrision = 'InsertDietNutrition';
    _logicMeasuring = 'InsertDietMeasuring';
}

