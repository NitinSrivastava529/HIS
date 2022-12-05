$(document).ready(function () {	
	GetCartListByLoginId();
});
function GetCartListByLoginId() {
	$("ddlCartList").empty();
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objIdentBO = {};
	objIdentBO.login_id = Active.userId;
	objIdentBO.Logic = "LL_StoreListByLogin";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objIdentBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("#ddlCartList").empty().append($("<option></option>").val("0").html("Please Select")).select2();
				$("#ddlCartList").append($("<option></option>").val("ALL").html("ALL"));
				$.each(data.ResultSet.Table, function (key, value) {
					$("#ddlCartList").append($("<option></option>").val(value.CartId).html(value.CartName));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetStock() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.CartId = $('#ddlCartList option:selected').val();	
	objBO.Logic = "LLStocks";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var htmldata = "";
			var CartId = "";		
			var count = 0;		
			$('#tblLLStock tbody').empty();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					if (CartId != val.CartId) {
						htmldata += '<tr class="bg1">';
						htmldata += '<td colspan="4" style="font-weight:bold">Cart Name : ' + val.CartName + '</td>';
						htmldata += '</tr>';
						CartId = val.CartId;
						count = 0;
					}
					count++;
					htmldata += '<tr>';
					htmldata += '<td>' + count + '</td>';
					htmldata += '<td>' + val.item_id + '</td>';
					htmldata += '<td>' + val.item_name + '</td>';				
					htmldata += '<td class="text-right">' + val.qty + '</td>';				
					htmldata += '</tr>';
				});
				$('#tblLLStock tbody').append(htmldata);			
			}
			else {
				//alert('Data Not Found..');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function DownloadExcel() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.CartId = $('#ddlCartList option:selected').val();
	objBO.OutPutType = "Excel";
	objBO.Logic = "LLStocks";
	Global_DownloadExcel(url, objBO, "StockReport.xlsx");
}
