
$(document).ready(function () {    
    GetPatientDetails();
    GetDoctor();
    GetNurseDetails();
    $('#ddlReqBy tbody').on('click', 'tr', function () {
        var val = $(this).data('name');
        $('a[id=txtReqBy]').empty().text(val);
        $('#txtSearchNurse').val('');
        GetNurseDetails();
        $('#ddlReqBy').hide();
    });
    $('#txtSearchPatient').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblAdmittedIPDPatient tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#ddlRoom').on('change', function () {
        var val = $(this).val().toLowerCase();
        $('#tblAdmittedIPDPatient tbody tr').filter(function () {
            var i = $(this).find('td').eq(0).data('room');
            $(this).toggle($(this).find('td').eq(0).data('room').toLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblAdmittedIPDPatient tbody').on('click', '.getPatient', function () {
        $('span[data-pname]').text($(this).data('pname'));
        $('span[data-gender]').text($(this).data('gender'));
        $('span[data-age]').text($(this).data('age'));
        $('span[data-admiteddate]').text($(this).data('admiteddate'));
        $('span[data-doctor]').text($(this).data('doctor'));
        $('span[data-uhid]').text($(this).data('uhid'));
        $('span[data-ipd]').text($(this).data('ipd'));
        $('span[data-roomno]').text($(this).data('roomno'));
        $('span[data-panelid]').text($(this).data('panelid'));
        $('span[data-companyname]').text($(this).data('companyname'));
        $('span[data-department]').text($(this).data('department'));
        var doctor = $(this).data('doctor');
        $('#ddlDoctor option').map(function () {
            if ($(this).val() == doctor) {
                $('#ddlDoctor').val(doctor).change()
            }
        });
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
                var itemName = $('#tblnavigate').find('tbody').find('.selected').text();
                var itemid = $('#tblnavigate').find('tbody').find('.selected').data('itemid');
                var IsCash = $('#tblnavigate').find('tbody').find('.selected').data('iscash');
                var msg = $('#tblnavigate').find('tbody').find('.selected').data('alertmsg');
                if (msg != '-') {
                    $('.msg').html('<p>' + msg + '</p><span>X</span>').show();
                }
                $('#txtSearchProduct').val(itemName).blur();
                $('#txtQuantity').focus();
                $('#txtItemID').val(itemid);
                $('#txtIsCash').val(IsCash);
                $('#ItemList').hide();
                break;
            default:
                var val = $('#txtSearchProduct').val();
                if (val == '') {
                    $('#ItemList').hide();
                }
                else {
                    $('#ItemList').show();
                    var key = $(this).val();
                    var type = $('#ddlSearchType option:selected').val();
                    if (ValidateSearch()) {
                        SearchMedicine(key, type);
                    };
                }
                break;
        }
    });
    $('#tblnavigate tbody').on('click', 'tr', function () {
        var itemName = $(this).text();
        var itemid = $(this).data('itemid');
        var msg = $(this).data('alertmsg');
        var IsCash = $(this).data('iscash');
        if (msg != '-') {
            $('.msg').html('<p>' + msg + '</p><span>X</span>').show();
        }
        $('#txtSearchProduct').val(itemName).blur();
        $('#txtItemID').val(itemid);
        $('#txtIsCash').val(IsCash);
        $('#ItemList').hide();
    });
    $('.msg').on('click', 'span', function () {
        $('.msg').html('').hide();
    });
    $('#btnSaveProduct').on('click', function () {

        var Pname = $('#txtSearchProduct').val();
        var Pquantity = $('#txtQuantity').val();
        var Premark = $('#txtRemark').val();
        var ItemID = $('#txtItemID').val();
        var IsCash = $('#txtIsCash').val();
        
     
        if (ValidateProduct()) {
            var ids = $('#tblProduct tbody').find('tr').filter(function () {
                if ($(this).find('td').eq(0).text() == ItemID) return true;
            });
            if (ids.length <= 0) {
                $('<tr><td style="display:none">' + ItemID + '</td><td>' + Pname + '</td><td>' + Pquantity + '</td><td>' + Premark + '</td> <td>' + IsCash + '</td> <td><span class="btn text-danger delete"><b class="fa fa-remove text-17"></b></span></td></tr>').appendTo($('#tblProduct tbody'));
                $('#txtQuantity').val('');
                $('#txtRemark').val('');
                $('#txtSearchProduct').val('').focus();
                $('.msg').html('').hide();
            }
            else {
                $('#txtSearchProduct').val('').focus();
                $('#txtQuantity').val('');
                $('#txtRemark').val('');
                $('.msg').html('').hide();
                alert('Product Already Selected...! Try Aother One.')
            }
        }
    });
    $('#tblProduct tbody').on('click', '.delete', function () {
        $(this).closest('tr').remove();
    });
    $('#btnSaveIPOPIndent').on('click', function () {
        if (ValidateIndent()) {
            SaveIPOPIndent();
        }
    })
    $('input[id=txtQuantity]').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#txtRemark').focus();
        }
    });
    $('input[id=txtRemark]').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#btnSaveProduct').trigger('click');
        }
    });
});

function GetPatientDetails() {
    var url = config.baseUrl + "/api/IPDNursing/GetAdmittedIPDPatient";
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            if (data != '') {
                $("#tblAdmittedIPDPatient tbody").empty();
                $('#ddlRoom').empty().append('<option>Select Room</option>');
                
                var room = [];
                $.each(data.ResultSet.Table, function (key, val) {
                    var r = val.RoomName.split('/');
                    room.push(r[3]);
                    $('<tr><td data-room="' + r[3] + '">' + val.IPDNO + '</td><td>' + val.PName + '</td><td>' + val.Patient_ID + '</td><td>' + val.DName + '</td>' +
                        '<td class="btn text-green getPatient" data-PName="' + val.PName + '" data-Gender="' + val.Gender + '" data-Age="' + val.Age + '" data-AdmitedDate="' + val.AdmitDate + '" data-Doctor="' + val.DName + '"data-UHID="' + val.Patient_ID + '"data-IPD="' + val.IPDNO + '"data-RoomNo="' + val.RoomName + '"data-panelid="' + val.Panel_ID + '"data-companyname="' + val.Company_Name + '" data-department="' + val.Department + '">' +
                        '<span class="fa fa-arrow-right"></span></td></tr>').appendTo($("#tblAdmittedIPDPatient tbody"));

                });
                var unique = room.filter(function (itm, i, room) {
                    return i == room.indexOf(itm);
                });
                for (i = 0; i < unique.length; i++) {
                    var data = '<option>' + unique[i] + '</option>'
                    $('#ddlRoom').append(data);
                }
                ////$("#tblAdmittedIPDPatient").tableHeadFixer();
                //$('#tblAdmittedIPDPatient').tableScroll({ height: 200 });
                ////$('#thetable').tableScroll({ height: 200 });
                ////$('#thetable').tableScroll({ width: 400 });
                ////$('#thetable').tableScroll({ containerClass: 'myCustomClass' });
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
function GetDoctor() {
    var url = config.baseUrl + "/api/IPDNursing/GetDoctor";
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            $('#ddlDoctor').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlDoctor").append($("<option data-id=" + val.Doctor_id + "></option>").val(val.DoctorName).html(val.DoctorName)).select2();
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
function SearchMedicine(key, type) {
    var url = config.baseUrl + "/api/IPDNursing/SearchMedicine";
    var objBO = {};
    objBO.searchKey = key;
    objBO.searchType = type;
    objBO.PanelId = $('span[data-panelid]').text();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblnavigate tbody').empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#tblnavigate').show();
                    $('<tr class="searchitems" data-AlertMsg="' + val.AlertMsg + '" data-itemid=' + val.item_id + ' data-iscash=' + val.IsCash + '><td>' + val.item_name + "</td></tr>").appendTo($('#tblnavigate tbody'));
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
function SaveIPOPIndent() {
    var url = config.baseUrl + "/api/IPDNursing/Insert_IPOPIndent";
    var objBO = [];
    $("#tblProduct tbody tr").each(function () {
        objBO.push({
            'HospId': Active.unitId,
            'pt_name': $('span[data-pname]').text(),
            'ipop_no': $('span[data-ipd]').text(),
            'gen_from': 'IPD',
            'dept_name': $('span[data-department]').text(),
            'room_no': $('span[data-roomno]').text(),
            'bed_no': '-',
            'doctor_id': $("#ddlDoctor option:selected").data('id'),
            'doctor_name': $('#ddlDoctor option:selected').text(),
            'item_id': $(this).find('td:nth-child(1)').text(),
            'item_name': $(this).find('td:nth-child(2)').text(),
            'qty': $(this).find('td:nth-child(3)').text(),
            'login_id': Active.userId,
            'UHID': $('span[data-uhid]').text(),
            'pay_type': '-',
            'PanelId': $('span[data-panelid]').text(),
            'panel_name': $('span[data-companyname]').text(),
            'ReqBy': $('#ddlReqBy option:selected').text(),
            'ReqType': $('#ddlReqType option:selected').text(),
            'ProductSaleType': $(this).find('td:nth-child(5)').text(),
        });
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                ClearIndent();
                alert('Submitted Successfully..');
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetNurseDetails() {
    var url = config.baseUrl + "/api/IPDNursing/GetNurseDetails";
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlReqBy").append($("<option data-></option>").val(val.emp_name).html(val.emp_name)).select2();
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

//Validation
function ValidateSearch() {
    var searchType = $('#ddlSearchType option:selected').text();

    if (searchType == 'Choose Type') {
        $('#ddlSearchType').css({ 'border-color': 'red' });
        alert('Please Select Search Type..');
        $('#txtSearchProduct').val('');
        return false;
    }
    else {
        $('#ddlSearchType').removeAttr('style').siblings('span').empty();
    }
    return true;
}
function ValidateProduct() {
    var Pname = $('#txtSearchProduct').val();
    var Pquantity = $('#txtQuantity').val();
    var Pquantity = $('#txtQuantity').val();

    if (Pname == '') {
        $('#txtSearchProduct').css({ 'border-color': 'red' }).focus();
        alert('Please Provide Product Name..');
        return false;
    }
    else {
        $('#txtSearchProduct').removeAttr('style');
    }
    if (Pquantity == '') {
        $('#txtQuantity').css({ 'border-color': 'red' }).focus();
        alert('Please Provide Quantity..');
        return false;
    }
    else if (Pquantity <= 0) {
        $('#txtQuantity').css({ 'border-color': 'red' });
        alert('Please Provide Quantity More Then 0..');
        return false;
    }
    else {
        $('#txtQuantity').removeAttr('style');
    }
    return true;
}
function ValidateIPDIndent() {
    var searchType = $('#ddlSearchType option:selected').text();

    if (searchType == 'Choose Type') {
        $('#ddlSearchType').css({ 'border-color': 'red' });
        alert('Please Select Search Type..');
        $('#txtSearchProduct').val('');
        return false;
    }
    else {
        $('#ddlSearchType').removeAttr('style').siblings('span').empty();
    }
    return true;
}

function ClearIndent() {
    $('#tblProduct tbody').empty();
    //$('#ddlDoctor').attr('selectedIndex', 0);
    //$('#ddlSearchType').attr('selectedIndex', 0);
    //$('#ddlRequisition').attr('selectedIndex', 0);
    //$('span[data-pname]').text('');
    //$('span[data-gender]').text('');
    //$('span[data-age]').text('');
    //$('span[data-admiteddate]').text('');
    //$('span[data-doctor]').text('');
    //$('span[data-uhid]').text('');
    //$('span[data-ipd]').text('');
    //$('span[data-roomno]').text('');
    //$('span[data-companyname]').text('');
    //$('span[data-department]').text('');
}
function ValidateIndent() {
    var doctor = $('#ddlDoctor option:selected').text();
    var ids = $('#tblProduct tbody').find('tr').length;
    var pname = $('span[data-pname]').text();


    if (pname == '') {
        $('span[data-pname]').prev().css({ 'color': 'red' });
        alert('Please Select Patient..');
        return false;
    }
    else {
        $('span[data-pname]').prev().removeAttr('style');
    }
    if (doctor == 'Select Doctor') {
        $('#ddlDoctor').css({ 'border-color': 'red' });
        alert('Please Select Doctor..');
        return false;
    }
    else {
        $('#ddlDoctor').removeAttr('style');
    }
    if (ids <= 0) {
        alert('Please Choose Product...!');
        return false;
    }
    return true;
}





