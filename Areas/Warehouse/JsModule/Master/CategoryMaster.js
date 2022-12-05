
$(document).ready(function () {
	GetCategoryList();
	$('select').select2();
	searchTable('txtSearch', 'tblCategory');
	$('#tblCategory tbody').on('click', '.getCat', function () {
		$('#txtCatName').val($(this).data('categoryname'));
		$('span[data-categoryid]').text($(this).data('categoryid'));
		maincat = $(this).data('maincat');
		$('#ddlMainCategory option').each(function () {
			
			if ($(this).text() == maincat) {
				$('#ddlMainCategory').prop('selectedIndex', '' + $(this).index() + '').change();
			}
		});
		$('#btnSaveCategory').val('Update').addClass('btn-warning');
		selectRow($(this));
	});
	$('#tblCategory tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var catid = $(this).find('input[type=checkbox]').data('categoryid');
		var val = $(this).find('input[type=checkbox]').data('isactive');
		if (isCheck) {
			if (val == 'Active') {
				UpdateStatus(catid, 0);
			}
			else {
				UpdateStatus(catid, 1);
			}
		}
	});
	$('#btnSaveCategory').on('click', function () {
		var val = $(this).val();
		if (val == 'Submit') {
			InsertCategory();
		}
		else if (val == 'Update') {
			UpdateCategory();
		}
	});
});

function GetCategoryList() {
	var url = config.baseUrl + "/api/Warehouse/MasterQueries";
	var objBO = {};
	objBO.Logic = 'GetCategoryList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data != '') {
				$('#tblCategory tbody').empty();
				var tbody = "";
				var temp = "";

				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.MainCategory) {
						tbody += "<tr style='background:#addbff'>";
						tbody += "<td colspan='4'>" + val.MainCategory + "</td>";
						tbody += "</tr>";
						temp = val.MainCategory
					}
					tbody += "<tr>";
					tbody += "<td>" +
						'<category type="button" data-maincat="' + val.MainCategory + '" data-categoryid=' + val.CategoryId + ' data-categoryname="' + val.CategoryName + '" data-hospid=' + val.hosp_id + ' class= "btn btn-primary btn-xs getCat" > <i class="fa fa-edit"></i></category>' +
						"</td>";
					tbody += "<td>" + val.CategoryId + "</td>";
					tbody += "<td>" + val.CategoryName + "</td>";
					tbody += "<td>" +
						'<label class="switch">' +
						'<input type="checkbox" data-categoryid=' + val.CategoryId + ' data-isactive=' + val.IsActive + ' class="IsActive" id="chkActive" ' + val.checked + '>' +
						'<span class="slider round"></span>' +
						'</label>' +
						"</td>";
					tbody += "</tr>";
					//$('<tr>' +
					//	'<td>' +
					//	'<category type="button" data-categoryid=' + val.CategoryId + ' data-categoryname="' + val.CategoryName + '" data-hospid=' + val.hosp_id + ' class= "btn btn-primary btn-xs getCat" > <i class="fa fa-edit"></i></category></td>' +
					//	'<td>' + val.MainCategory + '</td><td>' + val.CategoryId + '</td><td>' + val.CategoryName + '</td>	' +
					//	'<td>' +
					//	'<label class="switch">' +
					//	'<input type="checkbox" data-categoryid=' + val.CategoryId + ' data-isactive=' + val.IsActive + ' class="IsActive" id="chkActive" ' + val.checked + '>' +
					//	'<span class="slider round"></span>' +
					//	'</label >' +
					//	'</td></tr>').appendTo($('#tblCategory tbody'));
				});
				$('#tblCategory tbody').append(tbody);
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
function InsertCategory() {
	if (Validate()) {
		var url = config.baseUrl + "/api/Warehouse/InsertUpdateCategory";
		var objBO = {};
		objBO.hosp_id = Active.unitId;
		objBO.MainCategory = $('#ddlMainCategory option:selected').text();
		objBO.CategoryName = $('#txtCatName').val().toUpperCase();
		objBO.login_id = Active.userId;
		objBO.Logic = 'Insert';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'Successfully Saved') {
					Clear();
					alert(data);
					GetCategoryList();
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
function UpdateCategory() {
	if (Validate()) {
		var url = config.baseUrl + "/api/Warehouse/InsertUpdateCategory";
		var objBO = {};
		objBO.hosp_id = Active.unitId;
		objBO.MainCategory = $('#ddlMainCategory option:selected').text();
		objBO.CategoryId = $('span[data-categoryid]').text();
		objBO.CategoryName = $('#txtCatName').val().toUpperCase();
		objBO.login_id = Active.userId;
		objBO.Logic = 'Update';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				
				if (data == 'Successfully Saved') {
					Clear();
					alert(data);
					GetCategoryList();
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
function UpdateStatus(catid, IsActive) {
	var url = config.baseUrl + "/api/Warehouse/InsertUpdateCategory";
	var objBO = {};
	objBO.CategoryId = catid;
	objBO.IsActive = IsActive;
	objBO.Logic = 'UpdateStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data == 'Successfully Saved') {
				GetCategoryList();
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

//Validation
function Validate() {
	var name = $('#txtCatName').val();
	var MainCategory = $('#ddlMainCategory option:selected').text();

	if (MainCategory == 'SELECT CATEGORY') {
		$('span.selection').find('span[aria-labelledby=select2-ddlMainCategory-container]').css('border-color', 'red').focus();
		alert('Please Select Main Category..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlMainCategory-container]').removeAttr('style').focus();
	}
	if (name == '') {
		$('#txtCatName').css('border-color', 'red').focus();
		alert('Please Provide Category Name..');
		return false;
	}
	else {
		$('#txtCatName').removeAttr('style').focus();
	}
	return true;
}
function Clear() {
	$('input[type=text]').val('');
	$('select').prop('selectedIndex', '0').change();
	$('#btnSaveCategory').val('Submit').removeClass('btn-warning').addClass('btn-success');
}





