var _IndentNo = "";
$(document).ready(function () {
	$('select').select2();
    FillCurrentDate('txtFromDate');
    FillCurrentDate('txttoDate');
    GetCartList();	  
});
function GetCartList() {
    $("ddlCart").empty();
    var url = config.baseUrl + "/api/LinenLaundry/LL_IndentProcess_Queries";
    var objIdentPendingBO = {};
    objIdentPendingBO.Logic = "PendingCartList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objIdentPendingBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCart").append($("<option></option>").val(value.CartId).html(value.CartName));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetIndentRequest() {
    $("#hidShowtab").val("0");
    var   from = $('#txtFromDate').val();
    var   to = $('#txttoDate').val();
    $('#tblIndentRequest tbody').empty();
    var url = config.baseUrl + "/api/LinenLaundry/LL_IndentProcess_Queries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.login_id = Active.login_id;
    objBO.CartId = $('#ddlCart').val();;
    objBO.from = from;
    objBO.to = to;
    objBO.Logic = "IndentRequests";
    
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var cname = "";
            $('#tblIndentRequest tbody').empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (cname != val.CartName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="7" style="font-weight:bold;background-color:#d1ebfb">' + val.CartName + '</td>';
                            htmldata += '</tr>';
                            cname = val.CartName;
                        }
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.IndentNo + '</td>';
                        htmldata += '<td>' + val.IndentDate + '</td>';
                        htmldata += '<td class="text-right">' + val.TotIndentQty + '</td>';
                        htmldata += '<td class="text-right">' + val.TotTrfQty + '</td>';
                        if (val.Indentstatus == "Partial") {
                            htmldata += '<td><a class="btn btn-warning btn-block btn-xs" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        else if (val.Indentstatus == "Complete") {
                            htmldata += '<td><a class="btn btn-success btn-block btn-xs" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        else if (val.Indentstatus == "Cancelled") {
                            htmldata += '<td><a class="btn btn-danger btn-block btn-xs" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetRequestDetailsAndCartPendingLot(' + '"' + val.Indent_no + '"' + ',' + '"' + val.CartId + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        else {
                            htmldata += '<td><a style="background: #999a9a;color:#fff;" class="btn btn-xs btn-block" href="javascript:void(0)" id="btnRequestDetails' + key + '" onclick=GetIndentInfo(' + '"' + val.IndentNo + '"' + ')>' + val.Indentstatus + '</a></td>';
                        }
                        htmldata += '</tr>';
                    });
                    $('#tblIndentRequest tbody').append(htmldata);
                }
            }
            else {
                MsgBox('Data not found....');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetIndentInfo(IndentNo) {
    _IndentNo = IndentNo;
    $('#selectedIndent').html("Selected Indent : "+IndentNo);
    var url = config.baseUrl + "/api/LinenLaundry/LL_IndentProcess_Queries";
    var objIdentPendingBO = {};
    objIdentPendingBO.Logic = "IndentInfo";
    objIdentPendingBO.indent_no = _IndentNo
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objIdentPendingBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var count = 0;
            $('#tblIndentInfo tbody').empty();
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;

                    tbody += "<tr>";
                    tbody += "<td class='text-center'>" + val.LaundaryStock + "</td>";
                    tbody += "<td>" + val.ItemId + "</td>";
                    tbody += "<td>" + val.item_name + "</td>";
                    tbody += "<td class='text-center'>" + val.RequiredQty + "</td>";
                    tbody += "<td class='text-center'>" + val.Issue_qty + "</td>";
                    tbody += "<td class='text-center'>" + val.PendingQty + "</td>";
                    if(val.LaundaryStock>0)
                        tbody += "<td><input type='number' onchange=checkStock(this) min='1' style='width:100%' class='text-right' value='" + val.TrfQty + "'/></td>";
                    else
                        tbody += "<td><input type='number' onchange=checkStock(this) min='1' style='width:100%' class='text-right' value='0'/></td>";
                    tbody += "<td class='text-center'>" + val.Intransit + "</td>";

                    tbody += "</tr>";
                });
            }
            $('#tblIndentInfo tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Transfer() {
	if (confirm('Are you sure to Transfer?')) {
		var url = config.baseUrl + "/api/LinenLaundry/LL_LinenDistribution";
		var objBO = [];
        $('#tblIndentInfo tbody tr').each(function () {
            var TrfQty= $(this).find('td:eq(6)').find('input').val()
            if (TrfQty > 0) {
                objBO.push({
                    'transid': _IndentNo,
                    'item_id': $(this).find('td:eq(1)').text(),
                    'qty': TrfQty,
                    'login_id': Active.userId,
                    'hosp_id': Active.unitId,
                });
            }
	     });
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GetIndentInfo(_IndentNo);
                }
				else {
					alert(data);
				}
			},
			error: function (error) {
				alert('Server Error');
			}
		});
	}
}
function checkStock(elem) {
    var laundryStock = $(elem).closest('tr').find('td:eq(0)').text();
	var qty = $(elem).val();
	if(eval(qty) > eval(laundryStock)){
		alert('Qty should be less than Laundry Stock..');
		$(elem).val(0);
	}
}
function Receipt(CartId) {
	var Prm1 = $('#ddlFilter option:selected').val();
	var url = "../Print/PrintLaundry?CartId=" + CartId + "&Prm1=" + Prm1;
	window.open(url, '_blank');
}