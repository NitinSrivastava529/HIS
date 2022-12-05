
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
    var url = config.baseUrl + "/api/temporary/GetPatient";  
    var to = Properdate($("#txtDate").val(), '-')
    var objBO = {};
    objBO.Logic = $('#ddlStatus option:selected').text();
    objBO.from = to;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                
                $('#tblPatient tbody').empty();
                 var temp = "";
                    var str = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.customerSlab) {
                            str += "<tr>";
                            str += "<td colspan='3' style='background-color:#dff3ff;'>" + val.customerSlab + "</td>";
                            str += "</tr>";
                            temp = val.customerSlab;
                        }
                        str += "<tr>";
                        str += "<td >" + val.LedgerTransactionNo + "</td>";
                        str += "<td >" + val.PatientName + "</td>";
                        str += "<td >" + val.Gender + "</td>";
                        str += "<td >" + val.Age + "</td>";
                        str += "<td >" + val.amount + "</td>";
                        if (val.customerSlab.length < 2) {
                            str += "<td style='display:flex' class='text-green getPanel'>";
                            str += "<select class='ddlPanel2' id=' + val.LedgerTransactionNo + '>";
                            str += "<option>Covid Ward</option>";
                            str += "<option>OPD Hospital</option>";
                            str += "<option>OPD Home Sample</option>";
                            str += "<option>OPD general</option>";
                            str += "<option>Emergency ward</option>";
                            str += "<option>Traveller</option>";
                            str += "<option>Other</option>";
                            str += "</select><span data-visitno='" + val.LedgerTransactionNo + "' class='btn btn-success btnAttach'>Update</span></td > ";
                        }
                        else
                        {
                            str += "<td><a href='#' class='btn btn-success' download='download'>Download</a></td>";
                        }
                        str += "</tr>";
                    });
                $("#tblPatient tbody").append(str);

                //$.each(data.ResultSet.Table, function (key, val) {

                //    if (temp != val.customerSlab) {

                //        $('<tr><td>
                //    }

                //    $('<tr><td>' + val.LedgerTransactionNo + '</td><td>' + val.PatientName + '</td><td>' + val.Gender + '</td><td>' + val.Age + '</td><td>' + val.amount + '</td>' +
                //        '<td style="display:flex" class="text-green getPanel">' +
                //        '<select class="ddlPanel2" id=' + val.LedgerTransactionNo + '>' +
                //        '<option>Covid Ward</option>'+
                //        '<option>OPD Hospital</option>'+
                //        '<option>OPD Home Sample</option>'+
                //        '<option>OPD general</option>'+
                //        '<option>Emergency ward</option>'+
                //        '<option>Traveller</option>'+
                //        '<option>Other</option>'+
                //        '</select><span data-visitno=' + val.LedgerTransactionNo + ' class="btn btn-success btnAttach">Update</span></td ></tr > ').appendTo($('#tblPatient tbody'));
                //});
            }
            else {
                alert("Error");
            };
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





