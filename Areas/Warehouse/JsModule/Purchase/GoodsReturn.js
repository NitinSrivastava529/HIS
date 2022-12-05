$(document).ready(function () {
	GetVendor();
	submit();
	searchTable('txtSearch', 'tblHoldGoodsReturn');
	$('#txtSearchProduct').on('keyup', function (e) {
		var tbody = $('#tblnavigate').find('tbody');
		var selected = tbody.find('.selected');
		var KeyCode = e.keyCode;
		switch (KeyCode) {
			case (KeyCode = 8):
				$('#divpopup').hide();
				break;
			case (KeyCode = 26):
				$('#divpopup').hide();
				break;
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
				var val = $('#tblnavigate').find('tbody').find('.selected').text();
				var itemid = $('#tblnavigate').find('tbody').find('.selected').data('itemid');
				$(this).val(val).blur();
				$('span[data-itemid]').text(itemid);
				$('#ItemList').hide();
				GetStock(itemid);
				break;
			default:
				var val = $('#txtSearchProduct').val();
				if (val == '') {
					$('#ItemList').hide();
				}
				else {
					$('#ItemList').show();
					var search = $(this).val();
					var vendorType = $('input[type=radio]:checked').val();
					if (vendorType == 'Same') {
						GetItems(search, 'ItemByVendorId');
					}
					else if (vendorType == 'Any') {
						GetItems(search, 'ItemByItemId');
					}
				}
				break;
		}
	});
	$('#tblnavigate tbody').on('click', 'tr', function () {
		var val = $(this).text();
		var itemid = $(this).data('itemid');
		GetStock(itemid);
		$('#txtSearchProduct').val(val);
		$('span[data-itemid]').text(itemid);
		$('#ItemList').hide();

	});
	$('#tblStock tbody').on('mouseover', 'tr', function () {
		$('#tblStock tbody tr').removeAttr('style');
		$(this).css({ 'background-color': '#f60', 'color': '#fff' });
	});
	$('#tblStock tbody').on('click', 'tr', function () {
		$('#tblStock tbody tr').removeClass('selected');
		$(this).addClass('selected');
	});
	$('#tblStock tbody').on('dblclick', 'tr', function () {
		masterKey = $(this).find('td:eq(0)').text();
		$('span[data-masterkey]').text(masterKey);
		$('#txtQuantity').focus();
		$('#tblStock tbody').empty();
		$('#divpopup').hide();
	});
	$('#tblHoldGoodsReturn tbody').on('click', '.btnArrow', function () {
		purid = $(this).data('purid');
		vendor = $(this).data('vendor');
		PurchaseReturnInfo(purid);
		$('#ddlVendor option').map(function () {
			if ($(this).val() == vendor) {
				$('#ddlVendor').val(vendor).change()
			}
		});
		$('#modalHoldGoodsReturn').modal('hide');
		$('#BasicInfo').find('.form-control').attr('disabled', true).css({ 'background': '#fff', 'opacity': '100%' });
	});
	$('#PurchaseReturnInfo tbody').on('click', 'button', function () {
		masterkey = $(this).closest('tr').find('td:eq(0)').text();
		purid = $(this).data('purid');
		if (confirm('Are you sure want to delete this record?'))
			PurchaseReturnDelete(masterkey, purid);
	});
	$(document).on('keydown', function (e) {
		var popup = $('#divpopup').css('display') == 'block';
		//var btnsaveorder = $('#btnSaveOrder').hasClass('focus1');
		var KeyCode = e.keyCode;
		if (popup) {
			var tbody = $('#tblStock').find('tbody');
			var selected = tbody.find('.selected');
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
					masterKey = $('#tblStock tbody').find('tr.selected').find('td:eq(0)').text();
					StockQty = $('#tblStock tbody').find('tr.selected').find('td:eq(2)').text();
					$('span[data-masterkey]').text(masterKey);
					$('#txtStockQty').val(StockQty);
					$('#txtQuantity').focus();
					$('#tblStock tbody').empty();
					$('#divpopup').hide();
					break;
			}
		}

	});
});
function GetVendor() {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.Logic = 'GetVendorInfo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#ddlVendor').empty().append($('<option>Select Vendor</option>'));
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlVendor').append($('<option></option>').val(val.vendor_id).html(val.vendor_name)).select2();
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
function GetItems(search, logic) {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.vendor_id = $('#ddlVendor option:selected').val();
	objBO.Prm1 = search;
	objBO.Logic = logic;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblnavigate tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					$('#tblnavigate').show();
					$('<tr class="searchitems" data-itemid="' + val.item_id + '"><td>' + val.item_name + "</td></tr>").appendTo($('#tblnavigate tbody'));
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
function GetStock(itemid) {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.Prm1 = Active.warehouseId;
	objBO.vendor_id = $('#ddlVendor option:selected').val();
	objBO.item_id = itemid;
	objBO.Logic = 'GetStockItem';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0)
				$('#divpopup').show();
			$('#tblStock tbody').empty();
			var tbody = "";
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr>";
				tbody += "<td style='width: 24% !important'>" + val.master_key_id + "</td>";
				tbody += "<td>" + val.batch_no + "</td>";
				tbody += "<td>" + val.qty + "</td>";
				tbody += "<td>" + val.mfd_name + "</td>";
				tbody += "<td>" + val.pack_type + "</td>";
				tbody += "<td style='width: 17% !important'>" + val.exp_date + "</td>";
				tbody += "</tr>";
			});
			$('#tblStock tbody').append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PurchaseReturnInfo(purid) {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.Prm1 = purid;
	objBO.Logic = 'PurchaseReturnInfo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#PurchaseReturnInfo tbody').empty();
			var tbody = "";
			var temp = "";
			
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.vendor_name) {
					tbody += "<tr class='select-row'>";
					tbody += "<td colspan='7'>" + val.vendor_name + "</td>";
					tbody += "</tr>";
					temp = val.vendor_name;
				}
				tbody += "<tr>";
				tbody += "<td>" + val.Master_key_id + "</td>";
				tbody += "<td>" + val.item_name + "</td>";
				tbody += "<td>" + val.MRP + "</td>";
				tbody += "<td>" + val.trade + "</td>";
				tbody += "<td>" + val.npr + "</td>";
				tbody += "<td>" + val.Quantity + "</td>";
				tbody += "<td><button class='btn-danger btn-xs' data-purid=" + val.PurchReturnId + ">Delete</button></td>";
				tbody += "</tr>";
			});
			$('#PurchaseReturnInfo tbody').append(tbody);
			$.each(data.ResultSet.Table1, function (key, val) {
				$('#txtAmount').val(val.amount);
				$('#txtPurchReturnId').val(purid);
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function HoldGoodsReturn() {
	var url = config.baseUrl + "/api/Warehouse/wh_GoodsReturnQueries";
	var objBO = {};
	objBO.Logic = 'HoldGoodsReturn';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#tblHoldGoodsReturn tbody').empty();
			var tbody = "";
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.PurchReturnId + "</td>";
				tbody += "<td>" + val.return_date + "</td>";
				tbody += "<td><button class='btnArrow' data-vendor=" + val.vendor_id + " data-purid=" + val.PurchReturnId + "><i class='fa fa-arrow-right'></i></button></td>";
				tbody += "</tr>";
			});
			$('#tblHoldGoodsReturn tbody').append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PurchaseReturnInsert() {
	if (Validation()) {
		var url = config.baseUrl + "/api/Warehouse/wh_PurchaseReturnInsert";
		var objBO = {};
		objBO.CartId = Active.warehouseId;
		objBO.unit_id = Active.unitId;
		objBO.Vendor_Code = $('#ddlVendor option:selected').val();
		objBO.Item_id = $('span[data-itemid]').text();
		objBO.master_key_id = $('span[data-masterkey]').text();
		objBO.Quantity = $('#txtQuantity').val();
		objBO.PurchReturnId = $('#txtPurchReturnId').val();
		objBO.Logic = 'Insert';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('PR')) {
					$('#txtPurchReturnId').val(data);
					PurchaseReturnInfo(data);
					$('input[id=txtQuantity]').val('');
					$('input[id=txtSearchProduct]').val('').focus();
					$('span[data-itemid]').text('');
					$('span[data-masterkey]').text('');
					$('#BasicInfo').find('.form-control').attr('disabled', true).css({ 'background': '#fff', 'opacity': '100%' });
					$('#BasicInfo').find('input:radio:not(:checked)').attr('disabled', true);
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
function PurchaseReturnDelete(masterkey, purid) {
	var url = config.baseUrl + "/api/Warehouse/wh_PurchaseReturnInsert";
	var objBO = {};
	objBO.Vendor_Code = '-';
	objBO.Item_id = '-';
	objBO.Quantity = 0;
	objBO.unit_id = Active.unitId;
	objBO.master_key_id = masterkey;
	objBO.PurchReturnId = purid;
	objBO.Logic = 'Delete';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			PurchaseReturnInfo(purid);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function CompleteGoodsReturn() {
	if (confirm('Are you sure want to complete this Return?')) {
		var url = config.baseUrl + "/api/Warehouse/wh_PurchaseReturnInsert";
		var objBO = {};
		objBO.unit_id = Active.unitId;
		objBO.Vendor_Code = '-';
		objBO.Item_id = '-';
		objBO.master_key_id = '-';
		objBO.Quantity = '-';
		objBO.PurchReturnId = $('#txtPurchReturnId').val();
		objBO.Logic = 'CompleteGoodsReturn';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Goods')) {
					alert(data);
					$('#PurchaseReturnInfo tbody').empty();
					$('#txtPurchReturnId').val('Auto Generate');
					$('input[id=txtSearchProduct],input[id=txtQuantity],input[id=txtAmount]').val('');
					$('span[data-itemid]').text('');
					$('span[data-masterkey]').text('');
					$('#BasicInfo').find('.form-control').attr('disabled', false);
					$('#ddlVendor').prop('selectedIndex', '0').change();
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

function Validation() {
	vendor = $('#ddlVendor option:selected').text();
	item = $('#txtSearchProduct').val();
	qty = $('#txtQuantity').val();

	if (vendor == 'Select Vendor') {
		$('span.selection').find('span[aria-labelledby=select2-ddlVendor-container]').css('border-color', 'red').focus();
		alert('Please Select Vendor..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlVendor-container]').removeAttr('style');
	}
	if (item == '') {
		$('#txtSearchProduct').css('border-color', 'red').focus();
		alert('Please Provide Product Name..');
		return false;
	}
	else {
		$('#txtSearchProduct').removeAttr('style');
	}
	if (qty == '') {
		$('#txtQuantity').css('border-color', 'red').focus();
		alert('Please Provide Quantity..');
		return false;
	}
	else {
		$('#txtQuantity').removeAttr('style');
	}
	return true;
}
function submit() {
	$('#txtQuantity').on('keydown', function (e) {
		if (e.which == 13) {
			$('#btnSubmit').trigger('click');
		}
	});
}
function qtyCheck() {
	sq = $('#txtStockQty').val();
	q = $('#txtQuantity').val();
	if (parseInt(q) > parseInt(sq)) {
		$('#txtQuantity').val('');
		alert('Return Quantity should be Less then Stock Quantity..')
	}
}