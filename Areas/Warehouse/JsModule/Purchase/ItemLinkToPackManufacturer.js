$(document).ready(function () {
	$('#txtSearchItemLink').on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#tblItem tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});	
	$('#tblItem tbody').on('click', '#btnItem', function () {
		var itemid = $(this).closest('tr').find('td:eq(0)').text();
		var itemname = $(this).closest('tr').find('td:eq(1)').text();
		$('span[data-itemname]').text(itemname);
		$('span[data-itemid]').text(itemid);
		$('#tblItem tbody tr').find('td').removeAttr('style');
		$(this).closest('tr').find('td:eq(0),td:eq(1)').css({ 'background': 'green', 'color': '#fff' });
		GetPack();
		GetManf();
	}); 
	$('#btnLinkPack').on('click', function () {
		var pack = $('#ddlLinkPack option:selected').val();		
		LinkPackManufacturerToItem(pack, '', 'PackLink');
	});
	$('#btnLinkManufacturer').on('click', function () {
		var mnf = $('#ddlLinkManufacturer option:selected').val();
		LinkPackManufacturerToItem('', mnf, 'ManufacturerLink');
	});
	$('#tblLinkPack tbody').on('click', '#btnDelete', function () {
		var packId = $(this).data('packid');
		DeletePackManufacturerToItem(packId, '', 'DeletePack')
	}); 
	$('#tblLinkManufacturer tbody').on('click', '#btnDelete', function () {
		var mnfId = $(this).data('mfdid');
		DeletePackManufacturerToItem('', mnfId, 'DeleteManufacturer')
	}); 
});

function GetRecord() {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
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
				$("#tblItem tbody").empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.item_id+"</td>";
					tbody += "<td>" + val.item_name+"</td>";
					tbody += "<td><button id='btnItem' class='btn-danger'>>></button></td>";
					tbody += "</tr>";
				});
				$("#tblItem tbody").append(tbody);
				$("#ddlLinkManufacturer").empty().append($('<option>Select Manufacturer</option>'));
				$.each(data.ResultSet.Table1, function (key, val) {
					$("#ddlLinkManufacturer").append($("<option data-mfdid=" + val.mfd_id + "></option>").val(val.mfd_id).html(val.mfd_name)).select2();
				});

				$("#ddlLinkPack").empty().append($('<option>Select Pack</option>'));
				$.each(data.ResultSet.Table2, function (key, val) {
					$("#ddlLinkPack").append($("<option data-mfdid=" + val.autoid + "></option>").val(val.autoid).html(val.pack_type)).select2();
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
function LinkPackManufacturerToItem(pack, mfd,logic) {
	var url = config.baseUrl + "/api/Warehouse/wh_LinkPackManufacturerToItem";
	var objBO = {};
	objBO.ItemId = $('span[data-itemid]').text();
	objBO.pack_id = pack;
	objBO.MfdId = mfd;
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
				if (logic == 'PackLink') {
					GetPack();				
				}
				else if (logic == 'ManufacturerLink') {
					GetManf();
				}
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
function DeletePackManufacturerToItem(pack, mfd, logic) {
	
	var url = config.baseUrl + "/api/Warehouse/wh_LinkPackManufacturerToItem";
	var objBO = {};
	objBO.ItemId = $('span[data-itemid]').text();
	objBO.pack_id = pack;
	objBO.MfdId = mfd;
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
				if (logic == 'DeletePack') {
					GetPack();
				}
				else if (logic == 'DeleteManufacturer') {
					GetManf();
				}
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
function GetPack() {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.prm_1 = $('span[data-itemid]').text();
	objBO.Logic = 'PackByItemId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#tblLinkPack tbody").empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";			
					tbody += "<td>" + val.pack_type + "</td>";					
					tbody += "<td><button id='btnDelete' data-packid=" + val.pack_id + " class='btn-danger'>Delete</button></td>";				
					tbody += "</tr>";
				});
				$("#tblLinkPack tbody").append(tbody);				
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
function GetManf() {
	var url = config.baseUrl + "/api/Warehouse/PurchaseQuery";
	var objBO = {};
	objBO.prm_1 = $('span[data-itemid]').text();
	objBO.Logic = 'ManfByItemId';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$("#tblLinkManufacturer tbody").empty();
				var tbody = "";
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.mfd_name + "</td>";
					tbody += "<td><button id='btnDelete' data-mfdid=" + val.mfd_id+" class='btn-danger'>Delete</button></td>";	
					tbody += "</tr>";
				});
				$("#tblLinkManufacturer tbody").append(tbody);
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
