$(document).ready(function () {
	CloseSidebar();
	FillCarts();
	searchStock('txtSearchProduct', 'tblLinenStocks');
	LinenStocks();
	$('#tblLinenStocks tbody').on('click', 'button.add', function () {
		var itemid = $(this).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
		var qty = $(this).closest('tr').find('td:eq(1)').find('#txtQty').val();
		if (qty == '') {
			alert('Please Provide Qty');
			$(this).closest('tr').find('td:eq(1)').find('#txtQty').focus();
			return;
		}
		else {
			Dispatch($(this));
		}
	});
});

function FillCarts() {
	$("#ddlCartList").empty();
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = "LL_StoreListByLogin";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlCartList').append($('<option selected="selected"></option>').val("Select").html("Select")).select2();;
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlCartList').append($('<option></option>').val(val.CartId).html(val.CartName));
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function LinenStocks() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.CartId = $('#ddlCartList option:selected').val();;
    objBO.trf_from = Active.LinenStoreCartId;
	objBO.ItemId = '-';
	objBO.Logic = "LinenStocksInCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			
			$('#tblLinenStocks tbody').empty();
			var tbody = "";
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr style='background:#ddd;'>";
				tbody += "<td style='width:35%'><input type='text' disabled class='form-control' data-itemid='" + val.item_id + "' value='" + val.item_name + "' /></td>";
				tbody += "<td style='width65%'>";
				tbody += "<div style='display:flex;'>";
				tbody += "<button class='bn btn-primary' style='width:13%'>InStock</button>";
				tbody += "<input type='text' id='txtInStock' class='form-control bc' autocomplete='off' style='width:13%' disabled value='" + val.InStock + "'/>";

				tbody += "<button class='bn btn-success' style='width:15%;margin-left: 3px;'>Trf-Qty</button>";
				tbody += "<input type='text' id='txtTrfQty' class='form-control bc' autocomplete='off' style='width:13%;border-color: #00a65a;' placeholder='Trf Qty'/>";

				tbody += "<button class='bn btn-success' style='width:24%;margin-left: 5px;'>Damage-Qty</button>";
				tbody += "<input type='text' class='form-control bc' style='width:13%;border-color: #00a65a;' autocomplete='off' value='0' id='txtDamageQty' placeholder='Damage Qty'/>";

				tbody += "<input type='text' class='form-control bc' style='width:30%;border-color: #00a65a;margin-left: 3px;' autocomplete='off' id='txtRemarks' placeholder='Remark'/>";

				tbody += "<button class='bn btn-warning add' style='width:30%;font-size:15px;;margin-left:3px;'><i class='fa fa-plus'>&nbsp</i>Washing</button>";
				tbody += "</div>";
				tbody += "</td>";
				tbody += "</tr>";
			});
			$('#tblLinenStocks tbody').append(tbody);
		},
		complete: function (coml) {
			GetItemsByCartId();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function searchStock(txt, tbl) {
	$('#' + txt).on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#' + tbl + ' tbody tr').filter(function () {
			$(this).toggle($(this).find('td:eq(0)').find('input:text').val().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
}
function Dispatch(elem) {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
	var objBO = {};
	var stqty = $(elem).closest('tr').find('td:eq(1)').find('#txtInStock').val();
	var qty = $(elem).closest('tr').find('td:eq(1)').find('#txtTrfQty').val();
	var damage_qty = $(elem).closest('tr').find('td:eq(1)').find('#txtDamageQty').val();
	var trf_qty = eval(qty) + eval(damage_qty);
	if ($('#ddlCartList option:selected').text() == "Select") {
		alert('Transfer from Cart not selected');
		return;
	}
	if (eval(trf_qty) > eval(stqty)) {
		$(elem).closest('tr').find('td:eq(1)').find('#txtTrfQty').val('');
		$(elem).closest('tr').find('td:eq(1)').find('#txtDamageQty').val(0);
		alert('Total of Transfer Quantity and Damage Qty should not be greater than stock quantity');
		return;
	}
	objBO.lot_no = $('#txtLotNo').val();
	objBO.ItemId = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.qty = qty;
	objBO.damage_qty = damage_qty;
	objBO.trf_to = 'Washing';
	objBO.trf_remark = $(elem).closest('tr').find('td:eq(1)').find('#txtRemarks').val();
	objBO.trf_from = $('#ddlCartList option:selected').val();
	objBO.login_id = Active.userId;
	objBO.IndentNo = "-";
	objBO.AutoId = "0";
	objBO.Logic = "Transfer";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {		
			if (data.includes("Success")) {
				var lotNo = data.split('|')[1];			
				$(elem).closest('tr').find('td:eq(1)').find('#txtTrfQty').val('');
				$(elem).closest('tr').find('td:eq(1)').find('#txtDamageQty').val(0);
                GetItemsByCartId();
       			StoreStocks(objBO.ItemId, elem);
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
function GetItemsByCartId() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.TranId = $('#txtLotNo').val();
	objBO.login_id = Active.userId;
	objBO.CartId = $("#ddlCartList option:selected").val();
	objBO.Logic = "UnCompletedLaundry";

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
					//htmldata += '<td>' + val.item_id + '</td>';
					htmldata += '<td>' + val.item_name + '</td>';
					htmldata += '<td class="text-right">' + val.qty + '</td>';
					htmldata += '<td class="text-right">' + val.damage_qty + '</td>';
					htmldata += '<td><button class="btn-danger bn" onclick=selectRow(this);DispatchDelete(' + val.Rec_Id + ')><i class="fa fa-trash"></i></button></td>';
					$('#txtLotNo').val(val.lot_no);
				});
				$("#tblItemByLot tbody").append(htmldata);
			}
			else {
				$('#txtLotNo').val("New");
			}
			$('#ddlProductList').focus();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function StoreStocks(ItemId, elem) {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.TranId = $('#txtLotNo').val();
	objBO.ItemId = ItemId;
	objBO.CartId = $("#ddlCartList option:selected").val();
	objBO.Logic = "LL_CartStocks";

	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$(elem).closest('tr').find('td:eq(1)').find('#txtInStock').val(val.stocks);
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DispatchComplete() {
	if (confirm('Are you sure to Complete Dispatch..!')) {
		var url = config.baseUrl + "/api/LinenLaundry/LL_TransferComplete";
		var objBO = {};
		objBO.lot_no = $('#txtLotNo').val();
		objBO.login_id = Active.userId;
		objBO.Logic = "Dispatch";
		if ($('#tblItemByLot tbody tr').length < 1) {
			alert('Please Add Items Qty..');
			return;
		}
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes("Success")) {
					alert(data);
					GetItemsByCartId();
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
		var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
		var objBO = {};
		objBO.lot_no = '-';
		objBO.AutoId = autoid;
		objBO.Logic = "Delete";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				GetItemsByCartId();
				LinenStocks();
				//var ItemId = $('#tblItemByLot tbody').find('tr.select-row').find('td:eq(0)').text();
				//$('#tblLinenStocks tbody tr').map(function () {
				//	var item_id = $(this).find('td:eq(0)').find('input:text').data('itemid');
				//	if (item_id == ItemId) {
				//		
				//		var elem = $(this).closest('tr');						
				//		StoreStocks(ItemId, elem);
				//	}
				//});
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}