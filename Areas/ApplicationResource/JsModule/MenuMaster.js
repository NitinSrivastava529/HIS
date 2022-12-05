
$(window).on('load', function () {
    GetRole();
    GetMainMenu();
    GetRoleMaster();
});
$(document).ready(function () {

    //<<<-------------Role Events------------->>>
    //GetRole();
    $('#btnSaveRole').on('click', function () {
        SaveRole();
    });
    $('#btnUpdateRole').on('click', function () {
        var RoleId = $(this).data("roleid");
        UpdateRole(RoleId);
    });
    $("#tblRole tbody").on('click', '.edit', function () {
        var RoleId = $(this).data("roleid");
        GetRoleByRoleId(RoleId);
    });
    $("#tblRole tbody").on('click', '.disable', function () {
        var RoleId = $(this).data("roleid");
        var flag = $(this).data("flag");
        UpdateRoleFlag(RoleId, flag);
        //alert(flag);
    });
    $('#txtSearchRole').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblRole tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });

    //<<<-------------Main Menu Events------------->>>
    //GetMainMenu();
    $('#btnSaveMainMenu').on('click', function () {
        InsertMainMenu();
    });
    $("#tblMainMenu tbody").on('click', '.edit', function () {
        var MenuId = $(this).data("menuid");
        GetMenuByMenuId(MenuId);
    });
    $("#tblMainMenu tbody").on('click', '.disable', function () {
        var MenuId = $(this).data("menuid");
        var flag = $(this).data("flag");
        UpdateMainMenuFlag(MenuId, flag);
        //alert(flag);
    });
    $('#btnUpdateMenu').on('click', function () {
        var Menuid = $(this).data("menuid");
        UpdateMainMenu(Menuid);
    });
    $('#txtSearchMenu').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblMainMenu tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('.ddlRole').on('change', function () {
        var roleid = $(this).find('option:selected').val();
        $('.ddlMenu').prop('selectedIndex', '0');
        $('.ddlMenu option').each(function () {
            if ($(this).data('roleid') == roleid) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
    });

    //<<<-------------Sub Menu Events------------->>>  
    $('#btnSaveSubMenu').on('click', function () {
        InsertSubMenu();
    });
    $("#tblSubMenu tbody").unbind().on('click', '.edit', function () {
        var SubMenuId = $(this).data("submenuid");
        GetSubMenuBySubMenuId(SubMenuId);
    });
    $("#tblSubMenu tbody").on('click', '.disable', function () {
        var SubMenuId = $(this).data("submenuid");
        var flag = $(this).data("flag");
        UpdateFlag(SubMenuId, flag);
    });
    $('#btnUpdateSubMenu').on('click', function () {
        var SubMenuid = $(this).data("submenuid");
        UpdateSubMenu(SubMenuid);
    });
    $('#txtSearchSubMenu').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblSubMenu tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });

    //<<<-------------Employee Events------------->>>
    //GetEmployee();
    $('#btnSaveEmployee').on('click', function () {
        InsertEmployee();
    });
    $('#txtEmployeeCode').on('keyup', function () {
        var EmpCode = $(this).val();
        GetByEmpCode(EmpCode);
    });

    //<<<-------------State Events------------->>>
    //GetState();
    $("#tblState tbody").on('click', '.edit', function () {
        var StateCode = $(this).data("statecode");
        GetByStateCode(StateCode);
    });
    $("#tblState tbody").on('click', '.disable', function () {
        var StateCode = $(this).data("statecode");
        var IsActive = $(this).data("flag");
        UpdateStateFlag(StateCode, IsActive);
    });
    $('#btnSaveState').on('click', function () {
        InsertState();
    });
    $('#btnUpdateState').on('click', function () {
        var StateCode = $(this).data('statecode');
        UpdateState(StateCode);
    });
    $('#txtSearchState').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblState tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });

    //<<<-------------City Events------------->>>
    //GetCity();
    $("#tblCity tbody").on('click', '.edit', function () {
        var CityCode = $(this).data("citycode");
        GetByCityCode(CityCode);
    });
    $("#tblCity tbody").on('click', '.disable', function () {
        var CityCode = $(this).data("citycode");
        var IsActive = $(this).data("flag");
        UpdateCityFlag(CityCode, IsActive);
    });
    $('#btnSaveCity').on('click', function () {
        InsertCity();
    });
    $('#btnUpdateCity').on('click', function () {
        var CityCode = $(this).data('citycode');
        UpdateCity(CityCode);
    });
    $('#txtSearchCity').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblCity tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#ddlLocState').on('change', function () {
        var StateCode = $(this).val();
        GetLocCityByStateCode(StateCode);
    });
    $('#ddlPerState').on('change', function () {
        var StateCode = $(this).val();
        GetPerCityByStateCode(StateCode);
    });

});
//<<<-------------Role Master Section------------->>>
function GetRole() {

    var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
    var objBO = {};
    objBO.Logic = "GetRole";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#tblRole tbody").empty();
            $("#ddlRole").empty().append($('<option>Select Role</option>'));
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("<tr><td>" + val.role_id + "</td><td>" + val.role_name + "</td><td>" + val.flag + "</td> <td>" + val.cr_date + "</td> <td>" +
                        " <div class='input-group-btn'>" +
                        "<span class='btn btn-danger disable' data-roleid=" + val.role_id + "  data-flag=" + val.flag + "><i class='fa fa-check'></i></span>" +
                        "<span class='btn btn-primary edit' data-roleid=" + val.role_id + "><i class='fa fa-edit'></i></span>" +
                        "</div></td></tr>").appendTo($("#tblRole tbody"));
                    $("#ddlRole").append($("<option></option>").val(val.role_id).html(val.role_name)).select2();
                    GetMainMenu();
                    GetSubMenu();
                });
            }
            else {
                alert("Error");
            };
        },
        complete: function (re) {

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRoleByRoleId(RoleId) {

    var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
    var objBO = {};
    objBO.RoleId = RoleId;
    objBO.Logic = "GetRoleByRoleId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#txtRole").val('');
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#btnSaveRole").hide();
                    $("#btnUpdateRole").show();
                    $("#btnUpdateRole").data('roleid', val.role_id);
                    $("#txtRoleName").val(val.role_name);
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SaveRole() {
    if (ValidationRole()) {

        var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
        var objBO = {};
        objBO.RoleName = $('#txtRoleName').val();
        objBO.Logic = "InsertRole";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data != '') {
                    $("#txtRoleName").val('');
                    GetRole();
                    GetRoleMaster();
                    GetMainMenu();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateRole(RoleId) {
    if (ValidationRole()) {

        var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
        var objBO = {};
        objBO.RoleId = RoleId;
        objBO.RoleName = $('#txtRoleName').val();
        objBO.Logic = "UpdateRole";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data != '') {
                    GetRole();
                    GetRoleMaster();
                    $('#txtRoleName').val('');
                    $("#btnSaveRole").show();
                    $("#btnUpdateRole").hide();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateRoleFlag(RoleId, flag) {

    var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
    var objBO = {};
    objBO.RoleId = RoleId;
    objBO.Logic = "UpdateRoleFlag";
    if (flag == 'Enabled')
        objBO.Flag = 0;
    else
        objBO.Flag = 1;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                GetRole();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

//<<<-------------Main Menu Master Section------------->>>
function GetMainMenu() {

    var url = config.baseUrl + "/api/ApplicationResource/MenuQueries";
    var objBO = {};
    objBO.Logic = "GetMainMenuForMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            $("#tblMainMenu tbody").empty();
            $("#ddlMenu").empty().append($('<option>Select Menu</option>'));
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("<tr><td>" + val.menu_id + "</td><td>" + val.role_name + "</td><td>" + val.menu_name + "</td> <td>" + val.flag + "</td> <td>" +
                        " <div class='input-group-btn'>" +
                        "<span class='btn btn-danger disable' data-flag=" + val.flag + " data-menuid=" + val.menu_id + "><i class='fa fa-check'></i></span>" +
                        "<span class='btn btn-primary edit' data-menuid=" + val.menu_id + "><i class='fa fa-edit'></i></span>" +
                        "</div></td></tr>").appendTo($("#tblMainMenu tbody"));
                    $("#ddlMenu").append($("<option data-roleid=" + val.role_id + "></option>").val(val.menu_id).html(val.menu_name));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetMenuByMenuId(MenuId) {

    var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
    var objBO = {};
    objBO.Logic = "GetMainMenuByMenuId";
    objBO.MenuId = MenuId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#txtMenuName").val('');

            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#btnSaveMainMenu").hide();
                    $("#btnUpdateMenu").show();
                    $("#btnUpdateMenu").data('menuid', val.menu_id);
                    $("#txtMenuName").val(val.menu_name);
                    $("#ddlRole").val(val.role_id).change();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertMainMenu() {
    if (ValidationMenu()) {

        var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
        var objBO = {};
        objBO.RoleId = $('#ddlRole').val();
        objBO.MenuName = $('#txtMenuName').val();
        objBO.Logic = "InsertMainMenu";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data != '') {
                    $("#ddlRole")[0].selectedIndex = 0;
                    $("#txtMenuName").val('');
                    GetRole();
                    GetMainMenu();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateMainMenu(MenuId) {
    if (ValidationMenu()) {

        var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
        var objBO = {};
        objBO.MenuId = MenuId;
        objBO.RoleId = $('#ddlRole').val();
        objBO.MenuName = $('#txtMenuName').val();
        objBO.Logic = "UpdateMainMenu";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data != '') {
                    $("#ddlRole")[0].selectedIndex = 0;
                    $("#txtMenuName").val('');
                    GetRole();
                    GetMainMenu();
                    $("#btnSaveMainMenu").show();
                    $("#btnUpdateMenu").hide();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateMainMenuFlag(MenuId, flag) {

    var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
    var objBO = {};
    objBO.MenuId = MenuId;
    objBO.Logic = "UpdateMainMenuFlag";
    if (flag == 'Enabled')
        objBO.Flag = 0;
    else
        objBO.Flag = 1;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Success') {
                GetMainMenu();
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

//<<<-------------Sub Menu Master Section------------->>>
function GetSubMenu() {

    var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
    var objBO = {};
    objBO.Logic = "GetSubMenu";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data) {
                $("#tblSubMenu tbody").empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $("<tr><td>" + val.sub_menu_id + "</td><td>" + val.menu_name + "</td><td>" + val.sub_menu_name + "</td> <td>" + val.sub_menu_link + "</td> <td><span class='flag'>" + val.disabled_flag + "</span></td> <td>" + val.cr_date + "</td> <td>" +
                        " <div class='input-group-btn'>" +
                        " <div class='input-group-btn'>" +
                        "<span class='btn btn-danger disable' data-submenuid=" + val.sub_menu_id + " data-flag=" + val.disabled_flag + "><i class='fa fa-check'></i></span>" +
                        "<span class='btn btn-primary edit' data-submenuid=" + val.sub_menu_id + "><i class='fa fa-edit'></i></span>" +
                        "</div></td></tr>").appendTo($("#tblSubMenu tbody"));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetSubMenuBySubMenuId(SubMenuId) {

    var url = config.baseUrl + "/api/ApplicationResource/MasterQueries";
    var objBO = {};
    objBO.Logic = "GetSubMenuBySubMenuId";
    objBO.SubMenuId = SubMenuId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#txtSubMenuName").val('');
            $("#txtSubMenuUrl").val('');
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#btnSaveSubMenu").hide();
                    $("#btnUpdateSubMenu").show();
                    $("#btnUpdateSubMenu").data('submenuid', val.sub_menu_id);
                    $("#txtSubMenuName").val(val.sub_menu_name);
                    $("#txtSubMenuUrl").val(val.sub_menu_link);
                    $("#ddlMenu").val(val.menu_id).change();
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertSubMenu() {
    if (ValidationSubMenu()) {
        var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
        var objBO = {};
        objBO.Logic = "InsertSubMenu";
        objBO.MenuId = $('#ddlMenu').val();
        objBO.SubMenuName = $('#txtSubMenuName').val();
        objBO.SubMenuUrl = $('#txtSubMenuUrl').val();
        objBO.Loginid = Active.userId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data != '') {
                    $("#ddlMenu")[0].selectedIndex = 0;
                    $("#txtSubMenuName").val('');
                    $("#txtSubMenuUrl").val('');
                    GetSubMenu();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateSubMenu(SubMenuId) {
    if (ValidationSubMenu()) {

        var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
        var objBO = {};
        objBO.SubMenuId = SubMenuId;
        objBO.MenuId = $('#ddlMenu').val();
        objBO.SubMenuName = $('#txtSubMenuName').val();
        objBO.SubMenuUrl = $('#txtSubMenuUrl').val();
        objBO.Logic = "UpdateSubMenu";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data != '') {
                    $("#ddlMenu")[0].selectedIndex = 0;
                    $("#txtSubMenuName").val('');
                    $("#txtSubMenuUrl").val('');
                    GetSubMenu();
                    $("#btnSaveSubMenu").show();
                    $("#btnUpdateSubMenu").hide();
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateFlag(SubMenuId, flag) {

    var url = config.baseUrl + "/api/ApplicationResource/InsertModifyMasterDetails";
    var objBO = {};
    objBO.SubMenuId = SubMenuId;
    objBO.Logic = "UpdateSubMenuFlag";
    if (flag == 'Enabled')
        objBO.Flag = 0;
    else
        objBO.Flag = 1;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                GetSubMenu();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}


//<<<-------------Validation Section------------->>>
function ValidationRole() {
    var role = $('#txtRoleName').val();
    if (role == '') {
        $('#txtRoleName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtRoleName').removeAttr('style');
    }
    return true;
}
function ValidationMenu() {
    var role = $('#ddlRole option:selected').text();
    var menu = $('#txtMenuName').val();

    if (role == 'Select Role') {
        $('#ddlRole').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlRole').removeAttr('style');
    }
    if (menu == '') {
        $('#txtMenuName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtMenuName').removeAttr('style');
    }
    return true;
}
function ValidationSubMenu() {
    var Menu = $('#ddlMenu option:selected').text();
    var SubMenu = $('#txtSubMenuName').val();
    var SubMenuUrl = $('#txtSubMenuUrl').val();

    if (Menu == 'Select Menu') {
        $('#ddlMenu').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlMenu').removeAttr('style');
    }
    if (SubMenu == '') {
        $('#txtSubMenuName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtSubMenuName').removeAttr('style');
    }
    if (SubMenuUrl == '') {
        $('#txtSubMenuUrl').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtSubMenuUrl').removeAttr('style');
    }
    return true;
}



