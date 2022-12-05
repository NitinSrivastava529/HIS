var global = {
	ipdno: '',
	RefCode: ''
}
$(document).ready(function () {
    CloseSidebar();
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    $('#tblPatient tbody').on('click', 'button', function () {
        selectRow($(this));
        var ipdno = $(this).closest('tr').find('td:eq(0)').text();
        global.ipdno = ipdno;
        CommisionCategoryList(ipdno)
    });
});
function GetReport(ReportType) {
    var url = config.baseUrl + "/api/commission/HIS_ShareQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var obj = {};
    obj.unit_id = "CH01";
    obj.from = from;
    obj.to = to;
    obj.login_id = Active.userId;
    obj.Logic = $("#ddlReports").val();
    obj.ReportType = ReportType;

    if (ReportType == "Excel") {
        Global_DownloadExcel(url, obj, "CommReport.xlsx");
    }
    else {
        $('#tblPatient tbody').empty();
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                var tbody = "";
                var temp = "";
                var ref_commision = 0;
                var t_commision = 0;
                var ct = 1;
                $.each(data.ResultSet.Table, function (key, val) {
                    global.ipdno = val.IPDNo;
                    if (temp != val.ref_name) {
                        if (ct > 1) {
                            tbody += "<tr>";
                            tbody += "<td colspan='8' style='text-align:right'>Sum of Referral</td>";
                            tbody += "<td colspan='8'>" + ref_commision + "</td>";
                            tbody += "</tr>";
                        }
                        tbody += "<tr>";
                        tbody += "<td colspan='11' style='background-color:#dce2f9;font-size:12px'>" + val.ref_name + " [" + val.ref_code + " ]" + "</td>";
                        tbody += "</tr>";
                        temp = val.ref_name
                        ref_commision = 0;
                    }
                    if (val.IsPaid=="1")
                        tbody += "<tr style='color:red'>";
                    else
                        tbody += "<tr'>";

                    tbody += "<td>" + val.IPDNo + "</td>";
                    tbody += "<td>" + val.billDate + "</td>";
                    tbody += "<td>" + val.patient_name + "</td>";
                    tbody += "<td>" + val.panel_name + "</td>";
                    tbody += "<td>" + val.Amount + "</td>";
                    tbody += "<td>" + val.exclusion + "</td>";
                    tbody += "<td>" + val.NetAmount + "</td>";
                    tbody += "<td>" + val.commission_Perc + "</td>";
                    tbody += "<td>" + val.commission_amount + "</td>";
                    tbody += "<td>" + val.PayTo + "</td>";
                    tbody += "<td><button class='tbl-btn btn-warning'>>></button></td>";
                    tbody += "</tr>";

                    ref_commision = ref_commision + val.commission_amount;
                    t_commision = t_commision + val.commission_amount;
                    ct = ct + 1;

                });
                tbody += "<tr>";
                tbody += "<td colspan='8' style='text-align:right'>Grand Total</td>";
                tbody += "<td colspan='8'>" + t_commision + "</td>";
                tbody += "</tr>";

                $('#tblPatient tbody').append(tbody);

            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

function CommisionCategoryList(prm1) {
	var url = config.baseUrl + "/api/commission/HIS_ShareQueries";
	var objBO = {};
	objBO.trn_type = '-';
	objBO.from = '-';
	objBO.to = '-';
	objBO.prm_1 = prm1;
	objBO.prm_2 = '-';
	objBO.Logic = "Commision:CategoryList";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			$('#tblCommissionList tbody').empty();
			var tbody = "";
			$.each(data.ResultSet.Table1, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.CategoryName + "</td>";
                tbody += "<td>" + val.Amount.toFixed(0) + "</td>";
                tbody += "<td>" + val.Exclusion.toFixed(0) + "</td>";
                tbody += "<td>" + val.NetAmount.toFixed(0) + "</td>";
                tbody += "<td>" + val.comission.toFixed(0) + "</td>";
				tbody += "</tr>";
            });
            $('#tblCommissionList tbody').append(tbody);
        },
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetEmployeeList() {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.prm_1 = $('txtEmpName').text();;
    objConsumpBO.Logic = "GetEmployeeList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("#ddlEmployee").empty().append($("<option selected='selected'></option>").val(0).html('Select Employee'));
                $('#txtEmpName').val('');
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlEmployee").append($("<option></option>").val(value.emp_code).html(value.emp_name)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function HandOverPayment() {
    if ($('#ddlEmployee option:selected').text() == 'Select Employee') {
        alert('Please Choose Employee..!');
        return;
    }
    if (global.ipdno=='') {
        alert('Please select  IPD No..!');
        return;
    }
    var url = config.baseUrl + "/api/commission/HIS_InsertReferralcommission";
    var objBO = {};
    objBO.IPDNo = global.ipdno;
    objBO.ref_code = $('#ddlEmployee').val()
    objBO.patient_name = "-";
    objBO.gender = "-";
    objBO.commission_Perc = '10';
    objBO.commission_amount = '23.00';
    objBO.login_id = Active.userId;
    objBO.Logic = "PayShare";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                let ref_name = $('#ddlReferralForCommission option:selected').text()
                alert(data);
                global.ipdno = $('#tblPatient tbody').find('tr.select-row').find('td:eq(0)').text();;
                global.RefCode = objBO.ref_code;
                $('#referralSection').show("slide", { direction: "right" }, 500);
                $('#txtAllotedReferral').html(ref_name.concat(' [', objBO.ref_code, ']'));
                $('#btnSyncProcess').attr('disabled', false);
                $('#btnSetReferral').attr('disabled', true);
            }
            else {
                global.ipdno = '';
                global.RefCode = '';
                $('#referralSection').hide("slide", { direction: "right" }, 500);
                $('#txtAllotedReferral').html('');
                $('#btnSetReferral').attr('disabled', true);
                $('#btnSyncProcess').attr('disabled', true);
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}