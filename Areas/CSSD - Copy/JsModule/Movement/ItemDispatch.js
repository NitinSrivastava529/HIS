var IsItem = [];
var _cartId = "";
$(document).ready(function () {
	searchTable('txtSearch', 'tblIndentInfo');
	GetLLItems();
	$("#btnAddLinen").on('click', function () {
		var itemId = $('#ddlLinenInfo option:selected').val();
		var itemName = $('#ddlLinenInfo option:selected').text();
		var qty = $('#txtLLQty').val();
		var tbody = "";
		if (ValidateLinen()) {
			if ($.inArray(itemId, IsItem) < 0) {
				tbody += "<tr>";
				tbody += "<td>##</td>";
				tbody += "<td>" + itemId + "</td>";
				tbody += "<td>" + itemName + "</td>";
				tbody += "<td class='text-right'>" + qty + "</td>";
				tbody += "<td><button onclick=RemoveItem(this) class='btn-danger' style='border:none'>Delete</button></td>";
				tbody += "</tr>";
				IsItem.push(itemId);
				$('#ddlLinenInfo').prop('selectedIndex', '0').change();
				$('#txtLLQty').val('');
			}
			else {
				alert('This Item Already Added..');
				return;
			}

		}
		$("#tblLinenInfo tbody").append(tbody);
	});
	$('#tblSetInfo tbody').on('keyup', 'input:text', function () {
		var stock = $(this).closest('tr').find('td:eq(3)').text();
		var qty = $(this).val();
		if (eval(qty) > eval(stock)) {
			$(this).val(0);
			return
		}
	});
	$("#ddlLinenInfo").on('change', function () {
		var stock = $(this).find('option:selected').data('stock');
		$("#txtLLStock").val(stock);
	});
});
function index(elem) {
	return $(elem).closest('tr').index();
}
function RemoveItem(elem) {
	if (confirm('Are you sure to Delete This?')) {
		var i = $(elem).closest('tr').index();
		$(elem).closest('tr').remove();
		IsItem.splice(i, 1);
	}
}

function GetLLItems() {
	var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
	var objBO = {};
	objBO.Logic = 'GetLLItems';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$("#ddlLinenInfo").empty().append($('<option></option>').val('0').html('Select'));
					$.each(data.ResultSet.Table, function (key, val) {
						$("#ddlLinenInfo").append($('<option data-stock=' + val.qty + '></option>').val(val.item_id).html(val.item_name)).select2();
					});
				}
				else {
					//alert("Data Not Found");
					$("#txtIndentNo").text('Not Found');
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetPendingRequest() {
	$("#tblIndentInfo tbody").empty();
	var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
	var objBO = {};
	objBO.Logic = 'GetIndentPendingRequest';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var tbody = "";
					var count = 0;
					var cartId = '';
					var indentNo = '';
					$.each(data.ResultSet.Table, function (key, val) {
						if (cartId != val.CartId) {
							tbody += "<tr class='bg1'>";
							tbody += "<td colspan='6'><b>Cart : </b>" + val.CartName  + "</td>";
							tbody += "</tr>";
							cartId = val.CartId;
						}
						if (indentNo != val.IndentNo) {
							count = 0;
							tbody += "<tr class='bg2'>";
							tbody += "<td colspan='5'><b>Indent No : </b>" + val.IndentNo + '[ ' + val.IndentDate + ' ]' + "<button onclick=GetIndentInfo('" + val.IndentNo + "','" + val.CartId + "') class='btn-warning pull-right' style='margin: -2px 0;border: none;padding: 2px 7px;'><i class='fa fa-sign-in'>&nbsp;</i>Select</button></td>";
							tbody += "</tr>";
							indentNo = val.IndentNo;
						}
						count++;
						tbody += "<tr class='" + val.IndentNo + "'>";
						tbody += "<td>" + count + "</td>";
						tbody += "<td>" + val.SetId + "</td>";
						tbody += "<td>" + val.SetName + "</td>";
						//tbody += "<td style='padding-right:10px;' class='text-right'>" + val.stockQty + "</td>";
						tbody += "<td class='text-right'>" + val.ReqQty + "</td>";
						tbody += "</tr>";
					});
					$("#tblIndentInfo tbody").append(tbody);
				}
				else {
					//alert("Data Not Found");
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetIndentInfo(indentNo, cartId) {
	_cartId = cartId;
	$("#tblSetInfo tbody").empty();
	var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
	var objBO = {};
	objBO.Prm_1 = indentNo;
	objBO.Logic = 'GetSetByIndentNo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var tbody = "";
					var count = 0;
					var indentInfo = '';				
					$.each(data.ResultSet.Table, function (key, val) {					
						indentInfo = val.IndentNo;
						count++;
						tbody += "<tr>";
						tbody += "<td><input type='checkbox'/></td>";
						tbody += "<td>" + val.SetId + "</td>";
						tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td><a href='#' onclick=TrackSetByBatchNo('" + val.batch_no + "')>" + val.batch_no + "</a></td>";
						tbody += "<td>" + val.exp_date + "</td>";
						if (val.ItemType=='SET')
							tbody += "<td><input type='text' style='width:100%;text-align:right' disabled='' value='" + val.qty + "'/></td>";
						else
							tbody += "<td><input type='text' style='width:100%;text-align:right' value='" + val.qty + "'/></td>";

						if ((val.SetStatus == 'Ready') && (val.ItemType =='SET'))
							tbody += "<td style='background: #ddfdcf;'>" + val.SetStatus + "</td>";
						else if (!(val.SetStatus == 'Ready') && (val.ItemType == 'SET'))
							tbody += "<td style='background:#fdcbcb;'>" + val.SetStatus + "</td>";
						else
							tbody += "<td style='background:#fff;text-align:center'>-</td>";
						tbody += "</tr>";
					});
					$("#tblSetInfo tbody").append(tbody);
					$("#txtIndentNo").text(indentInfo);					
				}
				else {
					alert("Data Not Found");
					$("#txtIndentNo").text('Not Found');
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function TrackSetByBatchNo(batchNo) {
    $('#txtBatchInfo').text('');
    $("#tblTrackingInfo tbody").empty();
    $("#tblInspectionInfo thead").empty();
    $("#tblInspectionInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = batchNo;
    objBO.Logic = 'TrackSetByBatchNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var temp = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + val.trn_type + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.doc_date + "</td>";
                        tbody += "<td>" + val.exp_date.substring(0, 10) + "</td>";
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.fromcart + "</td>";
                        tbody += "<td>" + val.tocART + "</td>";
                        tbody += "<td>" + val.IPDNo + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td>" + val.emp_name + "</td>"; 
                        tbody += "</tr>";
                    });
                    $("#tblTrackingInfo tbody").append(tbody);                   
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    var tbody1 = "";
                    var thead = "";
                    thead += "<tr>";
                    for (var col in data.ResultSet.Table1[0]) {                        
                        thead += "<th>" + col + "</th>";                         
                    }
                    thead += "</tr>";
                    var count = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++;
                        tbody1 += "<tr>";
                        for (var col in data.ResultSet.Table1[0]) {
                            tbody1 += "<td>" + val[col] + "</td>";
                        }                      
                        tbody1 += "</tr>";
                    });
                    $("#tblInspectionInfo tbody").append(tbody1);                  
                    $("#tblInspectionInfo thead").append(thead);                  
                }
            }
        },
        complete: function () { $("#modalTracking").modal('show');},
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Dispatch() {	
    var len = $('#tblSetInfo tbody').find('input[type=checkbox]:checked').length;
    if (len == '0') {
        alert('Set Not Selected.');
        return;
    }
    if (confirm('Are you sure to Dispatch?')) {        
		var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
		var objBO = [];
        $('#tblSetInfo tbody tr').find('td:eq(0)').find('input[type=checkbox]:checked').each(function () {
			objBO.push({
				'TrnNo': $('#txtIndentNo').text(),
				'FromCart':Active.CSSDCartId,
				'ToCart': _cartId,
				'SetId': $(this).closest('tr').find('td:eq(1)').text(),
                'BatchNo': $(this).closest('tr').find('td:eq(3)').text(),
                'expDate': $(this).closest('tr').find('td:eq(4)').text(),
				'SetKey': '-',
                'qty': $(this).closest('tr').find('td:eq(5)').find('input:text').val(),
				'ItemType': 'Set',
				'Remark': '-',
				'hosp_id': Active.unitId,
				'login_id': Active.userId,
				'Logic': "Dispatch"
			});
		});
		$('#tblLinenInfo tbody tr').each(function () {
			objBO.push({
				'TrnNo': $('#txtIndentNo').text(),
				'FromCart': Active.CSSDCartId,
				'ToCart': _cartId,
				'SetId': $(this).find('td:eq(1)').text(),
				'BatchNo':'-',
				'expDate': '1900/01/01',
				'SetKey': '-',
				'qty': $(this).find('td:eq(3)').text(),
				'ItemType': 'Linen',
				'Remark': '-',
				'hosp_id': Active.unitId,     
				'login_id': Active.userId,
				'Logic': "Dispatch"
			});
        });		      
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",  
			success: function (data) {
				if (data.includes('Success')) {
					$('#tblLinenInfo tbody').empty();
					$('#tblSetInfo tbody').empty();
					$('#txtIndentNo').text('');
					alert('Successfully Dispatched.');
					GetPendingRequest();
				}
				else {
					alert(data);
				};
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function ValidateLinen() {
	var itemId = $('#ddlLinenInfo option:selected').text();
	var qty = $('#txtLLQty').val();
	if (itemId == 'Select') {
		alert('Please Select Item..');
		return false;
	}
	if ((qty == '') || (eval(qty) < 1)) {
		alert('Please Provide Quantity');
		$('#txtLLQty').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtLLQty').removeAttr('style');
	}
	return true;
}
