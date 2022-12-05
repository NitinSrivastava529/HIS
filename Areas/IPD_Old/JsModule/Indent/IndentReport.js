
$(document).ready(function () {
    GetPatientDetails();
    $('#txtSearchPatient').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblAdmittedIPDPatient tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblAdmittedIPDPatient tbody').on('click', '.PatientReport', function () {
        $('span[data-pname]').text($(this).data('pname'));
        $('span[data-gender]').text($(this).data('gender'));
        $('span[data-age]').text($(this).data('age'));
        IPOP_IndentQueries($(this).data('ipd'));
    });
    $('#tblReport tbody').on('click', 'b.IndentReceipt', function () {
        var indent_no = $(this).data('indentno');
        PrintIndentReceipt(indent_no)
    });
});
function GetIndentByIPDNo() {
    var IPDNO = $('#txtIPDNo').val()
    IPOP_IndentQueries(IPDNO);
}
function GetPatientDetails() {
    var url = config.baseUrl + "/api/IPDNursing/GetAdmittedIPDPatient";
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            $("#tblAdmittedIPDPatient tbody").empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.IPDNO + '</td><td>' + val.PName + '</td><td>' + val.Patient_ID + '</td>' +
                        '<td class="btn text-green PatientReport" data-PName="' + val.PName + '" data-Gender="' + val.Gender + '" data-Age="' + val.Age + '" data-AdmitedDate="' + val.AdmitDate + '" data-UHID="' + val.Patient_ID + '"data-IPD="' + val.IPDNO + '"data-RoomNo="' + val.RoomName + '"data-companyname="' + val.Company_Name + '"data-department="' + val.Department + '">' +
                        '<span class="fa fa-arrow-right"></span></td></tr>').appendTo($("#tblAdmittedIPDPatient tbody"));
                });
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
function IPOP_IndentQueries(ipop) {
    var url = config.baseUrl + "/api/IPDNursing/IPOP_IndentQueries";
    var objBO = {};
    objBO.IPOPNoList = ipop;
    objBO.Logic = "IndentReportofIPD";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data != '') {
                $("#tblReport tbody").empty();
                var temp = "";
                var str = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.indent_no) {
                        str += "<tr>";
                        str += "<th style='background-color:#dff3ff'>Indent No<b data-indentno='" + val.indent_no + "' class='pull-right fa fa-print IndentReceipt' style='font-size:14px !important;cursor: pointer;'></b></th>";
                        str += "<th style='background-color:#dff3ff'>Indent Date Time</th>";
                        str += "<th style='background-color:#dff3ff'>Sale Start Time</th>";
                        str += "<th style='background-color:#dff3ff'>Complete Time</th>";
                        str += "<th style='background-color:#dff3ff'>Tat(Hrs)</th>";
                        str += "</tr>";

                        str += "<tr>";
                        str += "<th>" + val.indent_no + "</th>";
                        str += "<th>" + val.indent_datetime + "</th>";
                        str += "<th>" + val.init_date + "</th>";
                        str += "<th>" + val.comp_date + "</th>";
                        str += "<th>" + val.Tat + "</th>";
                        str += "</tr>";

                        temp = val.indent_no;
                    }
                    str += "<tr>";
                    str += "<td >" + val.item_name + "</td>";
                    str += "<td >" + val.qty + "</td>";
                    str += "<td >" + val.issue_qty + "</td>";
                    str += "<td >" + val.reject_remarks + "</td>";
                    str += "<tr>";

                });
                $("#tblReport tbody").append(str);
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
function PrintIndentReceipt(indent_no) {
    var url = "../Print/RequisitionSlip?indent_no=" + indent_no;
    window.open(url, '_blank');
}

