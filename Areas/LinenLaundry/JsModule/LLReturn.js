$(document).ready(function () {
	GetLinenCart();
	FillCarts();
	FillProductList();
	$("#txtQty").on("keydown", function (e) {
		if (e.which == 13) {
			Dispatch();
		}
	});
});
function GetLinenCart() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = "LL_GetLinenCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			//$('#ddlToCart').append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlToCart').append($('<option></option>').val(val.CartId).html(val.CartName));
			});
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function FillCarts() {
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
			$('#ddlFromCart').append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlFromCart').append($('<option></option>').val(val.CartId).html(val.CartName));
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function FillProductList() {

	$("#ddlProductList").empty();

	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.login_id = Active.userId;
	objBO.Logic = "LL_ItemList";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlProductList').append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlProductList').append($('<option></option>').val(val.item_id).html(val.item_name))
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function GetStocks() {
	$('#txtInStock').text("0");
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objConsumpBO = {};
	objConsumpBO.hosp_id = Active.unitId;
	objConsumpBO.CartId = $('#ddlFromCart option:selected').val();
	objConsumpBO.ItemId = $('#ddlProductList').val();
	objConsumpBO.Logic = "LL_CartStocks";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objConsumpBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			
			$.each(data.ResultSet.Table, function (key, val) {
				$('#txtInStock').val(val.stocks);
				$('#txtQty').focus();
			})
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Dispatch() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
	var objBO = {};
	var stqty = $('#txtInStock').val();
	var qty = $('#txtQty').val();
	if ($('#ddlFromCart').val() == "Select") {
		alert('Transfer from Cart not selected');
		return false;
	}
	if ($('#ddlToCart').val() == "Select") {
		alert('Transfer to Cart not selected');
		return false;
	}
	if (eval(qty) > eval(stqty)) {
		alert('Transfer qunatity can not be geater than stock qty');
		return false;
	}
	objBO.lot_no = $('#txtLotNo').val();
	objBO.ItemId = $('#ddlProductList').val();
	objBO.qty = qty;
	objBO.trf_to = $("#ddlToCart option:selected").val();
	objBO.trf_from = $("#ddlFromCart option:selected").val();
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
				$('#txtLotNo').val(lotNo)
				$("#txtInStock").val('');
				$("#txtQty").val('');
			}
			else {
				alert(data);
			}
		},
		complete: function (fn) {
			GetItemsByLotNo();
		},
		error: function (response) {
			alert('Server Error...!');
		},
	});
}
function GetItemsByLotNo() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.TranId = $('#txtLotNo').val();
	objBO.login_id = Active.userId;
	objBO.trf_from = $("#ddlFromCart option:selected").val();
	objBO.CartId = $("#ddlToCart option:selected").val();
	objBO.Logic = "UnCompleted:FromLinenTransfer";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var htmldata = "";
			$("#tblItemByLot tbody").empty();
			if (Object.keys(data.ResultSet.Table).length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td>' + val.item_id + '</td>';
					htmldata += '<td>' + val.item_name + '</td>';
					htmldata += '<td>' + val.qty + '</td>';
					htmldata += '<td><button onclick=DispatchDelete(' + val.Rec_Id + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></button></td>';
					htmldata += '</tr>';
					$('#txtLotNo').val(val.lot_no);
				});
				$("#tblItemByLot tbody").append(htmldata);
				$('#ddlProductList').focus();
			}
			else {
				$('#txtLotNo').val('New');
				$('#txtQty').val('');
				$('#txtInStock').val('');
				$('#ddlProductList').prop('selectedIndex', '0').change();
			}

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function TransferToCart() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.TranId = $('#txtLotNo').val();
	objBO.login_id = Active.userId;
	objBO.trf_from = $("#ddlToCart option:selected").val();
	objBO.CartId = $("#ddlFromCart option:selected").val();
	objBO.Logic = "UnCompleted:TransferToCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var htmldata = "";
			$("#tblItemByLot tbody").empty();
			if (Object.keys(data.ResultSet.Table).length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td>' + val.item_id + '</td>';
					htmldata += '<td>' + val.item_name + '</td>';
					htmldata += '<td>' + val.qty + '</td>';
					htmldata += '<td><button onclick=DispatchDelete(' + val.Rec_Id + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></button></td>';
					htmldata += '</tr>';
					$('#txtLotNo').val(val.lot_no);
				});
				$("#tblItemByLot tbody").append(htmldata);
			}
			else {
				$('#txtLotNo').val('New');
				$('#txtQty').val('');
				$('#txtInStock').val('');
				$('#ddlProductList').prop('selectedIndex', '0').change();
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
				GetItemsByLotNo();
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}

