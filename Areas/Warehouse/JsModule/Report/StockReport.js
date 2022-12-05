$(document).ready(function () {
	$('.ItemIds').empty();
	GetCart();
	GetCategory();
	ReportSummary();
	$('#ReportSummary').on('click', 'input:radio', function () {
		var proc = $(this).data('proc');
		var pdf = $(this).data('pdf');
		var xl = $(this).data('xl');
		var desc = $(this).data('desc');
		var logic = $(this).data('logic');
		button(desc, xl, pdf, proc, logic);
	});
	$(document).on('click', '.remove', function () {
		$(this).closest('items').remove();
	});
	$(document).on('click', 'button', function () {
		var procName = $(this).data('proc');
		var reportType = $(this).data('report');
		var logic = $(this).data('logic');
		var prm1 = $(this).data('description');
		if (reportType == 'XL') {
			DownloadExcel(reportType, procName, prm1, logic)
		}
		else if (reportType == 'PDF') {
			DownloadPDF(reportType, procName, prm1, logic)
		}
	});
	$('#txtItemName').on('keyup', function (e) {
		var tbody = $('#tblnavigate').find('tbody');
		var selected = tbody.find('.selected');
		var KeyCode = e.keyCode;
		switch (KeyCode) {
			case (KeyCode = 40):
				tbody.find('.selected').removeClass('selected');
				if (selected.next().length == 0) {
					tbody.find('tr:first').addClass('selected');
				}
				else {
					tbody.find('.selected').removeClass('selected');
					selected.next().addClass('selected');
				}
				break;
			case (KeyCode = 38):
				tbody.find('.selected').removeClass('selected');
				if (selected.prev().length == 0) {
					tbody.find('tr:last').addClass('selected');
				}
				else {
					selected.prev().addClass('selected');
				}
				break;
			case (KeyCode = 13):
				var itemId = $("#tblnavigate tbody").find('tr.selected').data('itemid');
				var itemName = $("#tblnavigate tbody").find('tr.selected').text().trim();
				$('#txtItemName').val('');
				$('.ItemIds').append('<items data-id=' + itemId + '>' + itemName + '<span class="remove">x</span></items>');
				$('#ItemList').hide();
				$('#tblnavigate tbody').empty();
				break;
			default:
				var val = $('#txtItemName').val();
				if (val == '') {
					$('#ItemList').hide();
				}
				else {
					$('#ItemList').show();
					ItemSearch();
				}
				break;
		}
	});
	$('#tblnavigate tbody').on('click', 'tr', function () {
		itemId = $(this).data('itemid');
		itemName = $(this).text().trim();
		//$("#hiditemId").val(itemId);
		$('#txtItemName').val('');
		$('.ItemIds').append('<items data-id=' + itemId + '>' + itemName + '<span class="remove">x</span></items>');

		$('#ItemList').hide();
		$('#tblnavigate tbody').empty();
	});
});
function ItemSearch() {
	if ($('#txtItemName').val().length > 2) {
		var url = config.baseUrl + "/api/warehouse/wh_ReportQueries";
		var objBO = {};
		objBO.prm_1 = $('#txtItemName').val();
		objBO.from = '1900/01/01';
		objBO.to = '1900/01/01';
		objBO.login_id = Active.userId;
		objBO.Logic = "ItemSearch";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			contentType: "application/json;charset=utf-8",
			dataType: "JSON",
			success: function (data) {
				$('#ItemList tbody').empty();
				if (data != '') {
					$.each(data.ResultSet.Table, function (key, val) {
						$('#ItemList').show();
						$('<tr class="searchitems" data-itemid=' + val.item_id + '><td>' + val.item_name + "</td></tr>").appendTo($('#ItemList tbody'));
					});
				}
				else {
					$('#ItemList').hide();
				}
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function GetCart() {
	var url = config.baseUrl + "/api/warehouse/wh_MiscellaneousReportQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = "GetCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlCart").append($("<option></option>").val("ALL").html("ALL"));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlCart').append($('<option></option>').val(val.CartId).html(val.CartName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function GetCategory() {
	var url = config.baseUrl + "/api/warehouse/wh_MiscellaneousReportQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = "Category";

	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlCategory").append($("<option></option>").val("ALL").html("ALL"));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlCategory').append($('<option></option>').val(val.CategoryId).html(val.CategoryName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function ReportSummary() {
	var url = config.baseUrl + "/api/warehouse/wh_MiscellaneousReportQueries";
	var objBO = {};
	objBO.prm_1 = "StockReport";
	objBO.login_id = Active.userId;
	objBO.Logic = "MiscellaneousReport";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("#ReportSummary").empty();
				var report = "";
				$.each(data.ResultSet.Table, function (key, val) {
					report += "<div class='col-md-2' style='width:20%'>";
					report += "<label>";
					report += "<input type='radio' name='report' value='" + val.ReportName + "' data-logic='" + val.logicName + "' data-proc='" + val.ProcName + "' data-desc='" + val.Description + "' data-xl='" + val.xl + "' data-pdf='" + val.pdf + "' />&nbsp;" + val.ReportName.toString().replace('<', '&#60;') + "";
					report += "</label>";
					report += "</div>";
				});
				$("#ReportSummary").append(report);
			}
		},
		complete: function (response) {
			//FillCurrentDateByInputType();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function DownloadExcel(reportType, procName, prm1, logic) {
	var url = config.baseUrl + "/api/warehouse/wh_PurchaseReportQueries";
	var objBO = {};
	var itemids = [];
	$('.ItemIds items').each(function () {
		itemids.push($(this).data('id'));
	});
	objBO.ReportType = reportType;
	objBO.ProcName = procName;
	objBO.from = $('#txtFromDate').val();
	objBO.to = $('#txtToDate').val();
	objBO.CartId = $('#ddlCart option:selected').val();
	objBO.Category = $('#ddlCategory option:selected').val();;
	objBO.ItemIds = itemids.join('|');
	objBO.prm_1 = prm1.toString().replace('<', '&#60;');
	objBO.login_id = Active.userId;
	objBO.Logic = logic;
	Global_DownloadExcel(url, objBO, logic + '.xlsx');
	$('.ItemIds').empty();
}

function DownloadPDF(reportType, procName, prm1, logic) {
	var objBO = {};
	var itemids = [];
	$('.ItemIds items').each(function () {
		itemids.push($(this).data('id'));
	});
	objBO.ReportType = reportType;
	objBO.ProcName = procName;
	objBO.from = $('#txtFromDate').val();
	objBO.to = $('#txtToDate').val();
	objBO.CartId = $('#ddlCart option:selected').val();
	objBO.Category = $('#ddlCategory option:selected').val();;
	objBO.ItemIds = itemids.join('|');
	objBO.prm_1 = prm1.toString().replace('<', '');
	objBO.login_id = Active.userId;
	objBO.Logic = logic;
	var url = "../Print/PurchaseReport?ProcName=" + objBO.ProcName + "&from=" + objBO.from + "&to=" + objBO.to + "&CartId=" + objBO.CartId + "&Category=" + objBO.Category + "&ItemIds=" + objBO.ItemIds + "&prm_1=" + objBO.prm_1 + "&login_id=" + objBO.login_id + "&Logic=" + objBO.Logic;
	window.open(url, '_blank');
	$('.ItemIds').empty();
}
function GetReport(from, to, procName, prm1, prm2, logic) {
	var url = config.baseUrl + "/api/warehouse/wh_MiscellaneousReportQueries";
	var objBO = {};
	objBO.from = from;
	objBO.to = to;
	objBO.ProcName = procName;
	objBO.prm_1 = prm1;
	objBO.prm_2 = prm2;
	objBO.Logic = logic;
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

function button(desc, xl, pdf, proc, logic) {
	$('#ReportButton').empty();
	$('#ReportButton').append(
		'<button class="btn-flat btn-warning" data-description="' + desc + '" data-report="XL" data-logic=' + logic + ' data-proc="' + proc + '" style="display:' + xl + '">XL Report</button>' +
		'&nbsp;<button class="btn-flat btn-success" data-description="' + desc + '" data-report="PDF" data-logic=' + logic + ' data-proc="' + proc + '" style="display:' + pdf + '">PDF Report</button>'
	)
}