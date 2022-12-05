
$(document).ready(function () {
    FillCurrentDate('txtFilterFrom')
    FillCurrentDate('txtFilterTo')
    CloseSidebar();
});
function IPDSalebyIPDNo() {
    $('#div#skill .circle').show();
    if ($('#txtSearchIPDNO').val() == '') {
        alert('Please Provide IPD No.');
        return
    }
    var url = config.baseUrl + "/api/Pharmacy/Hospital_Queries";
    var objBO = {};
    objBO.unit_id = '-';
    objBO.uhid = '-'; 
    objBO.prm_1 = $('#txtSearchIPDNO').val();
    objBO.prm_2 = $('#ddlFilterBy option:selected').text();
    objBO.prm_3 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "IPDSalebyIPDNo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.Msg.includes('Success')) {
                GetBillInfo();
            }
            else {
                alert(data.Msg);
            }
        },
        complete: function () {
            $('#div#skill .circle').hide();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetBillInfo() {
    $('#tblIPDInfo tbody').empty();
    if ($('#txtSearchIPDNO').val() == '') {
        alert('Please Provide IPD No.');
        return
    }
    var url = config.baseUrl + "/api/Pharmacy/Pharmacy_Queries";
    var objBO = {};
    objBO.IPDNo = $('#txtSearchIPDNO').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.prm_1 = '-';
    objBO.prm_2 = $('#ddlFilterBy option:selected').text();
    objBO.Logic = "GetBillInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            var tbody = "";
            var count = 0;
            var countName = "";
            var TAmount = 0;
            var TTAmount = 0;
            var tCashAmount = 0;
            var temp = "";
            var temp1 = "";
            var indent_date = data.ResultSet.Table[0].indent_date;
            var totalLength = data.ResultSet.Table.length;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (indent_date != val.indent_date) {
                            tbody += "<tr style='background:#afdfc9'>";
                            tbody += "<td colspan='9' class='text-right'><b>Total</b></td>";
                            tbody += "<td class='text-right'><b>" + TTAmount.toFixed(2) + "</b></td>";
                            tbody += "<td colspan='4'></td>";
                            tbody += "</tr>";
                            TTAmount = 0;
                            indent_date = val.indent_date
                        }
                        TTAmount += val.amount;
                        if (temp != val.IPDNo) {
                            tbody += "<tr style='background:#edd591'>";
                            tbody += "<td colspan='14'><b>IPD No. :</b> " + val.IPDNo + ', <b>Patient Name : </b>' + val.pt_name + "</td>";
                            tbody += "</tr>";
                            temp = val.IPDNo;
                        }
                        if (temp1 != val.indent_date) {
                            tbody += "<tr style='background:#ddd'>";
                            tbody += "<td colspan='14'>" + val.indent_date + "</td>";
                            tbody += "</tr>";
                            temp1 = val.indent_date;
                        }

                        TAmount += val.amount;
                        if (val.SaleStatus == 'Pending') {
                            tbody += "<tr style='background:#e5bcc2'>";
                        }
                        else {
                            tbody += "<tr>";
                        }

                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.indent_no + "</td>";
                        tbody += "<td>" + val.IndentStatus + "</td>";
                        tbody += "<td class='text-right'>" + val.ItemCount + "</td>";
                        tbody += "<td>" + val.SaleStatus + "</td>";
                        tbody += "<td><a class='billrecpt' href='/IPD/Print/SalesBill?InvoiceNo=" + val.sale_inv_no + "' target='_blank'>" + val.sale_inv_no + "</a></td>";
                        tbody += "<td class='text-right'>" + val.saleCount + "</td>";
                        tbody += "<td class='text-right'>" + val.Total + "</td>";
                        tbody += "<td class='text-right'>" + val.discount + "</td>";
                        tbody += "<td class='text-right'>" + val.amount + "</td>";
                        tbody += "<td>" + val.pay_mode + "</td>";
                        tbody += "<td>" + val.card_no + "</td>";
                        tbody += "<td>" + val.VerifiedBy + "</td>";
                        tbody += "<td>" + val.VerifyDate + "</td>";
                        tbody += "</tr>";
                        if (count == totalLength) {
                            tbody += "<tr style='background:#afdfc9'>";
                            tbody += "<td colspan='9' class='text-right'><b>Total</b></td>";
                            tbody += "<td class='text-right'><b>" + TTAmount.toFixed(2) + "</b></td>";
                            tbody += "<td colspan='4'></td>";
                            tbody += "</tr>";
                            TTAmount = 0;
                        }
                    });

                }

            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody += "<tr style='background:#ffaeae'>";
                        tbody += "<td colspan='9' class='text-right'><b>Total Amount</b></td>";
                        tbody += "<td class='text-right'><b>" + TAmount.toFixed(2) + "</b></td>";
                        tbody += "<td class='text-right'>Cash Amount : <b>" + val.tCashAmount.toFixed(2) + "</b></td>";
                        tbody += "<td class='text-right'>Credit Amount : <b>" + val.tCreditAmount.toFixed(2) + "</b></td>";
                        tbody += "<td colspan='2'></td>";
                        tbody += "</tr>";
                    });
                }
            }

            $('#tblIPDInfo tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Verify() {
    var count = 0;
    if (confirm('Are you sure to Verify')) {
        if ($('#txtSearchIPDNO').val() == '') {
            alert('Please Provide IPD No.');
            return
        }
        $('#tblIPDInfo tbody tr').each(function () {
            if ($(this).find('td:eq(4)').text() == 'Pending')
                count++;
        });
        if (count > 0) {
            alert('Please finalise all pending sales from pharmacy then verify.');
            return;
        }
        var url = config.baseUrl + "/api/Pharmacy/Pharmacy_InsertBillInfo";
        var objBO = {};
        objBO.prm_1 = $('#txtSearchIPDNO').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "VerifyBill";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                }
                else {
                    alert(data);
                }
            },
            complete: function () {
                $('#div#skill .circle').hide();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function DownloadExcel() {
    var url = config.baseUrl + "/api/Pharmacy/Pharmacy_Queries";
    var objBO = {};
    objBO.IPDNo = $('#txtSearchIPDNO').val();
    objBO.from = $('#txtFilterFrom').val();
    objBO.to = $('#txtFilterTo').val();
    objBO.prm_1 = '-';
    objBO.prm_2 = '-';
    objBO.Logic = "GetBillInfoForBetweenDate";
    objBO.ReportType = 'Excel';   
    Global_DownloadExcel(url, objBO, "BillInfoBetweenDate.xlsx");
}