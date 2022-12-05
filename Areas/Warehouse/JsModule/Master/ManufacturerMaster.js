
$(document).ready(function () {
    GetManufacturerList();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblManufacturer tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblManufacturer tbody').on('click', '.getManf', function () {
        $('#txtManufName').val($(this).data('mfdname'));
        $('#txtContactNo').val($(this).data('contact'));
        $('#txtAddress').val($(this).data('address'));
        $('#txtRemark').val($(this).data('remark'));
        $('span[data-mfdid]').text($(this).data('mfdid'));
		$('#btnSaveManufacturer').val('Update').addClass('btn-warning');
		$(this).closest('tr').parents('tbody').find('td').removeClass('select-row');
		$(this).closest('tr').find('td:eq(0),td:eq(1)').addClass('select-row');
    });
    $('#btnSaveManufacturer').on('click', function () {
        var val = $(this).val();  
        if (val == 'Submit') {
            InsertManfacturer();
        }
        else if (val == 'Update'){
            UpdateManfacturer();
        }
    });
});

function GetManufacturerList() {
    var url = config.baseUrl + "/api/Warehouse/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetManufacturerList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#tblManufacturer tbody').empty();                
                $.each(data.ResultSet.Table, function (key, val) {
					$('<tr><td>' + val.mfd_id + '</td><td>' + val.mfd_name + '</td>' +                
                        '<td class="btn text-green getManf" data-hospid="' + val.hosp_id + '" data-mfdid="' + val.mfd_id + '" data-contact="' + val.contact_no + '" data-mfdname="' + val.mfd_name + '" data-remark="' + val.remark + '" data-address="' + val.address + '">' +
                        '<span class="fa fa-arrow-right"></span></td></tr>').appendTo($('#tblManufacturer tbody'));                  
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
function InsertManfacturer() {
    if (Validate()) {
        var url = config.baseUrl + "/api/Warehouse/InsertUpdateManufacturer";
        var objBO = {};
		objBO.hosp_id = Active.unitId;
		objBO.mfd_name = $('#txtManufName').val().toUpperCase();
        objBO.contact_no = $('#txtContactNo').val();
        objBO.address = $('#txtAddress').val();
        objBO.remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {               
                if (data== 'Successfully Saved') {
                    Clear();
                    alert(data);
                    GetManufacturerList();
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
function UpdateManfacturer() {
    if (Validate()) {
        var url = config.baseUrl + "/api/Warehouse/InsertUpdateManufacturer";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.mfd_id = $('span[data-mfdid]').text();
		objBO.mfd_name = $('#txtManufName').val().toUpperCase();
        objBO.contact_no = $('#txtContactNo').val();
        objBO.address = $('#txtAddress').val();
        objBO.remark = $('#txtRemark').val();
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
                    GetManufacturerList();
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
    var name=$('#txtManufName').val();
    var contact =$('#txtContactNo').val();
    var address =$('#txtAddress').val();
    var remark =$('#txtRemark').val();

    if (name == '') {
        $('#txtManufName').css({ 'border-color': 'red' });
        alert('Please Provide Name..');
        return false;
    }
    else {
        $('#txtManufName').removeAttr('style').focus();
    }
    //if (contact == '') {
    //    $('#txtContactNo').css({ 'border-color': 'red' });
    //    alert('Please Provide Contact No..');
    //    return false;
    //}
    //else {
    //    $('#txtContactNo').removeAttr('style').focus();
    //}
    //if (address == '') {
    //    $('#txtAddress').css({ 'border-color': 'red' });
    //    alert('Please Provide Address..');
    //    return false;
    //}
    //else {
    //    $('#txtAddress').removeAttr('style').focus();
    //}
    //if (remark == '') {
    //    $('#txtRemark').css({ 'border-color': 'red' });
    //    alert('Please Provide Remark..');
    //    return false;
    //}
    //else {
    //    $('#txtRemark').removeAttr('style').focus();
    //}
    return true;
}
function Clear() {
    $('input[type=text],textarea').val('');
    $('#btnSaveManufacturer').val('Submit').removeClass('btn-warning').addClass('btn-success');
}





