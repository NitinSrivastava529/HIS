$(document).ready(function () {
    CloseSidebar();
    bindCart();
    $("#txtInStock").prop("disabled", true);
    $("#txtQty").on("keydown", function (e) {
        if (e.which == 13) {
            $("#txtRemark").focus();
        }
    });
    $("#txtRemark").on("keydown", function (e) {
        if (e.which == 13) {
            AddStock();
        }
    });
    $('#txtItemName').on('keyup', function (e) {
        if ($('#ddlCartList option:selected').text() != 'Select') {
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
                    var itemid = $("#tblnavigate tbody").find('tr.selected').data('itemid');
                    $("#hiditemId").val(itemid);
                    var itemidtext = $("#tblnavigate tbody").find('tr.selected').text();
                    $('#txtItemName').val(itemidtext);
                    $('#ItemList').hide();
                    GetStockByItemIdandCartId($("#ddlCartList option:selected").val(), $("#hiditemId").val());
                    break;
                default:
                    var val = $('#txtItemName').val();
                    if (val == '') {
                        $('#ItemList').hide();
                    }
                    else {
                        $('#ItemList').show();
                        ItemSelection();
                    }
                    break;
            }
        }
        else {
            alert('Please Choose Cart..!');
            $('#ddlCartList').css('border-color', 'red').focus();
        }

    });
    $('#tblnavigate tbody').on('click', 'tr', function () {
        itemid = $(this).data('itemid');
        cart = $("#ddlCartList option:selected").val();
        itemidtext = $(this).text();
        $("#hiditemId").val(itemid);

        $('#txtItemName').val(itemidtext);
        $('#ItemList').hide();
        $('#tblnavigate tbody').empty();
        GetStockByItemIdandCartId(cart, itemid);
    });
    $('#tblStock tbody').on('click', 'tr', function () {
        var inStock = $(this).find('td:eq(5)').text();
        var packType = $(this).find('td:eq(1)').text();
        var packqty = $(this).find('td:eq(3)').text();
        var mstkey = $(this).find('td:eq(0)').text();
        $('#txtInStock').val(inStock);
        $('#txtPackType').val(packType);
        $('#txtPackQty').val(packqty);
        $('#hidmasterkey').val(mstkey);
        $('input[id=txtQty]').focus();
        $('#divpopup').hide();
    });
    $('#tblStockTransaction tbody').on('click', 'button', function () {
        if (confirm('Are you sure to delete this Record..!')) {
            $(this).closest('tr').remove();
        }
    });
    $(document).on('keydown', function (e) {
        var popup = $('#divpopup').css('display') == 'block';
        //var btnsaveorder = $('#btnSaveOrder').hasClass('focus1');
        var KeyCode = e.keyCode;
        if (popup) {
            var tbody = $('#tblStock').find('tbody');
            var selected = tbody.find('.selected');
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
                    var inStock = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(6)').text();
                    var packType = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(2)').text();
                    var packqty = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(4)').text();
                    var mstkey = $('#tblStock').find('tbody').find('tr.selected').find('td:nth-child(1)').text();
                    $('#divpopup').hide();
                    $('#txtInStock').val(inStock);
                    $('#txtPackType').val(packType);
                    $('#txtPackQty').val(packqty);
                    $('#hidmasterkey').val(mstkey);
                    $('input[id=txtQty]').focus();
                    break;
            }
        }

    });
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
        selectRow($(this));
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
    $('#tblProduct tbody').on('click', '.delete', function () {
        $(this).closest('tr').remove();
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
function bindCart() {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.login_id = Active.userId;
    objConsumpBO.Logic = "GetCartListByLogin";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $("ddlCartList").empty();
                //$("#ddlCartList").append($("<option></option>").val("0").html("Select"));
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlCartList").append($("<option></option>").val(value.CartId).html(value.CartName)).select2();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemSelection() {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.hosp_id = Active.unitId;
    objConsumpBO.CartId = $('#ddlCartList option:selected').val();
    objConsumpBO.prm_1 = $('#txtItemName').val();
    objConsumpBO.Logic = "ItemSelection";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ItemList tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ItemList').show();
                    $('<tr class="searchitems" data-itemid=' + val.item_id + '><td>' + val.item_name + "</td></tr>").appendTo($('#ItemList tbody'));
                });
            }
            else {
                $('#ItemList').hide();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetStockByItemIdandCartId(cartId, itemid) {
    var url = config.baseUrl + "/api/warehouse/wh_ConsumptionQueries";
    var objConsumpBO = {};
    objConsumpBO.hosp_id = Active.unitId;
    objConsumpBO.CartId = cartId;
    objConsumpBO.item_id = itemid;
    objConsumpBO.Logic = "GetStockByItemIdAndCartId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {

            $('#tblStock tbody').empty();
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td style="width: 28% !important;">' + val.master_key_id + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblStock tbody').append(htmldata);
                $("#divpopup").show();
            }
            else {
                $('#ItemList').hide();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ConsumeStock() {
    if (confirm('Are you sure to Consume Stock?')) {
        if (ValidateStock()) {
            var url = config.baseUrl + "/api/warehouse/wh_ConsumeStockByPatient";
            var objStock = [];
            $('#tblStockTransaction tbody tr').each(function () {
                objStock.push({
                    'HospId': Active.unitId,
                    'pt_name': $('span[data-pname]').text(),
                    'ipop_no': $('span[data-ipd]').text(),
                    'gen_from': 'IPD',
                    'dept_name': $('span[data-department]').text(),
                    'room_no': $('span[data-roomno]').text(),
                    'bed_no': '-',
                    'doctor_id': "-",
                    'doctor_name': $('span[data-doctor]').text(),
                    'from_cart': $('#ddlCartList option:selected').val(),
                    'item_id': $(this).find('td:eq(1)').text(),
                    'master_key_id': $(this).find('td:eq(0)').text(),
                    'qty': $(this).find('td:eq(8)').text(),
                    'remark': $(this).find('td:eq(7)').text(),
                    'item_name': $(this).find('td:nth-child(2)').text(),
                    'login_id': Active.userId,
                    'UHID': $('span[data-uhid]').text(),
                    'pay_type': '-',
                    'PanelId': $('span[data-panelid]').text(),
                    'panel_name': $('span[data-companyname]').text(),
                    'ReqBy': $('#ddlReqBy option:selected').text(),
                    'ReqType': 'Urgent',
                    'ProductSaleType': '-',

                });
            });
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objStock),
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                traditional: true,
                success: function (data) {
                    
                    if (data.includes('Successfully')) {
                        alert(data);
                        $('#tblStockTransaction tbody').empty();
                        $('#ddlCartList').prop('selectedIndex', '0');
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
}
function ValidateStock() {
    
    var ipd = $('span[data-ipd]').text();
    var items = $('#tblStockTransaction tbody tr').length;

    if (ipd == '') {
        alert('Please Choose Patient Details..!');
        return false;
    }
    if (items <= 0) {
        alert('Please Choose Items for Consume Stock..!');
        return false;
    }
    return true;
}
function ValidateAddStock() {
    var itemId = $('#hiditemId').val();
    var Qty = $('#txtQty').val();

    if (itemId == '') {
        alert('Please Choose Item..!');
        $('#txtItemName').val('').focus();
        return false;
    }
    if (Qty == '') {
        $('#txtQty').css('border-color', 'red').focus();
        alert('Please Provide Quantity..!');
        return false;
    }
    else {
        $('#txtQty').removeAttr('style');
    }
    return true;
}
function AddStock() {
    if (ValidateAddStock()) {
        var master_key_id = $('#hidmasterkey').val();
        var ItemId = $('#hiditemId').val();
        var ItemName = $('#txtItemName').val();
        var pack_type = $('#txtPackType').val();
        var pack_qty = $('#txtPackQty').val();
        var batch_no = '0000';
        var exp_date = '10-10-2020';
        var remark = $('#txtRemark').val();
        var qty = $('#txtQty').val();
        var htmldata = "";
        if (pack_qty == '') {
            alert('Please Choose Pack..');
            $('#txtQty').val('');
            $('#txtItemName').focus();
            return;
        }
        htmldata += '<tr>';
        htmldata += '<td>' + master_key_id + '</td>';
        htmldata += '<td style="display:none">' + ItemId + '</td>';
        htmldata += '<td style="width: 28%;">' + ItemName + '</td>';
        htmldata += '<td>' + pack_type + '</td>';
        htmldata += '<td>' + pack_qty + '</td>';
        htmldata += '<td>' + batch_no + '</td>';
        htmldata += '<td>' + exp_date + '</td>';
        htmldata += '<td>' + remark + '</td>';
        htmldata += '<td>' + qty + '</td>';
        htmldata += '<td><button class="btn-danger btn-flat">Delete</button></td>';
        var ids = $("#tblStockTransaction tbody tr").map(function () {
            if ($(this).find('td:eq(0)').text() == master_key_id) return true;
        });
        if (ids.length <= 0) {
            $("#tblStockTransaction tbody").append(htmldata);
            $('#hiditemId').val('');
            $('#hidmasterkey').val('');
            $('#txtPackType').val('');
            $('#txtPackQty').val('');
            $('#txtQty').val('');
            $('#txtRemark').val('');
            $('#txtInStock').val('');
            $('#tblStock tbody').empty();
            $('#txtItemName').val('').focus();
            $("#tblnavigate tbody").empty();
        }
        else {
            $('#hidmasterkey').val('');
            $('#hiditemId').val('');
            $('#txtPackType').val('');
            $('#txtPackQty').val('');
            $('#txtQty').val('');
            $('#txtRemark').val('');
            $('#txtInStock').val('');
            $('#tblStock tbody').empty();
            $('#txtItemName').val('').focus();
            $("#tblnavigate tbody").empty();
            alert('This Product Already Added..!');
        }
    }
}
function GoToNext() {
    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            
            var id = $(':focus').attr('id');
            if ((id != 'txtRemark')) {
                $(':focus').next('.form-control,.select2-selection,select').focus();
            }
            else {
                AddStock();
            }

        }
    });
}
function CheckQty() {
    var InStock = parseInt($('#txtInStock').val());
    var Qty = parseInt($('#txtQty').val());
    if (Qty > InStock) {
        alert('Consume Quantity should be Less Then Stock Quantity..!');
        $('#txtQty').val('')
    }
}