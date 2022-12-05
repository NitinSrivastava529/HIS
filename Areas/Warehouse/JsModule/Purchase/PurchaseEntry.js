$(document).ready(function () {
	GoToNext();
	CloseSidebar();
	GetVendor();
	TaxConfigList();
	UnCompletePurchases();
	$('#txtQty').on('keyup', function () {
		calcsqty();
	});
	$('#ddlPackType').on('change', function () {
		calcsqty();
	});
	$('#txtSearch').on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#tblUnCompPurchase tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
	$('#ddlGrnType').on('change', function () {
		var val = $(this).find('option:selected').text();
		$('#txtInvoiceNo').attr('placeholder', 'Challan No.');
		$('.iname').text('Challan No.');
		if (val == 'Invoice') {
			$('#txtInvoiceNo').attr('placeholder', 'Invoice No.');
			$('.iname').text('Invoice No.');
		}
		else if (val == 'Challan') {
			$('#txtInvoiceNo').attr('placeholder', 'Challan No.');
			$('.iname').text('Challan No.');
		}
	});
	$('#ddlGst').on('change', function () {
		var val = $(this).find('option:selected').data('taxrate');
		$('#txtTaxRate').val(val);
	});
	$('#txtSearchProduct').keydown(function (e) {
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
				var val = $('#tblnavigate').find('tbody').find('.selected').text();
				var mfdid = $('#tblnavigate').find('tbody').find('.selected').data('mfdid');
				var mfdname = $('#tblnavigate').find('tbody').find('.selected').data('mfdname');
				var hsn = $('#tblnavigate').find('tbody').find('.selected').data('hsn');
				var itemid = $('#tblnavigate').find('tbody').find('.selected').data('itemid');
				$(this).val(val).data('itemid', itemid);
				GetPackType(itemid);
				GetManfacturer(itemid);
				if (hsn != '') {
					$('#txtHsn').val(hsn).prop('readonly', true);
				}
				else {
					$('#txtHsn').val(hsn).prop('readonly', false);
				}
				$('#ItemList').hide();
				break;
			default:
				var val = $('#txtSearchProduct').val();
				if (val == '') {
					$('#ItemList').hide();
				}
				else {
					$('#ItemList').show();
					var search = $(this).val();
					GetItems(search);
				}
				break;
		}
	});
	$('#tblnavigate tbody').on('click', 'tr', function () {
		var val = $(this).text();
		var mfdname = $(this).data('mfdname');
		var mfdid = $(this).data('mfdid');
		var hsn = $(this).data('hsn');
		var itemid = $(this).data('itemid');
		GetPackType(itemid);
		GetManfacturer(itemid);
		$('#txtSearchProduct').val(val).data('itemid', itemid);
		if (hsn != '') {
			$('#txtHsn').val(hsn).prop('readonly', true);
		}
		else {
			$('#txtHsn').val(hsn).prop('readonly', false);
		}
		$('#ItemList').hide();

	});
	$('#tblPurchaseEntry tbody').on('click', '.delete', function () {
		var autoId = $(this).data('autoid');
		var purchaseId = $(this).data('pid');
		DeletePurchase(autoId, purchaseId);
	});
	$('#tblUnCompPurchase tbody').on('click', '.getUnCompPurchase', function () {
		var purchaseId = $(this).data('pid');
		BindUnCompletePurchase(purchaseId);
	});
});

function GetPackType(itemid) {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.prm_1 = itemid;
	objBO.Logic = 'PackByItemId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#ddlPackType').empty().append($('<option>Select Pack</option>')).change();
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlPackType').append($('<option data-text="' + val.pack_type + '" data-pqty=' + val.pack_qty + '></option>').val(val.pack_id).html(val.pack_type + '/' + val.pack_qty)).select2();
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
function GetManfacturer(itemid) {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.prm_1 = itemid;
	objBO.Logic = 'ManfByItemId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#ddlManufacture").empty().append($('<option>Select Manufacturer</option>')).change();
				$.each(data.ResultSet.Table, function (key, val) {
					$("#ddlManufacture").append($("<option data-mfdid=" + val.mfd_id + "></option>").val(val.mfd_id).html(val.mfd_name)).select2();
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
function GetVendor() {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.Logic = 'GetVendorList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#ddlSupplier').empty().append($('<option>Select Supplier</option>'));
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlSupplier').append($('<option></option>').val(val.vendor_id).html(val.vendor_name)).select2();
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
function GetItems(search) {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.item_name = search;
	objBO.Logic = 'GetItemByItemName';
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
					$('<tr class="searchitems" data-hsn=' + val.hsn + ' data-itemid="' + val.item_id + '"><td>' + val.item_name + "</td></tr>").appendTo($('#tblnavigate tbody'));
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
function TaxConfigList() {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.Logic = 'TaxConfigList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#ddlGst').empty().append($('<option>Select GST</option>'));
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlGst').append($('<option data-taxrate=' + val.tax_rate + '></option>').val(val.tax_id).html(val.tax_details)).select2();
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
function DiscountReprocess() {
	if (disValidation()) {
		var url = config.baseUrl + "/api/Warehouse/wh_PurchaseDiascountReprocess";
		var objBO = {};
		objBO.purch_id = $('#txtPurchaseId').val();
		objBO.discount_amount = $('#txtDiscountAmount').val();
		objBO.login_id = Active.userId;
		objBO.Logic = '-';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					alert(data);
					$('#txtDiscountAmount').val('');
					BindUnCompletePurchase(objBO.purch_id);
				}
				else {
					alert("Something Wrong..");
				};
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function CurrentPurchaseRecords(pId) {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.purchId = pId;
	objBO.Logic = 'CurrentPurchaseRecords';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				var str = "";
				$('#tblPurchaseEntry tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					str += "<tr>";
					str += "<td>" + val.item_Name + "</td>";
					str += "<td>" + val.mfd_name + "</td>";
					str += "<td>" + val.HSN + "</td>";
					str += "<td>" + val.Batch_No + "</td>";
					str += "<td>" + val.Exp_Date + "</td>";
					str += "<td>" + val.pack_type + "</td>";
					str += "<td>" + val.MRP + "</td>";
					str += "<td>" + val.trade + "</td>";
					str += "<td>" + val.npr + "</td>";
					str += "<td>" + val.Quantity + "</td>";
					str += "<td>" + val.It_Free + "</td>";
					str += "<td>" + val.tax_rate + "</td>";
					str += "<td>" + val.tax_amount + "</td>";
					str += "<td>" + val.amount + "</td>";
					str += "<td>" + val.DisPer + "</td>";
					str += "<td>" + val.DisAmount + "</td>";
					str += "<td class='text-danger btn delete' data-autoid=" + val.Auto_Id + " data-pid=" + val.Purch_id + "><i class='fa fa-close'></i></td>";
					str += "</tr>";
				});
				$('#tblPurchaseEntry tbody').append(str);
				$.each(data.ResultSet.Table1, function (key, val) {
					$('#txtIGST').val(val.IGST_AMT);
					$('#txtSGST').val(val.SGST_AMT);
					$('#txtCGST').val(val.CGST_AMT);
					$('#txtRoundOff').val(val.roundoff);
					$('#txtNetAmount').val(val.netamount);
					$('#txtDiscount').val(val.inv_discount);
					$('#txtTax').val(val.inv_tax);
					$('#txtTotal').val(val.inv_total);
					//$('#txtBillAmount').val(val.bill_amount);
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
function calcsqty() {
	var qty = parseInt($('#txtQty').val());
	var pqty = parseInt($('#ddlPackType option:selected').data('pqty'));
	sqty = qty * pqty;
	$('#txtSQty').val(sqty);
}
function BindUnCompletePurchase(pId) {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.purchId = pId;
	objBO.Logic = 'CurrentPurchaseRecords';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#modalUnCompPurchases').modal('hide');
				$('.modal').modal('hide');
				var str = "";
				$('#tblPurchaseEntry tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					$('#txtPurchaseId').val(val.Purch_id);
					str += "<tr>";
					str += "<td>" + val.item_Name + "</td>";
					str += "<td>" + val.mfd_name + "</td>";
					str += "<td>" + val.HSN + "</td>";
					str += "<td>" + val.Batch_No + "</td>";
					str += "<td>" + val.Exp_Date + "</td>";
					str += "<td>" + val.pack_type + "</td>";
					str += "<td>" + val.MRP + "</td>";
					str += "<td>" + val.trade + "</td>";
					str += "<td>" + val.npr + "</td>";
					str += "<td>" + val.Quantity + "</td>";
					str += "<td>" + val.It_Free + "</td>";
					str += "<td>" + val.tax_rate + "</td>";
					str += "<td>" + val.tax_amount + "</td>";
					str += "<td>" + val.amount + "</td>";
					str += "<td>" + val.DisPer + "</td>";
					str += "<td>" + val.DisAmount + "</td>";
					str += "<td class='text-danger btn delete' data-autoid=" + val.Auto_Id + " data-pid=" + val.Purch_id + "><i class='fa fa-close'></i></td>";
					str += "</tr>";
				});
				$('#tblPurchaseEntry tbody').append(str);
				$.each(data.ResultSet.Table1, function (key, val) {
					$('#txtInvoiceNo').val(val.inv_no);
					$('#txtEwayBillNo').val(val.eWayBillNo);
					$('#txtInvoiceDate').attr('value', val.inv_date);
					$('#txtEwayBillDate').attr('value', val.eWayBillDate);
					$('#ddlGrnType option').map(function () {
						if ($(this).text() == val.pur_type) return this;
					}).attr('Selected', 'Selecetd');

					$('#ddlSupplier option').map(function () {
						if ($(this).val() == val.vendor_id) {
							$('#ddlSupplier').val(val.vendor_id).change()
						}
					});
					$('#txtIGST').val(val.IGST_AMT);
					$('#txtSGST').val(val.SGST_AMT);
					$('#txtCGST').val(val.CGST_AMT);
					$('#txtRoundOff').val(val.roundoff);
					$('#txtNetAmount').val(val.netamount);
					$('#txtDiscount').val(val.inv_discount);
					$('#txtTax').val(val.inv_tax);
					$('#txtTotal').val(val.inv_total);
					$('#txtDisTotal').val(val.inv_total);
					$('#txtBillAmount').val(val.bill_amount);
				});
				$('#BasicInfo').find('.form-control').attr('disabled', true).css({ 'background': '#fff', 'opacity': '100%' });
				$('#tblPaymentDetails').find('.form-control').css({ 'background': '#fff', 'opacity': '100%' });
				$('#BasicInfo').find('input:radio:not(:checked)').attr('disabled', true);
				$('#tblProductInfo').find('input:text').val('');
				$('#tblProductInfo').find('select').prop('selectedIndex', '0').change();
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
function UnCompletePurchases() {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.Logic = 'UnCompletePurchases';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblUnCompPurchase tbody').empty();
				$.each(data.ResultSet.Table, function (key, val) {
					$('<tr><td>' + val.Purch_id + '</td><td>' + val.Inv_No + '</td><td>' + val.Inv_Date + '</td><td>' + val.vendor_name + '</td><td class="btn btn-success getUnCompPurchase" data-pId=' + val.Purch_id + '><i class="fa fa-check"></i></td></tr>').appendTo($('#tblUnCompPurchase tbody'));
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
function InsertPurchase() {
	if (validation()) {
		var url = config.baseUrl + "/api/Warehouse/PurchaseInsert";
		var objBO = {};
		objBO.unit_id = Active.unitId;
		objBO.comp_code = Active.userId;
		objBO.pur_type = $('#ddlGrnType option:selected').text();
		objBO.Vendor_Code = $('#ddlSupplier option:selected').val();
		objBO.Inv_No = $('#txtInvoiceNo').val();
		objBO.Inv_Date = $('#txtInvoiceDate').val();
		objBO.NatureOfPurchase = $('#ddlNatureOfPurchase option:selected').text();
		objBO.eWayBillNo = $('#txtEwayBillNo').val();
		objBO.eWayBillDate = $('#txtEwayBillDate').val();
		objBO.Item_id = $('#txtSearchProduct').data('itemid');
		objBO.barcodeNo = '-';
		objBO.hsn = $('#txtHsn').val();
		objBO.mfd_id = $('#ddlManufacture option:selected').val();
		objBO.Batch_No = $('#txtBatch').val();
		objBO.Exp_Date = ValidDate($('#txtExpDate').val());
		objBO.pack_type = $('#ddlPackType option:selected').data('text');
		objBO.pack_qty = $('#ddlPackType option:selected').data('pqty');
		objBO.MRP = $('#txtMRP').val();
		objBO.trade = $('#txtTrade').val();
		objBO.Quantity = $('#txtQty').val();
		objBO.It_Free = $('#txtFree').val();
		objBO.DisPer = $('#txtDisc').val();
		objBO.Tax_id = $('#ddlGst option:selected').val();
		objBO.Remark = '';
		objBO.CreatedBy = Active.userId;
		objBO.Purch_id = $('#txtPurchaseId').val();
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.startsWith('WP') || data.startsWith('WC')) {
					$('#BasicInfo').find('.form-control').attr('disabled', true).css({ 'background': '#fff', 'opacity': '100%' });
					$('#tblPaymentDetails').find('.form-control').css({ 'background': '#fff', 'opacity': '100%' });
					$('#BasicInfo').find('input:radio:not(:checked)').attr('disabled', true);
					$('#tblProductInfo').find('input:text').val('');
					$('#tblProductInfo').find('select').prop('selectedIndex', '0').change();
					$('#ddlPackType').empty().append($('<option>Select Pack</option>')).change();
					$("#ddlManufacture").empty().append($('<option>Select Manufacturer</option>')).change();
					var purchaseId = data;
					$('#txtPurchaseId').val(purchaseId);
					$('#tblProductInfo').find('#txtSearchProduct').val('').focus();
					$('#tblProductInfo').find('#tblnavigate tbody').empty();
					$('#tblProductInfo').find('#txtFree').val(0);
					$('#tblProductInfo').find('#txtDisc').val(0);
					CurrentPurchaseRecords(purchaseId);
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
function PurchasePosting() {
	var url = config.baseUrl + "/api/Warehouse/PurchasePosting";
	var objBO = {};
	objBO.Purch_id = $('#txtPurchaseId').val();
	objBO.adj_amt = 0;
	objBO.plusminus = 0;
	objBO.credit_cash = '';
	objBO.login_id = Active.userId;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data == 'Successfully Completed') {
				alert('Successfully Completed');
				$('#tblProductInfo').find('input').val('');
				$('#tblProductInfo').find('select').prop('selectedIndex', '0').change();
				$('#tblPaymentDetails').find('input').val('');
				$('#tblPaymentDetails').find('select').prop('selectedIndex', '0').change();
				$('#BasicInfo').find('input').val('');
				$('#BasicInfo').find('select').prop('selectedIndex', '0').change();
				$('#tblPurchaseEntry tbody').empty();
				$('#txtPurchaseId').val('Auto Generate');
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
function DeletePurchase(autoId, purchaseId) {
	if (confirm('Are you sure want to delete this Purchase Entry..')) {
		var url = config.baseUrl + "/api/Warehouse/PurchaseDelete";
		var objBO = {};
		objBO.Auto_Id = autoId;
		objBO.Purch_id = purchaseId;
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				
				CurrentPurchaseRecords(purchaseId);
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function validation() {
	var Supplier = $('#ddlSupplier option:selected').text();
	var GrnType = $('#ddlGrnType option:selected').text();
	var InvoiceNo = $('#txtInvoiceNo').val();
	var InvoiceDate = $('#txtInvoiceDate').val();
	var GatePassNo = $('#txtGatePassNo').val();
	var NatureOfPurchase = $('#ddlNatureOfPurchase option:selected').text();
	var EwayBillNo = $('#txtEwayBillNo').val();
	var EwayBillDate = $('#txtEwayBillDate').val();
	var GrnPayMode = $('input[name=PayMode]:checked').length;
	var Product = $('#txtSearchProduct').val();
	var Manufacture = $('#ddlManufacture option:selected').text();
	var BarCode = $('#txtBarCode').val();
	var Hsn = $('#txtHsn').val();
	var Batch = $('#txtBatch').val();
	var ExpDate = $('#txtExpDate').val();
	var Trade = $('#txtTrade').val();
	var MRP = $('#txtMRP').val();
	var PackType = $('#ddlPackType option:selected').text();
	var Qty = $('#txtQty').val();
	var Free = $('#txtFree').val();
	var Gst = $('#ddlGst option:selected').text();
	var TaxRate = $('#txtTaxRate').val();
	var Disc = $('#txtDisc').val();
	var Amount = $('#txtAmount').val();

	if (Supplier == 'Select Supplier') {
		$('span.selection').find('span[aria-labelledby=select2-ddlSupplier-container]').css('border-color', 'red').focus();
		alert('Please Select Supplier..!');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlSupplier-container]').removeAttr('style');
	}
	if (NatureOfPurchase == '') {
		$('#ddlNatureOfPurchase').css('border-color', 'red').focus();
		alert('Please Select Nature Of Purchase..!');
		return false;
	}
	else {
		$('#ddlGrddlNatureOfPurchasenType').removeAttr('style');
	}
	if (GrnType == 'Select GRN') {
		$('#ddlGrnType').css('border-color', 'red').focus();
		alert('Please Select GRN Type..!');
		return false;
	}
	else {
		$('#ddlGrnType').removeAttr('style');
	}
	if (InvoiceNo == '') {
		invoice = $('#ddlGrnType option:selected').text();
		$('#txtInvoiceNo').css('border-color', 'red').focus();
		alert('Please Provide ' + invoice + ' No..!');
		return false;
	}
	else {
		$('#txtInvoiceNo').removeAttr('style');
	}
	if (InvoiceDate == '') {
		invoice = $('#ddlGrnType option:selected').text();
		$('#txtInvoiceDate').css('border-color', 'red').focus();
		alert('Please Provide ' + invoice + ' Date..!');
		return false;
	}
	else {
		$('#txtInvoiceDate').removeAttr('style');
	}
	//if (GatePassNo == '') {
	//    $('#txtGatePassNo').css('border-color', 'red').focus();
	//    alert('Please Provide Gate Pass No..!');
	//    return false;
	//}
	//else {
	//    $('#txtGatePassNo').removeAttr('style');
	//}
	//if (EwayBillNo == '') {
	//    $('#txtEwayBillNo').css('border-color', 'red').focus();
	//    alert('Please Provide eWay Bill No..!');
	//    return false;
	//}
	//else {
	//    $('#txtEwayBillNo').removeAttr('style');
	//}
	//if (EwayBillDate == '') {
	//    $('#txtEwayBillDate').css('border-color', 'red').focus();
	//    alert('Please Provide eWay Bill Date..!');
	//    return false;
	//}
	//else {
	//    $('#txtEwayBillDate').removeAttr('style');
	//}
	//if (GrnPayMode <= 0) {
	//    $('.paymode').css('border', '1px solid red');
	//    alert('Please Select Grn Pay Mode..!');
	//    return false;
	//}
	//else {
	//    $('.paymode').removeAttr('style');
	//}
	if (Product == '') {
		$('#txtSearchProduct').css('border-color', 'red').focus();
		alert('Please Provide Product..!');
		return false;
	}
	else {
		$('#txtSearchProduct').removeAttr('style');
	}
	if (Manufacture == 'Select Manufacturer') {
		$('span.selection').find('span[aria-labelledby=select2-ddlManufacture-container]').css('border-color', 'red').focus();
		alert('Please Select Manufacturer..!');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlManufacture-container]').removeAttr('style');
	}
	//if (BarCode == '') {
	//    $('#txtBarCode').css('border-color', 'red').focus();
	//    alert('Please Provide BarCode..!');
	//    return false;
	//}
	//else {
	//    $('#txtBarCode').removeAttr('style');
	//}
	if (Hsn == '') {
		$('#txtHsn').css('border-color', 'red').focus();
		alert('Please Provide HSN..!');
		return false;
	}
	else {
		$('#txtHsn').removeAttr('style');
	}
	if (Batch == '') {
		$('#txtBatch').css('border-color', 'red').focus();
		alert('Please Provide Batch..!');
		return false;
	}
	else {
		$('#txtBatch').removeAttr('style');
	}
	if (ExpDate != '') {
		$('#txtExpDate').removeAttr('style');
		d = ValidDate($('#txtExpDate').val());
		if (d == false) {
			$('#txtExpDate').css('border-color', 'red').focus();
			return false;
		}
		else {
			$('#txtExpDate').removeAttr('style');
		}
	}
	if (Trade == '') {
		$('#txtTrade').css('border-color', 'red').focus();
		alert('Please Provide Pur-Rate..!');
		return false;
	}
	else {
		$('#txtTrade').removeAttr('style');
	}
	if (MRP == '') {
		$('#txtMRP').css('border-color', 'red').focus();
		alert('Please Provide MRP..!');
		return false;
	}
	else {
		$('#txtMRP').removeAttr('style');
	}
	if (PackType == 'Select Pack') {
		$('span.selection').find('span[aria-labelledby=select2-ddlPackType-container]').css('border-color', 'red').focus();
		alert('Please Select Pack Type..!');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlPackType-container]').removeAttr('style');
	}
	if (Qty == '') {
		$('#txtQty').css('border-color', 'red').focus();
		alert('Please Provide Quantity..!');
		return false;
	}
	else {
		$('#txtQty').removeAttr('style');
	}
	//if (Free == '') {
	//    $('#txtFree').css('border-color', 'red').focus();
	//    alert('Please Provide Free..!');
	//    return false;
	//}
	//else {
	//    $('#txtFree').removeAttr('style');
	//}
	if (Gst == 'Select GST') {
		$('span.selection').find('span[aria-labelledby=select2-ddlGst-container]').css('border-color', 'red').focus();
		alert('Please Select Gst..!');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlGst-container]').removeAttr('style');
	}
	//if (TaxRate == '') {
	//	$('#txtTaxRate').css('border-color', 'red').focus();
	//	alert('Please Provide Tax Rate..!');
	//	return false;
	//}
	//else {
	//	$('#txtTaxRate').removeAttr('style');
	//}
	//if (Disc == '') {
	//    $('#txtDisc').css('border-color', 'red').focus();
	//    alert('Please Provide Discount %..!');
	//    return false;
	//}
	//else {
	//    $('#txtDisc').removeAttr('style');
	//}
	if (Amount == '') {
		$('#txtAmount').css('border-color', 'red').focus();
		alert('Please Provide Amount..!');
		return false;
	}
	else {
		$('#txtAmount').removeAttr('style');
	}
	if ((parseFloat(Trade)) > (parseFloat(MRP))) {
		$('#txtTrade').css('border-color', 'red').focus();
		alert('Pur-Rate should be less then MRP..!');
		return false;
	}
	else {
		$('#txtTrade').removeAttr('style');
	}
	return true;
}
function ValidDate(val) {
	if (val != '') {
		var newDate = '';
		var date = val.split('-');
		if ((date.length != 2 || (date[1].length < 2 || date[0].length != 2))) {
			alert('Invalid Date. USE Format As mm-yy.');
			return false;
		}
		else if (date[0] > 12 || date[0] <= 0) {
			alert('Invalid Month.');
			return false;
		}
		else if (date[1].length > 2) {
			alert('Invalid year. USE Format As mm-yy');
			return false;
		}
		else {
			return newDate = '20' + date[1] + '-' + date[0] + '-' + '01';
		}
	}
	else {
		return newDate;
	}

}
function GoToNext() {
	$(document).on('keyup', function (e) {
		if (e.which == 13) {
			e.preventDefault();
			$(':focus').removeClass('border border-danger');
			var id = $(':focus').attr('id');
			if ((id != 'txtAmount')) {
				$(':focus').closest('td').next('td').find('.form-control,.select2-selection,select').addClass('border border-danger').focus();
			}
			else {
				InsertPurchase();
			}

		}
	});
}
function CalAmount() {
	var trade = $('#txtTrade').val();
	var qty = $('#txtQty').val();
	amount = parseFloat(trade) * parseFloat(qty);
	$('#txtAmount').val(amount);
}
function disCheck() {
	var discount = parseFloat($('#txtDiscountAmount').val());
	var total = parseFloat($('#txtDisTotal').val());
	if (discount > total) {
		alert('Discount Shoule be Less Then Total Amount..');
		$('#txtDiscountAmount').val('').addClass('border-imp').focus();
	}
	else {
		$('#txtDiscountAmount').removeClass('border-imp');
	}
}
function disValidation() {
	var discount = $('#txtDiscountAmount').val();
	if (discount == '') {
		alert('Please Provide Discount Amount..');
		$('#txtDiscountAmount').val('').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtDiscountAmount').removeAttr('style');
	}
	return true;
}