
$(document).ready(function () {
    FillCurrentDate('txtDate');
    GetPatient();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblPatient tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#txtSearchLinkPanel').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblLinkPanel tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblPatient tbody').on('click', 'span.btnAttach', function () {   
        var visit = $(this).data('visitno');
        var section = $(this).closest('tr').find('select option:selected').text();
        UpdateRemark(section, visit)
    });
});
function GetPatient() {
    
    var section = $('#ddlStatus option:selected').text();
    if (section== "Assigned") {
        AssignedNew();
    }
    else {
        var url = config.baseUrl + "/api/temporary/GetPatient";
        var to = Properdate($("#txtDate").val(), '-')
        var objBO = {};
        objBO.Logic = $('#ddlStatus option:selected').text();
        objBO.Prm1 = $('#ddlBookBy option:selected').val();
        objBO.from = to;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                $('#tblPatient tbody').empty();
                var temp = "";
                var str = "";
                $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.customerSlab) {
                            str += "<tr>";
                            str += "<td colspan='3' style='background-color:#dff3ff;'>" + val.customerSlab + "</td>";
                            str += "<tr>";
                            temp = val.customerSlab;
                        }
                        str += "<tr>";
                        str += "<td >" + val.Unit_Name + "</td>";
                        str += "<td >" + val.LedgerTransactionNo + "</td>";
                        str += "<td >" + val.PatientName + "</td>";
                        str += "<td >" + val.Gender + "</td>";
                        str += "<td >" + val.Age + "</td>";
                        str += "<td >" + val.amount + "</td>";
                        str += "<td ></td>";
                        str += "<td ></td>";
                        str += "<td style='display:flex' class='text-green getPanel'>";
                        str += "<select id='ddlPanel" + val.LedgerTransactionNo +"'  >";
                        str += "<option value='Covid Ward'>Covid Ward</option>";
                        str += "<option value='OPD Hospital'>OPD Hospital</option>";
                        str += "<option value='OPD Home Sample'>OPD Home Sample</option>";
                        str += "<option value='OPD general'>OPD general</option>";
                        str += "<option value='Emergency ward'>Emergency ward</option>";
                        str += "<option value='Traveller'>Traveller</option>";
					str += "<option value='Staff'>Staff</option>";
					str += "<option value='IPD'>IPD</option>";
                        str += "<option value='Other'>Other</option>";
                        str += "</select><span data-visitno='" + val.LedgerTransactionNo + "' class='btn btn-success btnAttach'>Update</span></td > ";
                        str += "<tr>";
                    });
                $("#tblPatient tbody").append(str);
             },
            complete: function (com) {
                var com = JSON.parse(com.responseText);
                $.each(com.ResultSet.Table, function (key, val) {
                    $("#ddlPanel" + val.LedgerTransactionNo +" option[value='" + val.customerSlab + "']").prop('selected', true);
                });
            },

            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function AssignedNew() {
    var url = config.baseUrl + "/api/temporary/GetAssignedReport";
    var to = Properdate($("#txtDate").val(), '-')
    var objBO = {};
    objBO.Logic = $('#ddlStatus option:selected').text();
    objBO.Prm1 = $('#ddlBookBy option:selected').val();
    objBO.from = to;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
                $('#tblPatient tbody').empty();
                $("#tblPatient tbody").append(data);
          
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateRemark(s,v) {
    var url = config.baseUrl + "/api/temporary/UpdateRemark";
    var objBO = {};
    objBO.section = s;
    objBO.visit_no = v;      
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $(this).closest('tr').remove();
            alert(data);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

//Validation
function Validate() {
    var val = $('span[data-pid]').text();

    if (val == 'Select Panel') {
        alert('Please Select Panel..');
        return true;
    }
    return true;
}
function Clear() {
    $('#tblLinkPanel tbody').find('input[type=checkbox]').prop('checked', false);
}





