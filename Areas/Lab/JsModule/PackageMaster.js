$(document).ready(function () {
    CloseSidebar();
    Onload();
    LoadPackage();
    $("#txtSearchPackage").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblPackageDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#txtSearchInvestigation").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblInvestigationDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#txtSearchLinkPackInvest").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblSavedPackageDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function Onload() {
    var url = config.baseUrl + "/api/Lab/mPackageQueries";
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
                    $("#ddlCategory").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.CatID).html(value.CatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select"));
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
    var url = config.baseUrl + "/api/Lab/mPackageQueries";
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
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select"));
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

function InsertUpdateLabPackage() {
    
    if (validation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/Lab/mPackageInsertUpdate";
        var btntext = $("#btnLabPackage").val();
        if (btntext.trim() == "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext.trim() == "Update") {
            objBO.packageId = $("#hidPackageCode").val();
            objBO.Logic = "Update";
        }
        objBO.catid = $("#ddlCategory option:selected").val();
        objBO.subcateid = $("#ddlSubCategory option:selected").val();
        objBO.packagename = $("#txtPackageName").val();
        objBO.packagetype = $("#ddlPackageType option:selected").val();
        objBO.bookFor = $("#ddlBookFor option:selected").val();
        objBO.description = $("#txtDescription").val();
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        //objBO.warehouseCartId = Active.warehouseId
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Package saved successfully');
                    $("#ddlSearchPackage").prop('selectedIndex', 0);
                    LoadPackage();
                    ClearValues();
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

function LoadPackage() {
    $("#tblPackageDetails tbody").empty();
    var htmldata = "";
    var url = config.baseUrl + "/api/Lab/mPackageQueries";
    var objBO = {};
    var packval = $("#ddlSearchPackage option:selected").val();
    if (packval != "0") {
        objBO.prm_1 = $("#ddlSearchPackage option:selected").val();
    }
    objBO.Logic = "LoadPackage";
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
                        htmldata += '<tr id=' + key + '>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnEditPackage' + key + '" data-itemid="' + val.ItemId + '"  onclick="EditPackage(this.id)"><i class="fa fa-edit fa-lg  text-blue"></i></a></td>';
                        htmldata += '<td>' + val.ItemId + '</td>';
                        htmldata += '<td>' + val.ItemName + '</td>';
                        htmldata += '<td style="display:none">' + val.SourceItemId + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnSelect' + key + '" data-itemid="' + val.ItemId + '"  onclick=selectRow(this);SelectPackage(this.id,"")><i class="fa fa-check fa-lg text-red" ></i></a></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblPackageDetails").append(htmldata);
                }
                else {
                    htmldata += '<tr>';
                    htmldata += '<td colspan="3" class="text-center text-red">No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblPackageDetails").append(htmldata);
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

function EditPackage(buttonid) {
    var url = config.baseUrl + "/api/Lab/mPackageQueries";
    var objBO = {};
    var itemid = $("#" + buttonid).closest("tr").find("td:eq(1)").text();
    objBO.Logic = "EditPackage";
    objBO.itemid = itemid;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCategory").val(data.ResultSet.Table[0].CatId);
                    $('#ddlCategory').trigger('change');
                    $("#ddlSubCategory").val(data.ResultSet.Table[0].SubCatId).prop('selected', true);
                    $("#txtPackageName").val(data.ResultSet.Table[0].PackageName);
                    $("#ddlPackageType").val(data.ResultSet.Table[0].PackageType);
                    $("#ddlBookFor").val(data.ResultSet.Table[0].bookFor);
                    $("#txtDescription").val(data.ResultSet.Table[0].Description);
                    $("#hidPackageCode").val(data.ResultSet.Table[0].PackageId)
                    $("#btnLabPackage").val('Update');
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

function SelectPackage(buttonid, packageid) {
    var objBO = {};
    var htmldata = "";
    var groupname = "";
    var url = config.baseUrl + "/api/Lab/mPackageQueries";
    $("#tblSavedPackageDetails tbody").empty();
    if (buttonid != "" && buttonid != null && typeof buttonid != 'undefined') {
        var packageid = $('#tblPackageDetails tbody').find('tr.select-row').find('td:eq(1)').text();
        var itemid = $("#" + buttonid).data('itemid');
        var innerpackageid = $("#" + buttonid).data('innerpackageid');
        objBO.itemid = itemid;
        objBO.innerpackageid = innerpackageid;
        objBO.packageId = packageid;
    }
    if (packageid != "" && packageid != null && typeof packageid != 'undefined') {
        objBO.packageId = packageid;
    }
    objBO.Logic = "SavedPackageDetails";
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
                        if (groupname != val.GroupName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + val.GroupName + '</td>';
                            htmldata += '</tr>';
                            groupname = val.GroupName;
                        }                        
                        htmldata += '<tr id=' + key + '>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnDelete' + key + '" data-packageid="' + val.PackageId + '" data-testcode="' + val.testcode + '"  data-itemid="' + val.ItemId + '"  onclick="DeleteLinkPackageInvestigation(this.id)" ><i class="fa fa-trash fa-lg text-red" ></i></a></td>';
                        htmldata += '<td>' + val.ItemId + '</td>';
                        htmldata += '<td>' + val.ItemName + '</td>';   
                        htmldata += '<td>' + val.ItemType + '</td>';
                        
                    });
                    $("#tblSavedPackageDetails").append(htmldata);
                }
                else {
                    htmldata += '<tr>';
                    htmldata += '<td colspan="10" class="text-center text-red">No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblSavedPackageDetails").append(htmldata);
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

function SearchInvestigation() {
    $("#tblInvestigationDetails tbody").empty();
    var htmldata = "";
    var investigationtype = "";
    var url = config.baseUrl + "/api/Lab/mPackageQueries";
    var objBO = {};
    var Investigationval = $("#ddlSearchInvestigation option:selected").val();
    if (Investigationval != "0") {
        objBO.prm_1 = $("#ddlSearchInvestigation option:selected").val();
    }
    else {
        alert('Please select investigation type');
        $("#ddlSearchInvestigation").css('border', '1px solid red');
        return false;
    }
    objBO.Logic = "SearchInvestigation";
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
                        htmldata += '<tr id=' + key + '>';
                        htmldata += '<td>' + val.ItemId + '</td>';
                        htmldata += '<td>' + val.ItemName + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnLinkPackInvest' + key + '" data-sourceitemid="' + val.SourceItemId + '" data-itemid="' + val.ItemId + '"  data-searchtype="' + val.searchType + '" onclick="selectRow(this);LinkPackageInvestigation(this.id)"><i class="fa fa-plus fa-lg text-green"></i></a></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblInvestigationDetails").append(htmldata);
                }
                else {
                    htmldata += '<tr>';
                    htmldata += '<td colspan="3" class="text-center text-red">No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblInvestigationDetails").append(htmldata);
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

function LinkPackageInvestigation(buttonid) {
    
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mPackageLinkItems";
    var searchtype = $("#" + buttonid).data('searchtype');
    var packageId = $('#tblPackageDetails tbody').find('tr.select-row').find('td:eq(1)').text();
    //var innerpackageid = $('#tblPackageDetails tbody').find('tr.select-row').find('td:eq(3)').text();
    var innerpackageid = $("#" + buttonid).data('sourceitemid');    
    var itemId = $('#tblInvestigationDetails tbody').find('tr.select-row').find('td:eq(0)').text();

    if (searchtype != "" && searchtype != null && typeof searchtype != 'undefined') {
        objBO.type = searchtype;
    }
    else {
        alert('Type can not be empty');
        return false;
    }   
    if (innerpackageid != "" && innerpackageid != null && typeof innerpackageid != 'undefined') {
        objBO.innerpackageid = innerpackageid;
    }
    if (packageId != "" && packageId != null && typeof packageId != 'undefined') {
        objBO.packageId = packageId;
    }
    else {
        alert('Please select Package');
        return false;
    }
    if (itemId != "" && itemId != null && typeof itemId != 'undefined') {
        objBO.itemId = itemId;
    }
    else {
        alert('itemId can not be empty');
        return false;
    }
    
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                //alert('Records saved successfully');
                SelectPackage("", packageId);
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

function DeleteLinkPackageInvestigation(buttonid) {
    
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/DeletePackageLinkItems";
    var packageid = $("#" + buttonid).data('packageid');
    var itemid = $("#" + buttonid).data('itemid');
    var testcode = $("#" + buttonid).data('testcode');

    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.packageid = packageid;
    objBO.itemid = itemid;
    objBO.code = testcode;
    objBO.Logic = "Delete";

    if (confirm("Are you sure want to delete?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Records deleted successfully');
                    SelectPackage("", packageid)
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

function validation() {
    var catid = $("#ddlCategory option:selected").val();
    var subcatid = $("#ddlSubCategory option:selected").val();
    var packagename = $("#txtPackageName").val();
    var packagetype = $("#ddlPackageType option:selected").val();
    var bookfor = $("#ddlBookFor option:selected").val();
    if (catid == "0") {
        alert('Please select category');
        $("#ddlCategory").css('border', '1px solid red');
        return false;
    }
    if (subcatid == "0") {
        alert('Please select sub category');
        $("#ddlSubCategory").css('border', '1px solid red');
        return false;
    }
    if (packagename == "") {
        alert('Please enter package name');
        $("#txtPackageName").css('border', '1px solid red');
        return false;
    }
    if (packagetype == "0") {
        alert('Please select package type');
        $("#ddlPackageType").css('border', '1px solid red');
        return false;
    }
    if (bookfor == "0") {
        alert('Please select book for');
        $("#ddlBookFor").css('border', '1px solid red');
        return false;
    }
    return true;
}

function ClearValues() {
    $("#hidPackageCode").val(0);
    $("#ddlCategory").prop("selectedIndex", 0);
    $("#ddlSubCategory").prop("selectedIndex", 0);
    $("#txtPackageName").val('');
    $("#ddlPackageType").prop("selectedIndex", 0);
    $("#ddlBookFor").prop("selectedIndex", 0);
    $("#txtDescription").val('');
    $("#btnLabPackage").val('');
    $("#btnLabPackage").val('Save');
}





