
$(document).ready(function () {
    //$('#ddlCategory').multiselect();
    GetItemMasterList('Y');
    GetCategory();
    GetRecord();
    //$('#ddlMainCategory').select2();
    $('#ddlMainCategory').on('change', function () {
        mainCat = $(this).find('option:selected').text();
        FilterCategory(mainCat, '');
    });
    $('#ddlShelfNo').on('change', function () {
        ShelfNo = $(this).find('option:selected').text();
        $('#txtShelfNo').val(ShelfNo);
    });
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblItem tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblItem thead').on('change', 'input:checkbox', function () {
        var isChecked = $(this).is(':checked');
        if (isChecked)
            GetItemMasterList('Y');
        else
            GetItemMasterList('N');
    });
    $('#btnSaveItem').on('click', function () {
        var val = $(this).val();

        if (val == 'Submit') {
            InsertItemMaster('Insert');
        }
        else if (val == 'Update') {
            UpdateItemMaster('Update');
        }
        else if (val == 'Import') {
            InsertItemMaster('Import');
        }
    });
    //$('#tblItem tbody').on('click', '.statusflag', function () {
    //	
    //	var itemid = $(this).data('itemid');
    //	var statusflag = $(this).data('statusflag');
    //	if (statusflag == 'Active') {
    //		UpdateStatus(itemid, 'N');
    //	}
    //	else {
    //		UpdateStatus(itemid, 'Y');
    //	}
    //});
    $('#tblItem tbody').on('click', '.switch', function () {
        isCheck = $(this).find('input[type=checkbox]').is(':checked');
        var itemid = $(this).find('input[type=checkbox]').data('itemid');
        var statusflag = $(this).find('input[type=checkbox]').data('statusflag');
        if (isCheck) {
            if (statusflag == 'Active') {
                UpdateStatus(itemid, 'N');
            }
            else {
                UpdateStatus(itemid, 'Y');
            }
        }
    });
    $('#tblItem tbody').on('click', '.getItem', function () {
        $('#txtItemName').val($(this).data('item_name'));
        $('#txtRemark').val($(this).data('remark'));
        $('#txtHSN').val($(this).data('hsn'));
        $('#txtROL').val($(this).data('rol'));
        $('#txtMOQ').val($(this).data('moq'));
        $('#txtMOQ').val($(this).data('moq'));
        $('#txtShelfNo').val($(this).data('shelfno'));
        $('span[data-item_id]').text($(this).data('item_id'));
        $('#btnSaveItem').val('Update').addClass('btn-warning');
        var categoryid = $(this).data('categoryid');
        var maincategory = $(this).data('maincategory');
        var mfdname = $(this).data('mfd_name');
        $('#ddlMainCategory option').map(function () {
            if ($(this).text() == maincategory) {
                $('#ddlMainCategory').val($(this).val());
                FilterCategory(maincategory, categoryid);
            }
        });
        //$('#ddlCategory option').map(function () {
        //	if ($(this).data('category') == categoryid) {
        //		$('#ddlCategory').val($(this).val()).change()
        //	}
        //});
        $('#ddlManufacture option').map(function () {
            if ($(this).val() == mfdname) {
                $('#ddlManufacture').val(mfdname).change()
            }
        });

        var itemid = $(this).data('item_id');
        var itemname = $(this).data('item_name');
        $('span[data-itemname]').text(itemname);
        $('span[data-itemid]').text(itemid);
        $('#tblItem tbody tr').find('td').removeAttr('style');
        $(this).closest('tr').find('td:eq(1),td:eq(2)').css({ 'background': '#0076d0', 'color': '#fff' });
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
    $('#tblSearchItem tbody').on('click', 'button', function () {
        var itemId = $(this).closest('tr').find('td:eq(1)').text();
        var itemName = $(this).closest('tr').find('td:eq(2)').text();
        var category = $(this).closest('tr').find('td:eq(3)').text();
        var hsn = $(this).closest('tr').find('td:eq(4)').text();
        var packType = $(this).closest('tr').find('td:eq(5)').text();
        var mfdId = $(this).closest('tr').find('td:eq(6)').text();
        $('#ddlMainCategory').prop('selectedIndex', '2').change();
        $('#ddlCategory').val('MEDICINE ITEMS').change();
        //$('#ddlLinkManufacturer').text(mfdId).change();
        var cat = category.toString().substr(0, 4).toLowerCase();
        $('#ddlCategory option').map(function () {
            if ($(this).val().toLowerCase().includes(cat)) {
                $('#ddlCategory').prop('selectedIndex', '' + $(this).index() + '').change();
            }
        });
        $('#txtRemark').val('Imported From Pharmacy.');
        $('#txtExternalItemId').text(itemId);
        $('#txtItemName').val(itemName);
        $('#txtHSN').val(hsn);
        $('#modalItemSearch').modal('hide');
        $('#modalItemSearch input[type=text]').val('');
        $('#tblSearchItem tbody').empty();
        $('#btnSaveItem').val('Import');
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
                $("#ddlLinkManufacturer").empty().append($('<option>Select Manufacturer</option>'));
                $.each(data.ResultSet.Table1, function (key, val) {
                    $("#ddlLinkManufacturer").append($("<option data-mfdid=" + val.mfd_id + "></option>").val(val.mfd_id).html(val.mfd_name));
                });

                $("#ddlLinkPack").empty().append($('<option>Select Pack</option>'));
                $.each(data.ResultSet.Table2, function (key, val) {
                    $("#ddlLinkPack").append($("<option data-mfdid=" + val.autoid + "></option>").val(val.autoid).html(val.pack_type));
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
function LinkPackManufacturerToItem(pack, mfd, logic) {
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
                    tbody += "<td><button id='btnDelete' data-mfdid=" + val.mfd_id + " class='btn-danger'>Delete</button></td>";
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
function GetCategory() {
    var url = config.baseUrl + "/api/Warehouse/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetCategoryList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $("#ddlCategory").empty().append($('<option>Select Category</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlCategory").append($("<option></option>").val(val.CategoryName).html(val.CategoryName));
                });
                $("#ddlShelfNo").empty().select2().append($('<option>Select</option>'));
                $.each(data.ResultSet.Table1, function (key, val) {
                    $("#ddlShelfNo").append($("<option></option>").val(val.ShelfNo).html(val.ShelfNo));
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
function ItemSearch() {
    if ($('#txtItemSearch').val().trim().length > 2) {
        var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
        var objBO = {};
        objBO.unit_id = Active.unitId;
        objBO.TransferId = '';
        objBO.prm_1 = $('#txtItemSearch').val();
        objBO.from = '1900/01/01';
        objBO.to = '1900/01/01';
        objBO.login_id = Active.userId;
        objBO.Logic = "ItemsForItemMaster";
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
                            tbody += "<td>" + val.category + "</td>";
                            tbody += "<td>" + val.hsn + "</td>";
                            tbody += "<td>" + val.pack_type + "</td>";
                            tbody += "<td>" + val.mfd_id + "</td>";
                            tbody += "<td>" + val.mfd_name + "</td>";
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
function FilterCategory(mainCat, data) {
    var url = config.baseUrl + "/api/Warehouse/MasterQueries";
    var objBO = {};
    objBO.MainCategory = mainCat;
    objBO.Logic = 'GetCategoryListByMainCat';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $("#ddlCategory").empty().append($('<option>Select Category</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#ddlCategory").append($("<option data-category=" + val.CategoryId + "></option>").val(val.CategoryName).html(val.CategoryName));
                });
            }
            else {
                alert("Error");
            };
        },
        complete: function (com) {
            $('#ddlCategory option').map(function () {
                if ($(this).data('category') == data) {
                    $('#ddlCategory').val($(this).val()).change()
                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetItemMasterList(flag) {
    var url = config.baseUrl + "/api/Warehouse/MasterQueries";
    var objBO = {};
    objBO.prm_1 = flag;
    objBO.Logic = 'GetItemMasterList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#tblItem tbody').empty();
                var tbody = "";
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.category) {
                        tbody += "<tr style='background:#cbe9ff'>";
                        tbody += "<td colspan='5'>" + val.category + "</td>";
                        tbody += "</tr>";
                        temp = val.category;
                    }
                    tbody += "<tr>";
                    tbody += "<td>" +
                        '<category type="button" data-shelfno="' + val.ShelfNo+'" data-moq="' + val.MOQ + '" data-rol="' + val.rol + '" data-hsn="' + val.hsn + '" data-item_type="' + val.item_type + '"' +
                        ' data-item_id="' + val.item_id + '" data-item_name="' + val.item_name + '" data-categoryid="' + val.CategoryId + '" data-maincategory="' + val.MainCategory + '" data-remark="' + val.remark + '"' +
                        ' class= "btn btn-warning btn-xs getItem"> <i class="fa fa-edit"></i></category> ' +
                        "</td>";
                    tbody += "<td>" + val.item_id + "</td>";
                    tbody += "<td>" + val.item_name + "</td>";
                    tbody += '<td class="text-center">' +
                        '<label class="switch">' +
                        '<input type="checkbox" data-itemid=' + val.item_id + ' data-statusflag=' + val.status_flag + ' class="statusflag" id="chkActive" ' + val.checked + '>' +
                        '<span class="slider round"></span></label>' +
                        '</td>';
                    tbody += "</tr>";
                    //$('<tr><td>' + val.item_id + '</td><td>' + val.item_name + '</td><td>' + val.category + '</td><td>' + val.item_type + '</td><td style="color:' + val.status_color + '">' + val.status_flag + '</td>' +
                    //    '<td>' +
                    //    '<div class="input-group-btn">' +
                    //    '<category type="button" data-rol="' + val.rol + '" data-hsn="' + val.hsn + '" data-item_type="' + val.item_type + '"' +
                    //    ' data-item_id="' + val.item_id + '" data-item_name="' + val.item_name + '" data-category="' + val.category + '" data-remark="' + val.remark + '"' +
                    //    ' class= "btn btn-primary getItem"> <i class="fa fa-edit"></i></category> ' +
                    //    '<category type="button" data-itemid=' + val.item_id + ' data-statusflag=' + val.status_flag + ' class="btn btn-warning statusflag"><i class="fa fa-refresh"></i></category>' +
                    //    '<span class="fa fa-arrow-right"></span></div></td></tr>').appendTo($('#tblItem tbody'));
                });
                $('#tblItem tbody').append(tbody);
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
function InsertItemMaster(logic) {
    if (Validate()) {
        var url = config.baseUrl + "/api/Warehouse/InsertUpdateItemMaster";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.ItemId = $('#txtExternalItemId').text();
        objBO.hsn = $('#txtHSN').val();
        objBO.MfdId = $('#ddlManufacture option:selected').data('mfdid');
        objBO.purchase_flag = $('#ddlPurchaseFlag option:selected').val();
        objBO.ItemType = '-';
        objBO.ItemName = $('#txtItemName').val().toUpperCase();
        objBO.CategoryId = $('#ddlCategory option:selected').data('category');
        objBO.rol = $('#txtROL').val();
        objBO.MOQ = $('#txtMOQ').val();
        objBO.Remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.ShelfNo = $('#txtShelfNo').val();
        objBO.Logic = logic;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    Clear();
                    alert(data);
                    //GetItemMasterList();
                    $('#ddlCategory').prop('selectedIndex', '0').change();
                    $('input[type=text]').val('');
                    $('#txtRemark').val('');
                    $('#txtExternalItemId').text('');                   
                    $("#ddlShelfNo").append($("<option></option>").val(objBO.ShelfNo).html(objBO.ShelfNo));
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
function UpdateItemMaster() {
    if (Validate()) {
        var url = config.baseUrl + "/api/Warehouse/InsertUpdateItemMaster";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.hsn = $('#txtHSN').val();
        objBO.MfdId = $('#ddlManufacture option:selected').data('mfdid');
        objBO.MfdName = $('#ddlManufacture option:selected').text();
        objBO.purchase_flag = $('#ddlPurchaseFlag option:selected').val();
        objBO.ItemType = '-';
        objBO.ItemId = $('span[data-item_id]').text();
        objBO.ItemName = $('#txtItemName').val().toUpperCase();
        objBO.CategoryId = $('#ddlCategory option:selected').data('category');
        objBO.rol = $('#txtROL').val();
        objBO.MOQ = $('#txtMOQ').val();
        objBO.Remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.ShelfNo = $('#txtShelfNo').val();
        objBO.Logic = 'Update';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    Clear();
                    alert(data);
                    //GetItemMasterList();
                    $('#ddlCategory').prop('selectedIndex', '0').change();
                    $('input[type=text]').val('');
                    $('#txtRemark').val('');                   
                    $("#ddlShelfNo").append($("<option></option>").val(objBO.ShelfNo).html(objBO.ShelfNo));
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
function UpdateStatus(itemid, statusflag) {
    var url = config.baseUrl + "/api/Warehouse/InsertUpdateItemMaster";
    var objBO = {};
    objBO.ItemId = itemid;
    objBO.StatusFlag = statusflag;
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data == 'Successfully Saved') {
                GetItemMasterList('Y');
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
    var name = $('#txtItemName').val();
    var hsn = $('#txtHSN').val();
    var rol = $('#txtROL').val();
    var category = $('#ddlCategory option:selected').text();

    if (category == 'Select Category') {
        $('span.selection').find('span[aria-labelledby=select2-ddlCategory-container]').css('border-color', 'red').focus();
        alert('Please Select Category..');
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlCategory-container]').removeAttr('style');
    }
    if (name == '') {
        $('#txtItemName').css({ 'border-color': 'red' }).focus();
        alert('Please Provide Item Name..');
        return false;
    }
    else {
        $('#txtItemName').removeAttr('style');
    }
    if (hsn == '') {
        $('#txtHSN').css({ 'border-color': 'red' }).focus();
        alert('Please Provide HSN..');
        return false;
    }
    else {
        $('#txtHSN').removeAttr('style');
    }
    //if (rol == '') {
    //	$('#txtROL').css({ 'border-color': 'red' }).focus();
    //	alert('Please Provide ROL..');
    //	return false;
    //}
    //else {
    //	$('#txtROL').removeAttr('style');
    //}
    return true;
}

function Clear() {
    $('#ddlCategory').prop('selectedIndex', '0').change();
    $('input[type=text]').val('');
    $('#txtRemark').val('');
    $('#txtExternalItemId').text('');
    $('#btnSaveItem').val('Submit').removeClass('btn-warning').addClass('btn-success');
}