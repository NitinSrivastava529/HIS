$(document).ready(function () {
	searchStock('txtSearchProduct', 'tblLinenStocks');
	WashingStocks();
	$('#tblLinenStocks tbody').on('click', 'button.add', function () {
		var itemid = $(this).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
		var qty = $(this).closest('tr').find('td:eq(1)').find('#txtQty').val();
		if (qty == '') {
			alert('Please Provide Qty');
			$(this).closest('tr').find('td:eq(1)').find('#txtQty').focus();
			return;
		}
		else {
			WashingToLaundryReceiving($(this));
		}
	});
});

function WashingStocks() {
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
				tbody += "<td style='width:50%'><input type='text' disabled class='form-control' data-itemid='" + val.item_id + "' value='" + val.item_name + "' /></td>";
				tbody += "<td style='width:50%'>";
				tbody += "<div style='display:flex;'>";
				tbody += "<button class='bn btn-warning' style='width:18%'>InStock</button>";
				tbody += "<input type='text' id='txtInStock' class='form-control bc' autocomplete='off' style='width:25%' disabled value='" + val.WashingStock + "'/>";

				tbody += "<input type='text' class='form-control bc' style='width:25%;margin-left:15px' autocomplete='off' id='txtQty' placeholder='Qty'/>";
				tbody += "<button class='bn btn-warning add' style='width:65%;font-size:13px'><i class='fa fa-plus'>&nbsp</i>WashingToLaundry</button>";
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
function WashingToLaundryReceiving(elem) {
	var url = config.baseUrl + "/api/LinenLaundry/LL_WashingToLaundryReceiving";
	var objBO = {};
	var stqty = $(elem).closest('tr').find('td:eq(1)').find('#txtInStock').val();
	var qty = $(elem).closest('tr').find('td:eq(1)').find('#txtQty').val();

	if (eval(qty) > eval(stqty)) {
		alert('Transfer Quantity should not be greater than stock quantity');
		return;
	}	

	objBO.transid = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.item_id = $(elem).closest('tr').find('td:eq(0)').find('input:text').data('itemid');
	objBO.qty = qty;
	objBO.login_id = Active.userId;
	objBO.hosp_id = Active.unitId;
	objBO.Logic = "Transfer";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.includes("Success")) {
				alert(data);
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