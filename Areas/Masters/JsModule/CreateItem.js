$(document).ready(function () {
    CloseSidebar();
    Onload();
    $('#txtSeachItems').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblItemDetails tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });   
});
function Onload() {
    var url = config.baseUrl + "/api/master/mLabItemQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCategory").append($("<option></option>").val("All").html("All"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.CatID).html(value.CatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlSubCategory").append($("<option></option>").val("All").html("All"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BindSubCategoryByCategory() {
    
    var catId = $("#ddlCategory").val();
    var url = config.baseUrl + "/api/master/mLabItemQueries";
    var objBO = {};
    objBO.Logic = "BindSubCategoryByCategory";
    objBO.catid = catId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlSubCategory").empty();
                    $("#ddlSubCategory").append($("<option></option>").val("All").html("All"));
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        $.each(data.ResultSet.Table, function (key, value) {
                            $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                        });
                    }
                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddUpdateCreateItem() {
    if (validateItems()) {
        var objBO = {};
        var url = config.baseUrl + "/api/master/mLabItemInsertUpdate";
        var btnname = $("#btndaddupdate").val();
        if (btnname == "Save") {
            objBO.Logic = "Insert";
            objBO.autoid = 0;
        }
        else {
            objBO.Logic = "Update";
            objBO.autoid = $("#hidautoid").val();
        }
        //objBO.catid = $("#ddlCategory option:selected").val();
        objBO.subcatid = $("#ddlSubCategory option:selected").val();
        objBO.itemname = $("#txtItemName").val();
        objBO.cptcodes = $("#txtCptCods").val() == "" ? null : $("#txtCptCods").val();
        objBO.isdiscountable = $("#ddlDiscountable option:selected").val();
        objBO.isshareble = $("#ddlSharable option:selected").val();
        objBO.itemtype = "-";
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",          
            success: function (data) {
                var autoid = 0;
                var splitval = data.split('|');
                if (splitval[0] == '1' && splitval[1] == 'success') {
                    autoid = splitval[2];
                    BindItems(autoid);
                    alert('Item created successfully');
                }
                else if (splitval[0] == '2' && splitval[1] == 'success') {
                    autoid = splitval[2];
                    BindItems(autoid);
                    alert('Item Updated successfully');
                   
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
function BindItems(id) {
    var url = config.baseUrl + "/api/master/mLabItemQueries";
    var objBO = {};
    if (id > 0) {
        objBO.autoid = parseInt(id);
    }
    else {
        objBO.autoid = parseInt(0);
    }
    objBO.Logic = "GetItems";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var categoryname = "";
            $("#tblItemDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        
                        if (categoryname != v.CatName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + v.CatName + '</td>';
                            htmldata += '</tr>';
                            categoryname = v.CatName;
                        }
                        htmldata += '<tr>';
                        if (v.ItemId == v.SourceItemId) {
                            htmldata += '<td><a href = "javascript:void(0)" id = "btnEdit' + k + '" data-autoid="' + v.auto_id + '"  onclick = "selectRow(this);EditItem(this)"><i class="fa fa-edit fa-lg text-red"></i></a ></td>';
                        }
                        else {
                            htmldata += '<td>&nbsp;</td>';
                        }
                        htmldata += '<td>' + v.ItemId + '</td>';
                        htmldata += '<td>' + v.SubCatName + '</td>';
                        htmldata += '<td>' + v.ItemName + '</td>';
                        if (v.IsDiscountable == 'Y') {
                            htmldata += '<td>Yes</td>';
                        }
                        else {
                            htmldata += '<td>No</td>';
                        }
                        if (v.IsShareable == true) {
                            htmldata += '<td>Yes</td>';
                        }
                        else {
                            htmldata += '<td>No</td>';
                        }
                        htmldata += '</tr>';
                    });
                    $("#tblItemDetails tbody").append(htmldata);
                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function EditItem(element) {
    var autoid = $(element).closest('tr.select-row').find('td:eq(0)').find('a').data('autoid');
    var url = config.baseUrl + "/api/master/mLabItemQueries";
    var objBO = {};
    objBO.Logic = "EditItem";
    objBO.autoid = autoid;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {                         
                    $("#txtItemName").val(data.ResultSet.Table[0].ItemName);
                    $("#txtCptCods").val(data.ResultSet.Table[0].CPT_Code);
                    $("#hidautoid").val(data.ResultSet.Table[0].auto_id);
                    $("#ddlDiscountable").val(data.ResultSet.Table[0].IsDiscountable);
                    if (data.ResultSet.Table[0].IsShareable == true) {
                        $("#ddlSharable").val(1);
                    }
                    else {
                        $("#ddlSharable").val(0);
                    }                    
                    $("#btndaddupdate").text('Update');
                    $("#btndaddupdate").val('Update');                    
                    $("#ddlCategory").val(data.ResultSet.Table[0].CatID);
                    $('#ddlCategory').trigger('change');
                    $("#ddlSubCategory").val(data.ResultSet.Table[0].subCatId).prop('selected', true);                    
                }
                else {
                    MsgBox('No Data Found');
                }
            }
            else {
                MsgBox('No Data Found');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SearchItems() {
    var url = config.baseUrl + "/api/master/mLabItemQueries";
    var objBO = {};
    objBO.catid = $("#ddlCategory option:selected").val();
    objBO.subcatid = $("#ddlSubCategory option:selected").val();
    objBO.Logic = "SearchItems";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var categoryname = "";
            $("#tblItemDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        
                        if (categoryname != v.CatName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + v.CatName + '</td>';
                            htmldata += '</tr>';
                            categoryname = v.CatName;
                        }
                        htmldata += '<tr>';
                        if (v.ItemId == v.SourceItemId) {
                            htmldata += '<td><a href = "javascript:void(0)" id = "btnEdit' + k + '" data-autoid="' + v.auto_id + '"  onclick = "selectRow(this);EditItem(this)"><i class="fa fa-edit fa-lg text-red"></i></a ></td>';
                        }
                        else {
                            htmldata += '<td>&nbsp;</td>';
                        }
                        htmldata += '<td>' + v.ItemId + '</td>';
                        htmldata += '<td>' + v.SubCatName + '</td>';
                        htmldata += '<td>' + v.ItemName + '</td>';
                        if (v.IsDiscountable == 'Y') {
                            htmldata += '<td>Yes</td>';
                        }
                        else {
                            htmldata += '<td>No</td>';
                        }
                        if (v.IsShareable == true) {
                            htmldata += '<td>Yes</td>';
                        }
                        else {
                            htmldata += '<td>No</td>';
                        }
                        htmldata += '</tr>';
                    });
                    $("#tblItemDetails tbody").append(htmldata);
                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadExcel() {
    
    var url = config.baseUrl + "/api/master/mExportExcel";
    var objBO = {};
    objBO.catid = $('#ddlCategory option:selected').val();
    objBO.subcatid = $('#ddlSubCategory option:selected').val();
    objBO.Logic = "SearchItems";
    Global_DownloadExcel(url, objBO, "ItemList.xlsx");
}
function validateItems() {
    var category = $("#ddlCategory option:selected").val();
    var subcategory = $("#ddlSubCategory option:selected").val();   
    var itemname = $("#txtItemName").val();
   

    if (category == "All") {
        alert('Please select category instead of "All" ');
        return false;
    }
    if (subcategory == "All") {
        alert('Please select subcategory instead of "All" ');
        return false;
    }
    if (itemname == "") {
        alert('Please enter ItemName');
        return false;
    }   
    return true;
}
function ClearValues() {
    $("#txtItemName").val('');
    $("#txtCptCods").val('');
    $("#ddlSubCategory").prop("selectedIndex", '0').val();
    $("#ddlCategory").prop("selectedIndex", '0').val();
    $("#ddlDiscountable").prop("selectedIndex", '0').val();
    $("#ddlSharable").prop("selectedIndex", '1').val();
}