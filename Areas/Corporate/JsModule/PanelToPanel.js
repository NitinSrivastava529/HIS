
$(document).ready(function () {
    GetPanel();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblPanel tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#txtSearchLinkPanel').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblLinkPanel tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblPanel tbody').on('click', 'span.btnAttach', function () {
        
        var index = $(this).closest("tr").index();
        var mpId = $(this).closest('tr').find('select option:selected').val();
        var lkId = $(this).closest('tr').find('td').eq(0).text();
        PanelLink(lkId, mpId, index);
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
                    $('<tr><td>' + val.Panel_id + '</td><td>' + val.company_name + '</td><td>' + val.credit_Flag + '</td>' +
                        '<td style="display:flex" class="text-green getPanel" data-panelid="' + val.Panel_id + '" data-company="' + val.company_name + '">' +
                        '<select class="ddlPanel2" id=' + val.Panel_id + '></select><span class="btn btn-success btnAttach">Update</span></td></tr>').appendTo($('#tblPanel tbody'));
                });
            }
            else {
                alert("Error");
            };
        },
        complete: function (com) {
            GetPanel2();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPanel2() {
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
                $('.ddlPanel2').empty();
                $('.ddlPanel2').append($('<option value="0">Select Panel</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $('.ddlPanel2').append($('<option value="' + val.Panel_id + '">' + val.company_name + '</option>'));
                    $("#" + val.Panel_id + " option[value='" + val.Panel_id + "']").prop('selected', true);
                });
            }
            else {
                alert("Error");
            };
        },
        complete: function (com) {
            var com = JSON.parse(com.responseText);
            $.each(com.ResultSet.Table, function (key, val) {
                
                $("#" + val.Panel_id + " option[value='" + val.LinkPanelId + "']").prop('selected', true);
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PanelLink(mpId, lkId, index) {
    var url = config.baseUrl + "/api/Corporate/PanelLink";
    var objBO = {};
    objBO.master_panel_id = mpId;
    objBO.link_panel_id = lkId;
    objBO.login_id = Active.userId;
    objBO.Logic = 'Insert';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Attached') {

                $('#tblPanel tbody').find('tr').eq(index).find('td:eq(0),td:eq(1),td:eq(2)').css({ 'background': '#017d01', 'color': '#fff' });
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
    var val = $('span[data-pid]').text();

    if (val == 'Select Panel') {
        alert('Please Select Panel..');
        return true;
    }
    return true;
}
function Clear() {
    $('#tblLinkPanel tbody').find('input[type=checkbox]').prop('checked', false);
}





