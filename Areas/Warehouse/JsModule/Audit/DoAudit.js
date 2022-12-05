var _MasterKeyId = "WithoutMKey";
var _ItemId = "-";
var _ItemName = "-";
var _CartStock = 0;
$(document).ready(function () {
   
    $('#divExtra').addClass('active-extra');
    searchTable('txtSearch','tblItemListByCart')
	//CloseSidebar();
	OnLoad();
	$("#txtItemStock").prop('disabled', true);
	$('#ddlCart').empty().append($('<option>Select Cart</option>')).select2();
	//searchTable('txtSearch', 'tblAuditMaster');
	$('#ddlDept').on('change', function () {
		DeptId = $(this).find('option:selected').val();
		GetCartByDept(DeptId);
	});

	$('#ddlCart').on('change', function () {
	    var CartId = $(this).find('option:selected').val();
        $('#tblItemStock tbody').empty();
        $('#tblAuditInfo tbody').empty()
        $('#tblItemListByCart tbody').empty();
		GetAuditNoAndItemList(CartId);
	});

    $("#tblItemStock tbody").on('click', 'a', function () {
        
        selectRow($(this));
        _MasterKeyId = $('#tblItemStock tbody').find('tr.select-row').find('td:eq(2)').text();
        _CartStock = $('#tblItemStock tbody').find('tr.select-row').find('td:eq(9)').text();
	});

	$('input[name="txtQuantity"]').keyup(function (e) {
		if (/\D/g.test(this.value)) {
			this.value = this.value.replace(/\D/g, '');
		}
    });

    $('input[name=types]').on('change', function (e) {
        if ($(this).val() == 'Extra') {
            $('#divExtra').removeClass('active-extra');
            $('#divExtra').find('input:text,input[type=date]').val('');
        }
        else {
            $('#divExtra').addClass('active-extra');
            $('#divExtra').find('input:text,input[type=date]').val('');
        }
    });
   

});

function OnLoad() {
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
	var objBO = {};
	objBO.Logic = "OnLoad";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlDept').empty().append($('<option>Select Department</option>'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlDept').append($('<option></option>').val(val.DeptId).html(val.DeptName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function GetCartByDept(DeptId) {
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
	var objBO = {};
	objBO.DeptId = DeptId;
	objBO.Logic = "GetCartByDept";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
        success: function (data) {

			$('#ddlCart').empty().append($('<option>Select Cart</option>'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlCart').append($('<option></option>').val(val.CartId).html(val.CartName)).select2();
			})
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function GetAuditNoAndItemList(CartId) {
    $("#txtAuditNo").val("");
    $('#tblItemListByCart tbody').empty();
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
	var objBO = {};
	objBO.CartId = CartId;
	objBO.Logic = "ItemAndAuditNobyCart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
	    	if (data.ResultSet.Table.length > 0) {
				$("#txtAuditNo").val(data.ResultSet.Table[0].audit_no);
				$("#pauditno").text($("#txtAuditNo").val());
				if (data.ResultSet.Table1.length > 0) {
					var htmldata = "";
					$('#tblItemListByCart').show();
				
					$.each(data.ResultSet.Table1, function (key, val) {
                        htmldata += '<tr>';
                        htmldata += '<td style="width:1%;padding: 0 2px;"><a id="btnItemStock' + key + '" href="javascript:void(0)" onclick="SelectItem(' + "'" + val.item_id + "'" + ',' + "'" + val.item_name + "'" + ')"><i class="fa fa-arrow-circle-o-right fa-2x text-red"></i></a></td>';
                        htmldata += '<td>' + val.item_name + '</td>';
                        htmldata += '<td>' + val.StockQty + '</td>';
						htmldata += '</tr>';
					});
					$('#tblItemListByCart tbody').append(htmldata);
				}
			}
			else {
				alert('No Audit is Active');
				return false;

			}
            GetAuditInfo($("#txtAuditNo").val());
		},
		error: function (err) {
			alert(err.responseText);
		}
	});

}
function SelectItem(itemId, itemname) {
    _ItemId = itemId;
    _ItemName = itemname;
    $('#txtItemStock').html(itemname);
    GetItemStock();
}
function GetItemStock() {
    _MasterKeyId = 'WithoutMKey';
    $('#divExtra').addClass('active-extra');
    $('#tblItemStock tbody').empty();
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
    var objBO = {};
    objBO.CartId = $('#ddlCart option:selected').val();;
    objBO.ItemId = _ItemId;
	objBO.Logic = "GetItemStockByItemId";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				var htmldata = "";
				$('#tblItemStock').show();

				$.each(data.ResultSet.Table, function (key, val) {
					htmldata += '<tr>';
					htmldata += '<td> <a style="background-color:#0076d0; color:#fff"  href="javascript:void(0)" class="btn btn-xs"><i class="fa fa-check"></i></a></td>';
					htmldata += '<td style="display:none">' + val.item_id + '</td>';
					htmldata += '<td style="display:none">' + val.master_key_id + '</td>';
					htmldata += '<td>' + val.mfd_name + '</td>';
					htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.mrp + '</td>';
					htmldata += '<td>' + val.pack_type + '</td>';
					htmldata += '<td>' + val.pack_qty + '</td>';
					htmldata += '<td>' + val.qty + '</td>';
					htmldata += '</tr>';
                });
                htmldata += '<tr>';
                htmldata += '<td> <a style="background-color:#0076d0; color:#fff" href="javascript:void(0)" class="btn btn-xs"><i class="fa fa-check"></i></a></td>';
                htmldata += '<td style="display:none">' + _ItemId + '</td>';
                htmldata += '<td style="display:none">WithoutMKey</td>';
                htmldata += '<td>WithoutMKey</td>';
                htmldata += '<td>-</td>';
                htmldata += '<td>-</td>';
                htmldata += '<td>0</td>';
                htmldata += '<td>1x1 Nos</td>';
                htmldata += '<td>1</td>';
                htmldata += '<td>0</td>';
                htmldata += '</tr>';
				$('#tblItemStock tbody').append(htmldata);
			}
		},
		error: function (err) {
			alert(err.responseText);
		}
	});

}
function InsertAuditInfo() {
    
	var objBO = {};
	var itemId = $('#tblItemStock tbody').find('tr.select-row').find('td:eq(1)').text();
   //alert(itemId + " " + masterid)
	var typeval = $("input[name='types']:checked").val();
	var qty = $("#txtQuantity").val();
    var auditno = $("#txtAuditNo").val();
    if (auditno.length < 3) {
        alert('Audit Number not selected');
        return false;
    }
	var cartid = $('#ddlCart option:selected').val();
	if (itemId == "") {
		alert('Please select atleast one row in item Stock tab');
		return false;
	}
	if (typeof typeval == 'undefined') {
		alert('Please select type');
		return false;
	}
	if (qty == "") {
		alert('Please enter Quantity');
		return false;
	}
	if (qty <= "0") {
		alert('Quantity can not be zero');
		return false;
    }
    if ((typeval == 'Short' || typeval == 'Damage') &&  _MasterKeyId == 'WithoutMKey') {
        alert('WithoutMKey is not allowed with Short and Damage');
        return false;
    }

    if ((eval(qty) > eval(_CartStock)) && (typeval != 'Extra')) {
        alert('Quantity is greater than Stock' + " qty :" + qty + " Stock :" + _CartStock);
        return false;
    }

    var url = config.baseUrl + "/api/warehouse/wh_InsertAuditInfo";
    objBO.MasterKeyId = _MasterKeyId;
    objBO.ItemId = itemId;
	objBO.CartId = cartid;
	objBO.AuditNo = auditno;
	objBO.batchNo = $('#txtBatchNo').val();
	objBO.exp_date = ($('#txtExpiry').val() == '') ? null : $('#txtExpiry').val();
	objBO.mrp = $('#txtMRP').val();
    objBO.Qty = qty;
    objBO.CartStock =_CartStock;
	objBO.AuditType =typeval;
	objBO.Logic = "Insert";
	objBO.login_id = Active.userId;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
            alert(data);
           _MasterKeyId = 'WithoutMKey';
            GetAuditInfo($("#txtAuditNo").val());
            $("#txtQuantity").val('');
            $('#txtBatchNo').val('');
            $("#txtExpiry").val('');
            $("#txtMRP").val('');
            $('#divExtra').find('input:text,input[type=date]').val('');
            $('#divExtra').addClass('active-extra');
            GetItemStock();
		},
		error: function (err) {
			alert(err.responseText);
		}
	});

}
function DeleteItemInAudit(autoId) {
	if (confirm('Are you sure to delete?')) {
		var objBO = {};
		var url = config.baseUrl + "/api/warehouse/wh_InsertAuditInfo";
		objBO.AutoId = autoId;
		objBO.exp_date = null;
		objBO.login_id = Active.userId;
		objBO.Logic = "DeleteItemInAudit";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				GetAuditInfo($("#txtAuditNo").val());
                $("#txtQuantity").val('');
                GetItemStock();
			},
			error: function (err) {
				alert(err.responseText);
			}
		});
	}
}
function GetAuditInfo(AuditNo) {
    $('#tblAuditInfo tbody').empty()
    var url = config.baseUrl + "/api/warehouse/wh_AuditQueries";
	var objBO = {};
	if (AuditNo == "" || typeof AuditNo == "undefined") {
		objBO.AuditNo = AuditNo;
	}
	else {
		objBO.AuditNo = $("#txtAuditNo").val();
	}
	objBO.Logic = "GetAuditInfo";
	objBO.login_id = Active.userId;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			var auditnos = "";
			if (data.ResultSet.Table.length > 0) {
				var htmldata = "";
				$('#tblAuditInfo').show();
			;
				$.each(data.ResultSet.Table, function (key, val) {
					if (auditnos != val.auditType) {
						htmldata += '<tr>';
						htmldata += '<td colspan="8" style="font-weight:bold;background-color:#d1ebfb;color:#000">' + val.auditType + '</td>';
						htmldata += '</tr>';
						auditnos = val.auditType;
					}
					htmldata += '<tr>';
					htmldata += '<td><button class="btn btn-danger btn-xs" onclick=DeleteItemInAudit("' + val.AutoId + '")><i class="fa fa-trash"></i></button></td>';
					htmldata += '<td>' + val.item_name + '</td>';
					htmldata += '<td>' + val.mfd_name + '</td>';
					htmldata += '<td>' + val.batch_no + '</td>';
					htmldata += '<td>' + val.exp_date + '</td>';
					htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
					htmldata += '</tr>';
				});
				$('#tblAuditInfo tbody').append(htmldata);
			}
		},
		error: function (err) {
			alert(err.responseText);
		}
	});
}
function CloseAudit() {
	var objBO = {};
    var auditno = $("#txtAuditNo").val();
    var url = config.baseUrl + "/api/warehouse/wh_InsertAuditInfo";
    objBO.AuditNo = auditno;
	objBO.Logic = "CloseAudit";
	objBO.login_id = Active.userId;
	if(confirm("Are you sure to close audit ?")) {
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				alert(data);
			},
			error: function (err) {
				alert(err.responseText);
			}
		});
	}
}

function SearchCart(element) {
	var searchText = $(element).val().toLowerCase();
	$.each($("#tblAuditInfo tbody tr"), function () {
		if ($(this).text().toLowerCase().indexOf(searchText) === -1)
			$(this).hide();
		else
			$(this).show();
	});
}



