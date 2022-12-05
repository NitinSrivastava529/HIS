$(document).ready(function () {
	GetAll();
	GetItems();
	searchTable('txtSearch','tblItem')
	$('#btnSave').on('click', function () {
		var val = $(this).text().trim();
		debugger
		switch(val) {
			case (val='Submit'):
				InsertUpdateItem('Insert');
				break;
			case (val= 'Import'):			
				InsertUpdateItem('Insert');
				break;		
			case (val ='Update'):
				InsertUpdateItem('Update');
				break;
			default:
				alert('error');
				break;
		}		
	});
	$("#tblItem tbody").on('click', 'button.btn-warning', function () {
		var ItemId = $(this).closest('tr').find('td:eq(1)').text();
		GetItemsByItemId(ItemId);
	});
	$('#tblItem tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var itemid = $(this).find('input[type=checkbox]').data('itemid');
		var IsActive = $(this).find('input[type=checkbox]').data('active');
		if (isCheck) {
			if (IsActive == '1') {
				UpdateStatus(itemid, '0');
			}
			else {
				UpdateStatus(itemid, '1');
			}
		}
	});
	$('#tblSearchItem tbody').on('click', 'button', function () {
		var itemId = $(this).closest('tr').find('td:eq(1)').text();
		var itemName = $(this).closest('tr').find('td:eq(2)').text();			
		$('#txtItemId').text(itemId);
		$('#txtWhItemId').text(itemId);
		$('#txtItemName').val(itemName);	
		$('#modalItemSearch').modal('hide');
		$('#modalItemSearch input[type=text]').val('');
		$('#tblSearchItem tbody').empty();
		$('#btnSave').html('<i class="fa fa-sign-in">&nbsp;</i>Import').switchClass('btn-primary', 'btn-warning');				
	});
});

function GetAll() {
	var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
	var objBO = {};
	objBO.Logic = 'All';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				console.log(data)
				$("#ddlSterileType").empty().append($('<option>Select</option>'));
				$.each(data.ResultSet.Table, function (key, val) {
					$("#ddlSterileType").append($("<option></option>").val(val.SterileType).html(val.SterileType));
				});

				$("#ddlItemCategory").empty().append($('<option>Select</option>'));
				$.each(data.ResultSet.Table1, function (key, val) {
					$("#ddlItemCategory").append($("<option></option>").val(val.ItemCategory).html(val.ItemCategory));
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
function GetItems() {
	var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
	var objBO = {};
	objBO.Logic = 'All';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table2).length > 0) {					
					$("#tblItem tbody").empty();
					var tbody = "";
					var count = 0;
					$.each(data.ResultSet.Table2, function (key, val) {
						count++;
						tbody += "<tr>";
						tbody += "<td><button class='btn bn btn-warning' style='height: 20px;'>Edit</button></td>";
						tbody += "<td>" + val.ItemId + "</td>";
						tbody += "<td>" + val.ItemName + "</td>";
						tbody += '<td class="text-center">' +
							'<label class="switch">' +
							'<input type="checkbox" data-itemid=' + val.ItemId + ' data-active=' + val.IsActive + ' class="statusflag" id="chkActive" ' + val.checked + '>' +
							'<span class="slider round"></span></label>' +
							'</td>';
						tbody += "</tr>";
					});
					$("#tblItem tbody").append(tbody);
				}
				else {
					alert("Data Not Found");
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ItemSearch() {
	if ($('#txtItemSearch').val().trim().length > 2) {
		var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
		var objBO = {};
		objBO.Prm_1 = $('#txtItemSearch').val();
		objBO.Logic = 'GetWhItems';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			contentType: "application/json;charset=utf-8",
			dataType: "JSON",
			async: false,
			success: function (data) {
				$('#tblSearchItem tbody').empty();
				if (Object.keys(data.ResultSet).length > 0) {
					if (Object.keys(data.ResultSet.Table).length) {
						var tbody = "";
						$.each(data.ResultSet.Table, function (key, val) {
							tbody += "<tr>";
							tbody += "<td style='width:1%'><button class='btn-success btn-flat'>Select</button></td>";
							tbody += "<td>" + val.item_id + "</td>";
							tbody += "<td>" + val.item_name + "</td>";
							tbody += "<td>" + val.item_type + "</td>";
							tbody += "<td>" + val.hsn + "</td>";
							tbody += "<td>" + val.rol + "</td>";
							tbody += "<td>" + val.MOQ + "</td>";							
							tbody += "</tr>";
						});
						$('#tblSearchItem tbody').append(tbody);
					}
				}
				else {
					alert('No Record Found..');
				}
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function GetItemsByItemId(ItemId) {
	var url = config.baseUrl + "/api/cssd/CSSD_MasterQueries";
	var objBO = {};
	objBO.ItemId = ItemId;
	objBO.Logic = 'GetItemsByItemId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {					
					$.each(data.ResultSet.Table, function (key, val) {
						$("#txtItemName").val(val.ItemName);
						$("#txtItemId").text(val.ItemId);
						$("#ddlSterileType option").map(function () {
							if ($(this).text().toLowerCase() == val.sterileType.toLowerCase()) {
								$("#ddlSterileType").prop('selectedIndex', '' + $(this).index() + '');
							}
						});
						$("#ddlItemCategory option").map(function () {
							if ($(this).text().toLowerCase() == val.ItemCategory.toLowerCase()) {
								$("#ddlItemCategory").prop('selectedIndex', '' + $(this).index() + '');
							}
						});
						$('#btnSave').html('<i class="fa fa-edit">&nbsp;</i>Update').switchClass('btn-primary', 'btn-warning');						
					});
					
				}
				else {
					alert("Data Not Found");
				};
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertUpdateItem(logic) {
	if (Validation()) {
		var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateItemMaster";
		var objBO = {};
		objBO.hosp_id = Active.unitId;
		objBO.ItemId = $('#txtItemId').text();
		objBO.ItemType = '-';
		objBO.ItemName = $('#txtItemName').val().trim();
		objBO.SterileType = $('#ddlSterileType option:selected').val();
		objBO.wh_ItemId = $('#txtWhItemId').text();
		objBO.ItemCategory = $('#ddlItemCategory option:selected').val();
		objBO.login_id = Active.userId;
		objBO.Logic = logic;
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					alert(data);
					GetItems();
					Clear();
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
function UpdateStatus(itemid, IsActive) {
	var url = config.baseUrl + "/api/cssd/CSSD_InsertUpdateItemMaster";
	var objBO = {};
	objBO.ItemId = itemid;
	objBO.IsActive = IsActive;
	objBO.login_id = Active.userId;
	objBO.Logic = 'UpdateStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetItems();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Clear() {
	$('input:text').val('');
	$('#btnSave').html('<i class="fa fa-plus">&nbsp;</i>Submit').switchClass('btn-warning', 'btn-primary');
	$('select').prop('selectedIndex', '0');
}
function Validation() {
	var ItemName = $('#txtItemName').val();
	var SterileType = $('#ddlSterileType option:selected').text();
	var ItemCategory = $('#ddlItemCategory option:selected').text();

	if (ItemName == '') {
		alert('Please Provide Item Name');
		$('#txtItemName').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtItemName').removeAttr('style')
	}
	if (SterileType == 'Select') {
		alert('Please Select Sterile Type');
		$('#ddlSterileType').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#ddlSterileType').removeAttr('style')
	}
	if (ItemCategory == 'Select') {
		alert('Please Select Item Category');
		$('#ddlItemCategory').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#ddlItemCategory').removeAttr('style')
	}
	return true;
}