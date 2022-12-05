var laundryStock = 0;
var washingStock = 0;
$(document).ready(function () {
	searchStock('txtSearchProduct', 'tblLinenStocks');
	LaundryStocks();

	//$('#tblLinenStocks tbody').on('click', 'button.LaundryToWashing', function () {
	//	var itemid = $(this).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	//	var stock = $(this).closest('tr').find('td:eq(1)').find('#txtLaundryStock').val();
	//	var qty = $(this).closest('tr').find('td:eq(1)').find('#txtLaundryQty').val();		
	//	if (qty == '') {
	//		alert('Please Provide Qty');
	//		$(this).closest('tr').find('td:eq(1)').find('#txtQty').focus();
	//		return;
	//	}
	//	else {
	//		if (eval(stock) < eval(qty)) {
	//			alert('Transfer Qty should be less then Stock Qty');
	//			return;
	//		}			
	//		LaundryToWashing($(this));
	//	}
	//});
	$('#tblLinenStocks tbody').on('click', 'button.WashingToLaundry', function () {
		var itemid = $(this).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
		var stock = $(this).closest('tr').find('td:eq(1)').find('#txtWashingStock').val();
		var qty = $(this).closest('tr').find('td:eq(1)').find('#txtWashingQty').val();
		if (qty == '') {
			alert('Please Provide Qty');
			$(this).closest('tr').find('td:eq(1)').find('#txtQty').focus();
			return;
		}
		else {
			if (eval(stock) < eval(qty)) {
				alert('Transfer Qty should be less then Stock Qty');
				return;
			}			
			WashingToLaundry($(this));
		}
	});
});

function LaundryStocks() {
	var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
	var objBO = {};
	objBO.hosp_id = Active.unitId;
	objBO.CartId = '-';
	objBO.Prm1 = 'ALL';
	objBO.ItemId = '-';
	objBO.Logic = "WashingStocks";
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
				tbody += "<tr style='background:#fff;'>";
				tbody += "<td style='width:45%'><input type='text' disabled class='form-control' data-itemid='" + val.item_id + "' value='" + val.item_name + "' /></td>";

				tbody += "<td style='width:73%'>";
				tbody += "<div style='display:flex;'>";
				
				//tbody += "<input type='text' class='form-control bc' style='width:33%;margin-left:15px' autocomplete='off' id='txtLaundryQty' placeholder='Qty'/>";
				//tbody += "<button class='bn btn-warning LaundryToWashing' style='width:84%;font-size:13px'><i class='fa fa-sign-in'>&nbsp</i>Washing Transfer</button>";

				tbody += "<button class='bn btn-primary' style='margin-left:15px;width:13%'>In Washing</button>";
				tbody += "<input type='text' id='txtWashingStock' class='form-control' autocomplete='off' style='width:13%;border-color:#06a08b' disabled value='" + val.WashingStock + "'/>";

				tbody += "<input type='text' class='form-control bc' style='width:13%;margin-left:15px;border-color: #06a08b' data-int autocomplete='off' id='txtWashingQty' placeholder='Qty'/>";
				tbody += "<button class='bn btn-primary WashingToLaundry' style='width:13%;font-size:13px'><i class='fa fa-sign-in rotate'>&nbsp</i>Ready</button><span class='fa fa-check successTick'></span>";					

				tbody += "<button class='bn btn-warning' style='width:13%'>In Laundry</button>";
				tbody += "<input type='text' id='txtLaundryStock' class='form-control' autocomplete='off' data-int style='width:13%;border-color: #d58512;' disabled value='" + val.LaundaryStock + "'/>";

				tbody += "</div>";
				tbody += "</td>";
				tbody += "</tr>";
			});
			$('#tblLinenStocks tbody').append(tbody);
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
function LaundryToWashing(elem) {
	var url = config.baseUrl + "/api/LinenLaundry/LL_WashingLaundaryMovement";
	var objBO = {};	
	objBO.transid = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.item_id = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.qty = $(elem).closest('tr').find('td:eq(1)').find('#txtLaundryQty').val();
	objBO.login_id = Active.userId;
	objBO.hosp_id = Active.unitId;
	objBO.Logic = "LaundryToWashing";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.includes("Success")) {
				laundryStock = data.split('|')[1];
				washingStock = data.split('|')[2];
				$('#tblLinenStocks tbody').find('.successTick').css('visibility', 'hidden');
				$(elem).closest('tr').find('td:eq(1)').find('.successTick').css('visibility', 'visible');
				$(elem).closest('tr').find('td:eq(1)').find('#txtLaundryStock').val(laundryStock);
				$(elem).closest('tr').find('td:eq(1)').find('#txtWashingStock').val(washingStock);

				$(elem).closest('tr').find('td:eq(1)').find('#txtLaundryQty').val('');
				$(elem).closest('tr').find('td:eq(1)').find('#txtWashingQty').val('');

				$(elem).parents('tbody').removeClass('success-border');
				$(elem).closest('tr').find('td:eq(1)').find('button.LaundryToWashing').addClass('success-border');			
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
function WashingToLaundry(elem) {
	var url = config.baseUrl + "/api/LinenLaundry/LL_WashingLaundaryMovement";
	var objBO = {};
	objBO.transid = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.item_id = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.qty = $(elem).closest('tr').find('td:eq(1)').find('#txtWashingQty').val();
	objBO.login_id = Active.userId;
	objBO.hosp_id = Active.unitId;
	objBO.Logic = "WashingToLaundry";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.includes("Success")) {
				laundryStock = data.split('|')[1];
				washingStock = data.split('|')[2];

				$('#tblLinenStocks tbody').find('.successTick').css('visibility','hidden');
				$(elem).closest('tr').find('td:eq(1)').find('.successTick').css('visibility', 'visible');

				$(elem).closest('tr').find('td:eq(1)').find('#txtLaundryStock').val(laundryStock);
				$(elem).closest('tr').find('td:eq(1)').find('#txtWashingStock').val(washingStock);

				$(elem).closest('tr').find('td:eq(1)').find('#txtLaundryQty').val('');
				$(elem).closest('tr').find('td:eq(1)').find('#txtWashingQty').val('');

				$(elem).parents('tbody').removeClass('success-border');
				$(elem).closest('tr').find('td:eq(1)').find('button.WashingToLaundry').addClass('success-border');				
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