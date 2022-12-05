$(document).ready(function () {
    CloseSidebar();
    BindCategory();
    BindSubCategory();
    $('#txtSeachCategory').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblCategoryDetails tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });

    $('#txtSeachSubcategory').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblSubcategoryDetails tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });

    
});

function AddUpdateCategory() {
    if (validateCategory()) {
        var objBO = {};
        var url = config.baseUrl + "/api/master/mCategorySubCategoryInsertUpdate";
        var btnname = $("#btndaddupdatecategory").val();        
        if (btnname == "Save") {
            objBO.Logic = "InsertCategory";
            objBO.autoid = 0;            
        }
        else {            
            objBO.Logic = "UpdateCategory";
            objBO.autoid = $("#hidcatautoid").val();
        }
        objBO.catname = $("#txtCategoryName").val();
        objBO.catdesc = $("#txtCategoryDescription").val() == "" ? null : $("#txtCategoryDescription").val();
        objBO.catabbr = $("#txtCategoryAbbreviation").val() == "" ? null : $("#txtCategoryAbbreviation").val();
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Category created successfully');
                    $("#txtCategoryName").val('');
                    $("#txtCategoryDescription").val('');
                    $("#txtCategoryAbbreviation").val('');
                    $("#btndaddupdatecategory").val('Save');
                    $("#btndaddupdatecategory").text('Save');
                    BindCategory();
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
function BindCategory() {
    var url = config.baseUrl + "/api/master/mCategorySubCategoryQueries";
    var objBO = {};
    objBO.Logic = "GetCategory";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $("#tblCategoryDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + v.CatName + '</td>';
                        htmldata += '<td>' + v.descriptions + '</td>';
                        htmldata += '<td>' + v.abbreviation + '</td>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnCategory' + k + '" data-catid="' + v.CatID + '" data-autoid="' + v.auto_id + '"  onclick = "selectRow(this);BindSubCategory()"><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblCategoryDetails tbody").append(htmldata);
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


function AddUpdateSubCategory() {
    if (validateSubCategory()) {
        var objBO = {};
        var url = config.baseUrl + "/api/master/mCategorySubCategoryInsertUpdate";
        var btnname = $("#btndaddupdatesubcategory").val();
        if (btnname == "Save") {
            objBO.Logic = "InsertSubCategory";
            objBO.autoid = 0;
            var catid = $("#tblCategoryDetails tbody").find('tr.select-row').find('td:eq(3)').find('a').data('catid');
            objBO.catid = catid;
        }
        else {
            objBO.Logic = "UpdateSubCategory";
            objBO.autoid = $("#hidsubcatautoid").val();
        }
        objBO.subcatname = $("#txtSubcategoryName").val();
        objBO.subcatdesc = $("#txtSubcategoryDescription").val();
        objBO.subcatabbr = $("#txtSubcategoryAbbreviation").val();        
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Sub category created successfully');           
                    BindSubCategory();
                    $("#txtSubcategoryName").val('');
                    $("#txtSubcategoryDescription").val('');
                    $("#txtSubcategoryAbbreviation").val(''); 
                    $("#hidsubcatautoid").val('');
                    $("#hidcatid").val('');
                    $("#btndaddupdatesubcategory").val('Save');
                    $("#btndaddupdatesubcategory").text('Save');
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
function BindSubCategory() {
    var url = config.baseUrl + "/api/master/mCategorySubCategoryQueries";
    var objBO = {};
    var catid = $("#tblCategoryDetails tbody").find('tr.select-row').find('td:eq(3)').find('a').data('catid');
    var autoid = $("#tblCategoryDetails tbody").find('tr.select-row').find('td:eq(3)').find('a').data('autoid');
    objBO.Logic = "GetSubCategory";
    objBO.catid = catid;
    objBO.autoid = autoid; 
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            var categoryname = "";
            $("#tblSubcategoryDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {                        
                        if (categoryname != v.CatName) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + v.CatName + '</td>';
                            htmldata += '</tr>';
                            categoryname = v.CatName;
                        }
                        htmldata += '<td>' + v.SubCatName + '</td>';
                        htmldata += '<td>' + v.descriptions + '</td>';
                        htmldata += '<td>' + v.abbreviation + '</td>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnCategory' + k + '" data-subcatid="' + v.SubCatID + '" data-autoid="' + v.auto_id + '"  onclick = "selectRow(this);EditSubCategory()"><i class="fa fa-edit fa-lg text-green"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblSubcategoryDetails tbody").append(htmldata);
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#txtCategoryName").val(data.ResultSet.Table1[0].CatName);
                    $("#txtCategoryDescription").val(data.ResultSet.Table1[0].descriptions);
                    $("#txtCategoryAbbreviation").val(data.ResultSet.Table1[0].abbreviation);
                    $("#hidcatautoid").val(data.ResultSet.Table1[0].auto_id);
                    $("#btndaddupdatecategory").val('Update');
                    $("#btndaddupdatecategory").text('Update');
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

function EditSubCategory() {
    var url = config.baseUrl + "/api/master/mCategorySubCategoryQueries";
    var objBO = {};
    var subcatid = $("#tblSubcategoryDetails tbody").find('tr.select-row').find('td:eq(3)').find('a').data('subcatid');
    var autoid = $("#tblSubcategoryDetails tbody").find('tr.select-row').find('td:eq(3)').find('a').data('autoid');
    objBO.Logic = "EditSubCategory";
    objBO.subcatid = subcatid;
    objBO.autoid = autoid; 
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
                                   
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#txtSubcategoryName").val(data.ResultSet.Table[0].SubCatName);
                    $("#txtSubcategoryDescription").val(data.ResultSet.Table[0].descriptions);
                    $("#txtSubcategoryAbbreviation").val(data.ResultSet.Table[0].abbreviation);
                    $("#hidsubcatautoid").val(data.ResultSet.Table[0].auto_id);
                    $("#hidcatid").val(data.ResultSet.Table[0].CatID);                    
                    $("#btndaddupdatesubcategory").val('Update');
                    $("#btndaddupdatesubcategory").text('Update');
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

function validateCategory() {
    var category = $("#txtCategoryName").val();
    if (category == "") {
        alert('Please enter category name')
        return false;
    }
    return true;
}

function validateSubCategory() {
    var subcategory = $("#txtSubcategoryName").val();
    var catid = "";
    if (subcategory == "") {
        alert('Please enter subcategory name')
        return false;
    }
    if ($("#hidcatid").val() == "") {
        catid = $("#tblCategoryDetails tbody").find('tr.select-row').find('td:eq(3)').find('a').data('catid');
    }
    else {
        catid = $("#hidcatid").val();
    }    
    if (catid == "" || catid == null || typeof catid == 'undefined') {
        alert('Please select category from left side ')
        return false;
    }
    return true;
}