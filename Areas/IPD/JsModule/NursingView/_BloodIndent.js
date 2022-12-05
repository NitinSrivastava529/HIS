var _selectedDonor;
$(document).ready(function () {
    ComponentInfo();
    $('#dash-dynamic-section').find('label.title').text('Blood Indent').show();
    $('select').select2();
    $('#tblComponentInfo thead').on('change', 'input:checkbox', function () {
        var isCheck = $(this).is(':checked');
        if (isCheck)
            $(this).parents('table').find('tbody input:checkbox').prop({ 'checked': true, 'disabled': false });
        else
            $(this).parents('table').find('tbody input:checkbox').prop({ 'checked': false, 'disabled': false });
    });
});
function ComponentInfo() {
    $('#tblComponentInfo tbody').empty();
    $('#tblAllotedComponentInfo tbody').empty();
    var url = config.baseUrl + "/api/IPDNursingService/IPD_PatientQueries";
    var objBO = {};
    objBO.hosp_id = '';
    objBO.UHID = '';
    objBO.IPDNo = _IPDNo;
    objBO.Floor = '';
    objBO.PanelId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '';
    objBO.Prm2 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'ComponentInfo';
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
                        tbody += "<td style='padding:0px 5px'><input type='checkbox'/>";
                        tbody += "<td class='hide'>" + val.ComponentID + "</td>";
                        tbody += "<td class='hide'>" + val.itemId + "</td>";
                        tbody += "<td class='hide'>" + val.isComponent + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.AliasName + "</td>";
                        tbody += "<td><input type='text' disabled class='form-control' style='height: 24px;padding: 4px;text-align:right' value='1'/></td>";
                        tbody += "</tr>";
                    });
                    $('#tblComponentInfo tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = "";
                    var temp = "";
                    var counter = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        counter++;
                        if (temp != val.IndentDate) {
                            tbody += "<tr style='background:#ddd'>";
                            tbody += "<td colspan='7'>" + val.IndentDate + "</td>";
                            tbody += "</tr>";
                            temp = val.IndentDate;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + counter + "</td>";
                        tbody += "<td class='hide'>" + val.AutoId + "</td>";
                        tbody += "<td class='hide'>" + val.ComponentId + "</td>";
                        tbody += "<td class='hide'>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td class='text-right'>" + val.IndentQty + "</td>";
                        //tbody += "<td style='padding:0px 5px'><button onclick=DeleteComponent(" + val.AutoId + ") style='height: 17px;line-height:0;' class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td style='padding:0px 5px'>-</td>";
                        tbody += "</tr>";
                    });
                    $('#tblAllotedComponentInfo tbody').append(tbody);
                }
            }
        },
        complete: function () {
            //$('#tblAllotedComponentInfo tbody tr').each(function () {
            //    var componentId = $(this).find('td:eq(2)').text();
            //    $('#tblComponentInfo tbody tr').each(function () {
            //        if ($(this).find('td:eq(1)').text() == componentId)
            //            $(this).closest('tr').remove();
            //    });
            //});
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertIndentInfo() {
    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/IPDNursingService/BB_InsertModifyIndentInfo";
        var objBO = {};
        var componentInfo = [];
        if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').length == 0) {
            alert('Please Select Component.');
            return
        }
        $('#tblComponentInfo tbody tr').each(function () {
            if ($(this).find('input[type=checkbox]').is(':checked')) {
                var date = $(this).closest('tr').find('td:eq(7)').text();
                componentInfo.push({
                    'ItemId': $(this).closest('tr').find('td:eq(2)').text(),
                    'ComponentID': $(this).closest('tr').find('td:eq(1)').text(),
                    'IndentQty': $(this).closest('tr').find('td:eq(6)').find('input:text').val(),
                });
            }
        });
        objBO.hosp_id = Active.unitId;
        objBO.IPOPNo = _IPDNo;
        objBO.IPOPType = 'IPD';
        objBO.IndentNo = "-";
        objBO.Prm1 = $('#tblAdviceHeader tbody tr:eq(0)').find('td:eq(3)').text();
        objBO.Prm2 = "-";
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
                    ComponentInfo();
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
        var url = config.baseUrl + "/api/IPDNursingService/BB_InsertModifyIndentInfo";
        var objBO = {};
        var componentInfo = [];
        componentInfo.push({
            'ItemId': '-',
            'ComponentID': '-',
            'IndentQty': 0,
        });
        objBO.hosp_id = Active.unitId;
        objBO.IPOPNo = "-";
        objBO.IndentNo = "-";
        objBO.Prm1 = AutoId;
        objBO.Prm2 = "-";
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
                    ComponentInfo();
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