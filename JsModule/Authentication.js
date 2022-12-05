$(document).ready(function () {   
    sessionStorage.setItem("_HISDebugPermission", "N");
  
    if (window.location.pathname.toLowerCase() != '/' && window.location.pathname.toLowerCase() != '/admin/dashboard')
        IsAuthorizedMenu();
  
    var Rolls = sessionStorage.getItem("Rolls");
    if (Rolls == null && Active.userId != null) {
        GetRoleAndUnitList();
    }
    else {
        LoadRoleAndUnitFromLocallyStored();
    }

    var ActiveRolid = sessionStorage.getItem('Active-Role');

    if (ActiveRolid != null && Active.userId != null) {
        LoadSubMenuFromLocallyStored();
    }
    else {
        $('#dashnav-btn a').trigger('click');
    }

    $(document).on('click', '.role', function () {
        var RoleId = $(this).data('roleid');
        sessionStorage.setItem('Active-Role', RoleId);
        GetSubMenuByRoleAndLoginId(RoleId);
        $('body').removeClass('closed-sidebar');
        $('#page-content').hide();
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + '?mid=jgkjngkrngkrnr48474jjknjrbjrknrbknkbn';
            window.history.pushState({ path: newurl }, '', newurl);
        }
    });
    $(document).on('change', '#ddlUnit', function () {
        sessionStorage.removeItem('UnitId');
        var val = $(this).find(':selected').data("unitid");
        sessionStorage.setItem('UnitId', val);
        location.reload(true);
    });
    $('#btnLogin').on('click', function () {
        Authentication();
    });
    $('.dashboard-buttons').on('keyup', '#txtSearchRoleDash', function () {
        var val = $(this).val().toLowerCase();
        $('#dashnav-btn .dashboard-buttons a').filter(function () {
            $(this).toggle($(this).data('role').toLowerCase().indexOf(val) > -1);
        });
    });
});
function IsAuthorizedMenu() {
    var url = config.baseUrl + "/api/ApplicationResource/InsertDeleteAllotMenu";
    var objBO = {};
    objBO.SubMenuId =query()['mid'];
    objBO.EmpCode = Active.userId;
    objBO.Logic = 'IsAuthorizedMenu';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (window.location.pathname.split('/').pop().toLowerCase() != data.replace(/\s/g, '')) {                
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = config.rootUrl;
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Authentication() {
    if (Validation()) {
        $('#btnLogin').append("<i class='fa fa fa-spinner fa-spin ml5'></i>").addClass('disabled');
        var url = config.baseUrl + "/api/ApplicationResource/AuthenticationQueries";
        var objBO = {};
        objBO.LoginId = $('#txtUserID').val();
        objBO.Password = $('#txtPassword').val();
        objBO.Logic = "Authenticate";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                stopLoading();

                if (data.Msg == 'Success') {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('input').val('');
                        sessionStorage.setItem('Username', val.emp_name);
                        sessionStorage.setItem('UserID', val.emp_code);
                        sessionStorage.setItem('DoctorId', val.DoctorId);
                        sessionStorage.setItem('ServerTodayDate', val.ServerTodayDate);
                        window.location.href = config.rootUrl + "/Admin/Dashboard";
                        //alert(val.emp_code);
                    });
                }
                else {
                    $('input').val('');
                    stopLoading();
                    alert(data.Msg);
                }
            },
            complete: function (res) {
                stopLoading();
                $('#btnLogin').removeClass('disabled');
            },
            error: function (response) {
                $('input').val('');
                stopLoading();
                alert('Server Error...!');
            }
        });
    }
}
function GetRoleAndUnitList() {
    var url = config.baseUrl + "/api/ApplicationResource/AuthenticationQueries";
    var objBO = {};
    objBO.LoginId = Active.userId,
        objBO.Logic = 'RoleAndUnitList'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            $('#dashnav-btn .dashboard-buttons').empty();
            if (data != '') {
                sessionStorage.setItem("Rolls", "Loaded");                
                sessionStorage.setItem("RoleAndUnit", JSON.stringify(data));

                if (data != null && data.ResultSet.Table2 != null && data.ResultSet.Table2.length > 0) {
                    $.each(data.ResultSet.Table2, function (key, val) {
                        sessionStorage.removeItem('UnitId');
                        sessionStorage.setItem('UnitId', val.unit_id);
                    });
                }
                else {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        if (data.ResultSet.Table1.length == 1) {
                            sessionStorage.removeItem('UnitId');
                            sessionStorage.setItem('UnitId', val.unit_id);
                        }
                    });
                }

                LoadRoleAndUnitFromLocallyStored();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function LoadRoleAndUnitFromLocallyStored() {
    // always get data from localy stored so that avoid server trip
    var data = JSON.parse(sessionStorage.getItem("RoleAndUnit"));
    if (data != null && data.ResultSet.Table != null) {
        $('#dashnav-btn .dashboard-buttons').append('<input type="text" id="txtSearchRoleDash" autocomplete="off" class="form-control" style="width: 97%" placeholder="Search Roles....." />');
        $.each(data.ResultSet.Table, function (key, val) {
            if (val.role_name.includes('IT Department'))
                sessionStorage.setItem("_HISDebugPermission", "Y");


            $("<a href ='#' data-roleid=" + val.role_id + " data-role='" + val.role_name + "' class='btn vertical-button hover-blue-alt role' title =''>" +
                "<span class='glyph-icon icon-separator-vertical pad0A medium'>" +
                "<i class='glyph-icon icon-dashboard opacity-80 font-size-20'></i>" +
                "</span>" + val.role_name +
                "</a>").appendTo($('#dashnav-btn .dashboard-buttons'));
        });
    }
    if (data != null && data.ResultSet.Table1 != null) {
        $.each(data.ResultSet.Table1, function (key, val) {
            $('#ddlUnit').append($('<option data-unitid="' + val.unit_id + '"></option>').val(val.unit_id).html(val.unit_name));
            $('#ddlUnit option').map(function () {
                if ($(this).val() == Active.unitId) return this;
            }).attr('Selected', 'Selected');
        });

    }


}
function GetSubMenuByRoleAndLoginId(RoleId) {
    var url = config.baseUrl + "/api/ApplicationResource/GetAllotedMenuByEmpCode";
    var objBO = {};
    objBO.RoleId = RoleId;
    objBO.EmpCode = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                sessionStorage.setItem("SubMenu", JSON.stringify(data));
                LoadSubMenuFromLocallyStored();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function LoadSubMenuFromLocallyStored() {

    var data = JSON.parse(sessionStorage.getItem("SubMenu"));
    if (data != null) {
        $("#sidebar-menu").empty();
        $.each(data, function (key, val) {
            var sm = $.map(val.SubMenu, function (n) {
                var li = "<li><a href='" + config.rootUrl + '/' + n.SubMenuLink + "?mid=" +n.SubMenuId+ "' data-smid=" + n.SubMenuId + " title='Content boxes'><span>" + n.SubMenuName + "</span></a></li>";
                list = li.replace(/,/g, "");
                return list;
            });
            $("<li data-menuid=" + val.MenuId + " class=''>" +
                "<a href='#' data-menuid=" + val.MenuId + " title='Elements' class='sf-with-ul'>" +
                "<i class='glyph-icon icon-linecons-diamond'></i>" +
                "<span data-menuid=" + val.MenuId + ">" + val.MenuName + "</span>" +
                "</a><div class='sidebar-submenu' style='display: none'><ul>" + sm.join('') + "</ul></div></li>").appendTo($("#sidebar-menu"));
        });
    }
}
//Validation
function Validation() {

    var UserID = $('#txtUserID').val();
    var Password = $('#txtPassword').val();

    if ((UserID == '')) {
        $('#txtUserID').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtUserID').removeAttr('style');
        $('#txtUserID').siblings('span').remove();
    }
    if (Password == '') {
        $('#txtPassword').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtPassword').removeAttr('style');
        $('#txtPassword').siblings('span').remove();
    }
    return true;
}
//Stop Loading
function stopLoading() {
    $('#btnLogin i').remove();
}

function logOut() {
    sessionStorage.clear();
    window.location.href = "/His";
}