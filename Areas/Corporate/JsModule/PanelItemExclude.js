
$(document).ready(function () {
    GetPanel();   
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblPanel tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblPanel tbody').on('click', '.getPanel', function () {
        $('span[data-pid]').text($(this).data('panelid'));
        $('span[data-panelid]').text($(this).data('company')); 
        GetPanelItemByPanelId($(this).data('panelid'));
    });
    $('#btnSaveManufacturer').on('click', function () {
        var val = $(this).val();
        if (val == 'Submit') {
            InsertManfacturer();
        }
        else if (val == 'Update') {
            UpdateManfacturer();
        }
    });

    //Search product
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
                var msg = $('#tblnavigate').find('tbody').find('.selected').data('alertmsg');
                if (msg != '-') {
                    $('.msg').html('<p>' + msg + '</p><span>X</span>').show();
                }
                $('#txtSearchProduct').val(itemName).blur();               
                $('#txtItemID').val(itemid);
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
                    SearchMedicine(key);
                }
                break;
        }
    });
    $('#tblnavigate tbody').on('click', 'tr', function () {
        var itemName = $(this).text();
        var itemid = $(this).data('itemid');
        var msg = $(this).data('alertmsg');
        if (msg != '-') {
            $('.msg').html('<p>' + msg + '</p><span>X</span>').show();
        }
        $('#txtSearchProduct').val(itemName).blur();
        $('#txtItemID').val(itemid);
        $('#ItemList').hide();
    });
    $('.msg').on('click', 'span', function () {
        $('.msg').html('').hide();
    });

    $('#tblItem tbody').on('click', '.IsActive', function () {
        
        var autoid = $(this).data('autoid');
        var val = $(this).data('isactive');
        if (val == 'Active') {
            UpdateStatus(autoid, 0);
        }
        else {
            UpdateStatus(autoid, 1);
        }
    });
});

function GetPanel() {
    var url = config.baseUrl + "/api/Corporate/PanelQueries";
    var objBO = {};
    objBO.Logic = 'PanelList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#tblPanel tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.Panel_id + '</td><td>' + val.company_name + '</td>' +                     
                        '<td class="btn text-green getPanel" data-panelid="' + val.Panel_id + '" data-company="' + val.company_name +'">'+  
                        '<span class="fa fa-arrow-right"></span></td></tr>').appendTo($('#tblPanel tbody'));
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
function GetPanelItemByPanelId(pid) {
    
    var url = config.baseUrl + "/api/Corporate/PanelQueries";
    var objBO = {};
    objBO.panel_id = pid;
    objBO.Logic = 'GetPanelItemByPanelId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                
                $('#tblItem tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.item_id + '</td><td>' + val.item_name + '</td><td>' + val.login_id + '</td><td>' + val.cr_date + '</td><td style="color:' + val.IsActive_color + '">' + val.IsActive + '</td>' +           
                        '<td class="text-green getManf" data-item_id=' + val.item_id + ' data-mfdid=' + val.item_name + '>' +
                        '<category type="button" data-autoid=' + val.autoid + ' data-isactive=' + val.IsActive + ' class="btn btn-warning IsActive"><i class="fa fa-refresh"></i></category>' +
                        '</td></tr>').appendTo($('#tblItem tbody'));
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
function SearchMedicine(key) {
    
    var url = config.baseUrl + "/api/IPDNursing/SearchMedicine";
    var objBO = {};
    objBO.searchKey = key;
    objBO.searchType = 'ETHICAL';
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
                    $('<tr class="searchitems" data-AlertMsg="' + val.AlertMsg + '" data-itemid=' + val.item_id + '><td>' + val.item_name + "</td></tr>").appendTo($('#tblnavigate tbody'));
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
function InsertPanelItemExclude() {
    if (Validate()) {
        
        var url = config.baseUrl + "/api/Corporate/ExcludeItemForPanel";  
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.panel_id = $('span[data-pid]').text();
        objBO.item_id = $('#txtItemID').val();       
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';

        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'Successfully Saved') {
                    Clear();
                    var val = $('span[data-pid]').text();
                    GetPanelItemByPanelId(val);                                   
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
function UpdateStatus(autoid, IsActive) {
    var url = config.baseUrl + "/api/Corporate/ExcludeItemForPanel";  
    var objBO = {};
    objBO.auto_id = autoid;
    objBO.isActive = IsActive;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var val = $('span[data-pid]').text();           
            GetPanelItemByPanelId(val);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

//Validation
function Validate() {
    var product = $('#txtSearchProduct').val();
    var pid = $('span[data-id]');   

    if (product == '') {
        $('#txtSearchProduct').css({ 'border-color': 'red' });
        alert('Please Provide Item Name..');
        return false;
    }
    else {
        $('#txtSearchProduct').removeAttr('style').focus();
    }
    if (pid == '') {       
        alert('Please Panel From Left Side..');
        return false;
    }      
    return true;
}
function Clear() {
    $('input[type=text]').val('');    
    $('.msg').hide();
}





