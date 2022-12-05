$(document).ready(function () {
	FillCurrentDate("txtFrom");
	FillCurrentDate("txtTo");
	GetCartListByLoginId();
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
				$("#hiditemId").val(itemId);
				$('#txtItemName').val(itemName);
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
		$("#hiditemId").val(itemId);
		$('#txtItemName').val(itemName);
		$('#ItemList').hide();
		$('#tblnavigate tbody').empty();
	});
});
function GetCartListByLoginId() {
	var url = config.baseUrl + "/api/warehouse/wh_IndentQueries";
	var objIdentBO = {};
	objIdentBO.login_id = Active.userId;
	objIdentBO.Logic = "GetCartListByLogin";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objIdentBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("#ddlFromCart").empty();
				$("#ddlToCart").empty();
				$("#ddlFromCart").append($("<option></option>").val("ALL").html("ALL"));
				$("#ddlToCart").append($("<option></option>").val("ALL").html("ALL"));
				$.each(data.ResultSet.Table, function (key, value) {
					$("#ddlFromCart").append($("<option></option>").val(value.CartId).html(value.CartName)).select2();
					$("#ddlToCart").append($("<option></option>").val(value.CartId).html(value.CartName)).select2();
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
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
function DownloadExcel() {
	var url = config.baseUrl + "/api/warehouse/wh_ReportQueries";
	var objBO = {};
	objBO.from_cart = $('#ddlFromCart option:selected').val();
	objBO.to_cart = $('#ddlToCart option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	if ($('#hiditemId').val() == '') {
		objBO.ItemId = 'ALL';
	}
	else {
		objBO.ItemId = $('#hiditemId').val();
	}
	objBO.ReportType = $('input[name=ReportType]:checked').val();
	objBO.prm_1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "StockIssueReport";
	Global_DownloadExcel(url, objBO, "StockIssueReport.xlsx");
	$('#hiditemId').val('');
}