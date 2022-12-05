$(document).ready(function () {
	FromCart();
	ToCart();
	GetStockTransaction();
	$("#txtQty").on("keydown", function (e) {
		if (e.which == 13) {
			Dispatch();
		}
	});
	$("#ddlFromCart").on('change', function () {
		GetItemsByLotNo();
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
				var itemid = $("#tblnavigate tbody").find('tr.selected').data('itemid');
				$("#hiditemId").val(itemid);
				var itemidtext = $("#tblnavigate tbody").find('tr.selected').text();
				$('#txtItemName').val(itemidtext);
				$('#ItemList').hide();
				GetStockByItemIdandCartId($("#ddlFromCart option:selected").val(), $("#hiditemId").val());
				break;
			case (KeyCode = 8):
				$("#txtInStock").val('');
				$("#txtQty").val('');
				$("#txtPackType").val('');
				$("#txtPackQty").val('');				
				$("#hiditemId").val('');
				$("#hidmasterkey").val('');
				$("#divpopup").hide();
				$("#tblStock tbody").empty();
				break;
			default:
				var val = $('#txtItemName').val();
				if (val == '') {
					$('#ItemList').hide();
				}
				else {
					$('#ItemList').show();
					ItemSelection();
				}
				break;
		}
	});
	$('#tblnavigate tbody').on('click', 'tr', function () {
		itemid = $(this).data('itemid');
		cart = $("#ddlFromCart option:selected").val();
		itemidtext = $(this).text();
		$("#hiditemId").val(itemid);

		$('#txtItemName').val(itemidtext);
		$('#ItemList').hide();
		$('#tblnavigate tbody').empty();
		
		GetStockByItemIdandCartId(cart, itemid);
	});
	$('#tblStock tbody').on('click', 'tr', function () {
		var inStock = $(this).find('td:nth-child(6)').text();
		var packType = $(this).find('td:nth-child(2)').text();
		var packqty = $(this).find('td:nth-child(4)').text();
		var mstkey = $(this).find('td:nth-child(1)').text();
		$('#divpopup').hide();
		$('#txtInStock').val(inStock);
		$('#txtPackType').val(packType);
		$('#txtPackQty').val(packqty);
		$('#hidmasterkey').val(mstkey);
		$('input[id=txtQty]').focus();
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
					var inStock = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(6)').text();
					var packType = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(2)').text();
					var packqty = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(4)').text();
					var mstkey = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(1)').text();
					$('#divpopup').hide();
					$('#txtInStock').val(inStock);
					$('#txtPackType').val(packType);
					$('#txtPackQty').val(packqty);
					$('#hidmasterkey').val(mstkey);
					$('input[id=txtQty]').focus();
					break;
			}
		}

	});
});
function FromCart() {
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
			$("#ddlFromCart").append($("<option></option>").val("ALL").html("ALL"));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlFromCart').append($('<option></option>').val(val.CartId).html(val.CartName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function ToCart() {
	var url = config.baseUrl + "/api/warehouse/wh_MiscellaneousReportQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = "AllCartList";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlToCart").empty();
			//$("#ddlToCart").append($("<option></option>").val("ALL").html("ALL"));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlToCart').append($('<option></option>').val(val.CartId).html(val.CartName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}

function ItemSelection() {
	var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
	var objConsumpBO = {};
	objConsumpBO.hosp_id = Active.unitId;
	objConsumpBO.CartId = $('#ddlFromCart option:selected').val();
	objConsumpBO.prm_1 = $('#txtItemName').val();
	objConsumpBO.Logic = "ItemSelection";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objConsumpBO),
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

function GetStockByItemIdandCartId(cartId, itemid) {
	var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
	var objConsumpBO = {};
	objConsumpBO.hosp_id = Active.unitId;
	objConsumpBO.CartId = cartId;
	objConsumpBO.item_id = itemid;
	objConsumpBO.Logic = "GetStockByItemIdAndCartId";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objConsumpBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {

			$('#tblStock tbody').empty();
			var htmldata = "";
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td>' + val.master_key_id + '</td>';
					htmldata += '<td>' + val.pack_type + '</td>';
					htmldata += '<td>' + val.batch_no + '</td>';
					htmldata += '<td>' + val.pack_qty + '</td>';
					htmldata += '<td>' + val.exp_date + '</td>';
					htmldata += '<td>' + val.qty + '</td>';
					htmldata += '</tr>';
				});
				$('#tblStock tbody').append(htmldata);
				$("#divpopup").show();
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

function GetItemsByLotNo() {
	var url = config.baseUrl + "/api/Warehouse/wh_PrintDispatchedByLotNo";
	var objBO = {};
	objBO.lot_no = $('#txtLotNo').val();
	objBO.login_id = Active.userId;
	objBO.CartId = $("#ddlFromCart option:selected").val();
	objBO.Logic = "GetItemsByLotNo";

	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var htmldata = "";
			$("#tblItemByLot tbody").empty();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';

					htmldata += '<td>' + val.item_name + '</td>';
					htmldata += '<td>' + val.master_key_id + '</td>';
					htmldata += '<td>' + val.pack_type + '</td>';
					htmldata += '<td>' + val.pack_qty + '</td>';
					htmldata += '<td>' + val.batch_no + '</td>';
					htmldata += '<td>' + val.exp_date + '</td>';
					htmldata += '<td>' + val.qty + '</td>';
					htmldata += '<td><button onclick=DispatchDelete(' + val.Rec_Id + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></button></td>';
					$('#txtLotNo').val(val.lot_no);
				});
				$("#tblItemByLot tbody").append(htmldata);
			}
			else {
				$('#txtLotNo').val("New");
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Dispatch() {
	var url = config.baseUrl + "/api/Warehouse/wh_DispatchStock";
	var objBO = {};
	var stqty = $('#txtInStock').val();
	var qty = $('#txtQty').val();
	if (qty > stqty) {
		alert('Transfer qunatity can not be geater than stock qty');
		return false;
	}
	objBO.lot_no = $('#txtLotNo').val();
	objBO.master_key_id = $("#hidmasterkey").val();
	objBO.qty = qty;
	objBO.trf_to = $("#ddlToCart option:selected").val();
	objBO.mfd_id = '';
	objBO.comp_code = '';
	objBO.trf_from = $("#ddlFromCart option:selected").val();
	objBO.login_id = Active.userId;;
	objBO.indent_no = "WITHOUT-INDENT";
	objBO.indent_autoId = "0";
	objBO.Logic = "Dispatch";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes("Success")) {
				var lotNo = data.split('|')[1];
				$("#txtInStock").val('');
				$("#txtQty").val('');
				$("#txtPackType").val('');
				$("#txtPackQty").val('');				
				$("#hiditemId").val('');
				$("#hidmasterkey").val('');
				$("#divpopup").hide();
				$("#tblStock tbody").empty();
				$("#txtItemName").val('');			
				GetItemsByLotNo();
			}
			else {
				alert(data);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		},		
	});
}
function DispatchComplete() {
	if (confirm('Are you sure to Complete Dispatch..!')) {
		var url = config.baseUrl + "/api/warehouse/wh_CompleteDispatch";
		var objBO = {};
		objBO.lot_no = $('#txtLotNo').val();
		objBO.login_id = Active.userId;
		objBO.Logic = "Dispatch";

		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
                if (data.includes("Success")) {
                    alert(data);
                    GetItemsByLotNo();

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
function DispatchDelete(autoid) {
	if (confirm('Are you sure to Delete..!')) {
        var url = config.baseUrl + "/api/warehouse/wh_DeleteDispatchWithoutIndent";
		var objBO = {};
		objBO.auto_id = autoid;
		objBO.fromIndent = $("#ddlFromCart option:selected").val();
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				console.log();
				if (data.includes("success")) {
					//var auto = data.split('|')[1];					
					GetItemsByLotNo();
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
function GetStockTransaction() {
	var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
	var objConsumpBO = {};
	objConsumpBO.Logic = "GetStockTransaction";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objConsumpBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var htmldata = "";
			$("#tblStockTransaction tbody").empty();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td>' + val.master_key_id + '</td>';
					htmldata += '<td>' + val.FromCart + '</td>';
					htmldata += '<td>' + val.ToCart + '</td>';
					htmldata += '<td>' + val.pack_type + '</td>';
					htmldata += '<td>' + val.pack_qty + '</td>';
					htmldata += '<td>' + val.batch_no + '</td>';
					htmldata += '<td>' + val.exp_date + '</td>';
					htmldata += '<td>' + val.qty + '</td>';
				});
				$("#tblStockTransaction tbody").append(htmldata);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

