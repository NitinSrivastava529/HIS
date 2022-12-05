var _selectedDonor;
var _DonorId, _VisitId, _BloodGroup, _BagType, _EntryDate, _BloodCollectionId, _BBTubeNo;
$(document).ready(function () {
    $('select').select2();
    DonorInfo();
    $('#tblComponentInfo thead').on('change', 'input:checkbox', function () {
        var isCheck = $(this).is(':checked');
        $('#tblComponentInfo tbody tr').find('#ddlPackSize').removeClass('error');
        if (isCheck)
            $(this).parents('table').find('tbody input:checkbox:not(.whole)').prop({ 'checked': true, 'disabled': false });
        else
            $(this).parents('table').find('tbody input:checkbox').prop({ 'checked': false, 'disabled': false });
    });
    $('#tblComponentInfo tbody').on('change', 'input:checkbox', function () {
        var val = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
        if ($(this).is(':checked')) {
            if ($(this).attr('class') != 'whole') {
                if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked:not(.whole)').length > 0)
                    $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': true });
                else {
                    $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': false });
                }
            }
            else {
                $('#tblComponentInfo tbody tr').find('input[type=checkbox]:not(.whole)').prop({ 'checked': false, 'disabled': true });
            }

            $('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').each(function () {
                if ($(this).closest('tr').find('td:eq(6)').find('#ddlPackSize option:selected').text() == 'Select')
                    $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').addClass('error');
                else
                    $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
            });
        }
        else {
            if ($(this).attr('class') == 'whole') {
                $('#tblComponentInfo tbody tr').find('input[type=checkbox]').prop('disabled', false);
            }
            if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked:not(.whole)').length > 0)
                $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': true });
            else
                $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': false });

            $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
        }
    });
});
function DonorInfo() {
    $('#tblDonorInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "ComponentCreation:DonorInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var counter = 0;
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += "<td style='padding:0px 5px'><button onclick=selectRow(this);ComponentInfo(this) style='height: 17px;line-height:0;' class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "<td class='hide'>" + JSON.stringify(data.ResultSet.Table[count]) + "</td>";
                        tbody += "<td class='hide'>" + val.donor_id + "</td>";
                        tbody += "<td class='hide'>" + val.Visit_ID + "</td>";
                        tbody += "<td>" + val.dtEntry + "</td>";
                        tbody += "<td>" + val.Visit_ID + "</td>";
                        tbody += "<td>" + val.BloodCollection_Id + "</td>";
                        tbody += "<td>" + val.donorName + "</td>";
                        tbody += "<td>" + val.BloodGroup_Id + "</td>";
                        tbody += "<td>" + val.BagType + "</td>";
                        tbody += "<td>" + val.BBTubeNo + "</td>";
                        tbody += "</tr>";
                        count++;
                    });
                    $('#tblDonorInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ComponentInfo(elem) {
    _selectedDonor = elem;
    $('#tblComponentInfo tbody').empty();
    $('#tblAllotedComponentInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.Prm1 = $(elem).closest('tr').find('td:eq(6)').text();
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "ComponentCreation:ComponentInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var counter = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += (val.ComponentID == 'COMP01') ? "<td style='padding:0px 5px'><input class='whole' type='checkbox'/>" : "<td style='padding:0px 5px'><input type='checkbox'/>";
                        tbody += "<td class='hide'>" + val.ComponentID + "</td>";
                        tbody += "<td class='hide'>" + val.isComponent + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.AliasName + "</td>";
                        tbody += "<td><input type='text' disabled class='form-control' style='height: 24px;padding: 4px;text-align:right' value='1'/></td>";
                        tbody += "<td><select id='ddlPackSize' class='form-control' style='height: 24px;padding: 4px;'>";
                        tbody += "<option>Select";
                        tbody += "<option>350 ml";
                        tbody += "<option>450 ml";
                        tbody += "</select></td>";
                        tbody += "<td>" + val.expDate + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblComponentInfo tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = "";
                    var counter = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += "<td class='hide'>" + val.AutoId + "</td>";
                        tbody += "<td class='hide'>" + val.ComponentID + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td class='text-right'>" + val.Qty + "</td>";
                        tbody += "<td class='text-right'>" + val.PackSize + "</td>";
                        tbody += "<td>" + val.ExpiryDate + "</td>";
                        tbody += "<td style='padding:0px 5px'><button onclick=DeleteComponent(" + val.AutoId + ") style='height: 17px;line-height:0;' class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblAllotedComponentInfo tbody').append(tbody);
                }
            }
        },
        complete: function () {
            var Info = JSON.parse($(elem).closest('tr').find('td:eq(1)').text());
            _DonorId = Info.donor_id;
            _VisitId = Info.Visit_ID;
            _BloodCollectionId = Info.BloodCollection_Id;
            _BagType = Info.BagType;
            _BBTubeNo = Info.BBTubeNo;
            _BloodGroup = Info.BloodGroup_Id;

            $('#tblAllotedComponentInfo tbody tr').each(function () {
                var componentId = $(this).find('td:eq(1)').text();
                $('#tblComponentInfo tbody tr').each(function () {
                    if ($(this).find('td:eq(1)').text() == componentId)
                        $(this).closest('tr').remove();
                });
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertComponentReation() {
    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyComponentCreation";
        var objBO = {};
        var componentInfo = [];
        if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').length == 0) {
            alert('Please Select Component.');
            return
        }
        $('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').each(function () {
            if ($(this).closest('tr').find('td:eq(6)').find('#ddlPackSize option:selected').text() == 'Select')
                $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').addClass('error');
            else
                $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
        });
        if ($('#tblComponentInfo tbody .error').length > 0) {
            alert('Please Select Pack Size.');
            return
        }
        $('#tblComponentInfo tbody tr').each(function () {
            if ($(this).find('input[type=checkbox]').is(':checked')) {
                var date = $(this).closest('tr').find('td:eq(7)').text();
                componentInfo.push({
                    'ComponentID': $(this).closest('tr').find('td:eq(1)').text(),
                    'ComponentName': $(this).closest('tr').find('td:eq(3)').text(),
                    'Qty': $(this).closest('tr').find('td:eq(5)').find('input:text').val(),
                    'PackSize': $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize option:selected').text(),
                    'IsComponent': $(this).closest('tr').find('td:eq(2)').text(),
                    'EntryDate': '1900/01/01',
                    'ExpiryDate': date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0]
                });
            }
        });
        objBO.hosp_id = Active.unitId;
        objBO.donor_id = _DonorId;
        objBO.visit_id = _VisitId;
        objBO.BloodCollection_Id = _BloodCollectionId;
        objBO.BagType = _BagType;
        objBO.BBTubeNo = _BBTubeNo;
        objBO.BloodGroup = _BloodGroup;
        objBO.componentInfo = componentInfo;
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    ComponentInfo(_selectedDonor);
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
function DeleteComponent(AutoId) {
    if (confirm('Are you sure to delete?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyComponentCreation";
        var objBO = {};
        var componentInfo = [];
        componentInfo.push({
            'ComponentID': '-',
            'ComponentName': '-',
            'Qty': 0,
            'PackSize': '-',
            'IsComponent': 0,
            'EntryDate': '1900/01/01',
            'ExpiryDate': '1900/01/01'
        });
        objBO.hosp_id = Active.unitId;
        objBO.donor_id = AutoId;
        objBO.visit_id = '-';
        objBO.BloodCollection_Id = '-';
        objBO.BagType = '-';;
        objBO.BBTubeNo = '-';
        objBO.BloodGroup = '-';
        objBO.componentInfo = componentInfo;
        objBO.login_id = Active.userId;
        objBO.Logic = 'Delete';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    ComponentInfo(_selectedDonor);
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