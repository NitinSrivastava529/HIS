$(document).ready(function () {
	GetTemplateMaster();
	$('#btnSaveDoctorTemplate').on('click', function () {
		var val = $(this).find('i').hasClass('fa-plus');
		if (val == true) {
			InsertTemplateInfo();
		}
		else {
			UpdateTemplateInfo();
		}
	});
});

function GetTemplateMaster() {
	var url = config.baseUrl + "/api/master/CPOE_MasterQueries";
	var objBO = {};
	objBO.Logic = 'GetTemplateMaster';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$('#ddlDoctorTemplate').empty().append($('<option></option>').val(00).html('Select Template'));
			$.each(data.ResultSet.Table, function (key, val) {
				$('#ddlDoctorTemplate').append($('<option></option>').val(val.TemplateId).html(val.TemplateName));
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertTemplateInfo() {
	if (Validate()) {
		var url = config.baseUrl + "/api/master/CPOE_InsertUpdateMaster";
		var objBO = {};
        objBO.TemplateType = 'Doctor';
        objBO.DoctorId = Active.doctorId;
		objBO.TemplateId = $('#ddlDoctorTemplate option:selected').val();
		objBO.ItemId = '';
		objBO.ItemName = $('#txtDoctorItemName').val();
		var fav = $('input[name=IsFavourite]').is(':checked');
		objBO.IsFavourite = (fav == true) ? 1 : 0;
		objBO.login_id = Active.userId;
		objBO.Logic = 'InsertTemplateInfo';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'success') {
					Clear();
					alert('Created Successfully..!');
					$('.panel-body').find('button.rotate').trigger('click');
					$('#modalTemplate').modal('hide');
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
function UpdateTemplateInfo() {
	if (Validate()) {
		var url = config.baseUrl + "/api/master/CPOE_InsertUpdateMaster";
		var objBO = {};
		objBO.TemplateType = 'Doctor';
		objBO.DoctorId = 'DR00010';
		objBO.TemplateId = $('#ddlDoctorTemplate option:selected').val();
		objBO.ItemId = $('#hiddenDoctorTempItemId').text();
		objBO.ItemName = $('#txtDoctorItemName').val();
		var fav = $('input[name=IsFavourite]').is(':checked');
		objBO.IsFavourite = (fav == true) ? 1 : 0;
		objBO.login_id = Active.userId;
		objBO.Logic = 'UpdateTemplateInfo';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data == 'success') {
					Clear();
					alert('Updated Successfully..!');
					$('.panel-body').find('button.rotate').trigger('click');
					$('#modalTemplate').modal('hide');
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

//Validation
function Validate() {
	var name = $('#txtDoctorItemName').val();
	var Template = $('#ddlDoctorTemplate option:selected').text();

	if (Template == 'Select Template') {
		$('span.selection').find('span[aria-labelledby=select2-ddlDoctorTemplate-container]').css('border-color', 'red').focus();
		alert('Please Select Template..');
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlDoctorTemplate-container]').removeAttr('style').focus();
	}
	if (name == '') {
		$('#txtItemName').css('border-color', 'red').focus();
		alert('Please Provide Item Name..');
		return false;
	}
	else {
		$('#txtItemName').removeAttr('style').focus();
	}
	return true;
}
function Clear() {
	$('input[type=text]').val('');
	//$('select').prop('selectedIndex', '0').change();
	$('#btnSaveDoctorTemplate').switchClass('btn-warning', 'btn-success');
	$('#btnSaveDoctorTemplate i').switchClass('fa-edit', 'fa-plus');
}





