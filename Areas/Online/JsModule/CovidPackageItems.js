var itemIdval = "";
$(document).ready(function () {    
    PackageListForDropDown();
    GetPatientDetails();
    $('[data-toggle="tooltip"]').tooltip();
    $('#tblPackageItemsDone tbody').on('click', 'input:checkbox', function () {
        $('#tblPackageItemsDone tbody').find('input:checkbox:checked').prop('checked', false);
        $(this).prop('checked', true);
        itemIdval = $(this).data('itemid');   
        //alert(val);
        //$('span[id=ids]').attr('data-itemid', val);
        $('#ddlPackage').prop('selectedIndex', '0').attr('disabled', true);
    });
    $('#ddlPackage').on('change', function () {
        itemIdval = "";
        itemIdval = $(this).val();
        //alert(val);
        //$('span[id=ids]').attr('data-itemid', val);
    });
    $('#btnGetEmployee').on('click', function () {
        var empName = $('#txtEmpName').val();
        GetEmpDetails(empName);
    });
    $('#ddlProcBy').append($('<option value=' + Active.userId + '>' + Active.userName + '</option>'));
    FillCurrentDate('txtProcDate');
    $('span.enable').click(function () {
        $('#tblPackageItemsDone tbody').find('input:checkbox:checked').prop('checked', false);
        $('#ddlPackage').prop('selectedIndex', '0').attr('disabled', false);
    });    
});

function GetEmpDetails(empName) {
    var url = config.baseUrl + "/api/ApplicationResource/MenuQueries";
    var objBO = {};
    objBO.Prm1 = empName,
        objBO.Logic = 'GetEmployee'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            $('#ddlProcBy').empty().append($('<option>Select Employee</option>'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#txtEmpName').val('');
                $('#ddlProcBy').append($('<option></option>').val(val.emp_code).html(val.emp_name));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PackageListForDropDown() {
    var url = config.baseUrl + "/api/Online/PackageQueries";
    var obj = {};
    obj.Logic = 'PackageList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {           
            $('#ddlPackage').empty().append($("<option>Select Package Items</option>"));;
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlPackage').append($('<option value="' + val.ItemId + '">' + val.ItemName + '</option>'));
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDetails() { 
    var url = config.baseUrl + "/api/Online/PackageQueries";
    var from = "1900-01-01"
    var to = "1900-01-01"
    var obj = {};
    obj.DoctorId = "CH01";
    obj.PatientId = "-";
    obj.fromdate = from;
    obj.todate = to;
    obj.prm_1 = "-";
    obj.login_id = "-"
    obj.Logic = "CovidPatientListForDoctor";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $("#tblAdmittedIPDPatient tbody").empty();
            $.each(data.ResultSet.Table, function (key, val) {
                $('<tr data-dname="' + val.DoctorName + '" data-pname="' + val.patient_name + '" data-age="' + val.age + '" data-gender="' + val.gender + '" data-bdate="' + val.booking_date + '"><td><img id=' + val.PatientId + '  src="../../images/hand.png" onclick="PackageItemsDone(this.id)" style="width:16px;cursor:pointer" onclick="VitalReport(this.id)" /></td><td>' + val.booking_date + '</td><td>' + val.PatientId + '</td><td>' + val.patient_name + '</td><td>' + val.age + '</td>' + '<td>' + val.gender + '</td></tr>').appendTo($("#tblAdmittedIPDPatient tbody"));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PackageItemsDone(pId) {   
    $('span[id=ids]').data('patientid', pId);   
    var url = config.baseUrl + "/api/Online/PackageQueries";
    var obj = {};
    obj.DoctorId = "CH01";
    obj.PatientId = pId;
    obj.Logic = "PackageItemsDone";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {         
            $("#tblPackageItemsDone tbody").empty();
            var temp = "";
            var str = "";
            $.each(data.ResultSet.Table, function (key, val) {
                
                if (temp != val.HeaderName) {
                    str += "<tr>";
                    str += "<td colspan='6' style='background:#ddeeff;font-weight: bold;'>" + val.HeaderName + "</td>";
                    str += "</tr>";
                    temp = val.HeaderName;
                }
                str += "<tr>";
                if (temp != "Paid") {
                    str += "<td><input type='checkbox' data-itemid='" + val.ItemId + "'/></td>";
                }
                else {
                    str += "<td>-</td>";
                }
               
                str += "<td>" + val.ItemName + "</td>";
                str += "<td>" + val.sch_date + "</td>";
                str += "<td class='text-center'>" + val.proc_date + "</td>";
                str += "<td class='text-center'>" + val.proc_by + "</td>";
                if (temp != "Paid") {
                    str += "<td class='text-center' style='color:" + val.status_color + "'>" + val.ServiceStatus + "</td>";
                }
                else {
                    str += "<td class='text-center'>-</td>";
                }
               
                str += "</tr>";
            });
            $("#tblPackageItemsDone tbody").append(str);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function InsertCovidServices() {   
    if (Validation()) {       
        //alert($('span[id=ids]').data('itemid'));
        //alert(val);    
        
        var url = config.baseUrl + "/api/Online/InsertCovidServices";
        var objBO = {};
        objBO.patient_id = $('span[id=ids]').data('patientid');
        objBO.item_id = itemIdval;//$('span[id=ids]').data('itemid');
        objBO.proc_date = $('#txtProcDate').val();
        objBO.proc_by = $('#ddlProcBy option:selected').text();
        objBO.remark = $('#txtRemark').val();
        objBO.service_status = $('#ddlServiceStatus option:selected').text();
        objBO.Logic = "-";        
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data == 'Successfully Saved') {            
                    PackageItemsDone($('span[id=ids]').data('patientid'));
                    alert(data);
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
function Validation() {
    //var package = $('#tblPackageItemsDone tbody').find('input:checkbox:checked').length;
    //var paid = $('#ddlPackage option:selected').text();
    //if (package <= 0 || paid=='Select Package Items') {
    //    alert('Please Selec t Package or Paid Items..');
    //    return false;         
    //}
    return true;
}