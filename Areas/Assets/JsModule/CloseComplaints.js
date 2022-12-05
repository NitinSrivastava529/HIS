
$(document).ready(function () {
    AssetsQueries();
    $('#txtSearchComplaint').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblCloseCompl tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblCloseCompl tbody').on('click', '.complaint', function () {
        $('span[data-dept]').text($(this).data('dept'));
        $('span[data-section]').text($(this).data('section'));
        $('span[data-eqno]').text($(this).data('eqno'));
        $('span[data-eqcategory]').text($(this).data('eqcategory'));
        $('span[data-description]').text($(this).data('description'));
        $('span[data-complcode]').text($(this).data('complcode'));
        GetRemarkByComplCode($(this).data('complcode'));
    }); 
    $('#btnSaveComplaint').on('click', function () {
        var rem = $('#txtRemark').val();
        if (rem != '') {
            var ComplCode = $('span[data-complcode]').text();
            insertComplaintCommunication(ComplCode);
        }
        else {
            alert('Please Fill Remark..');
            $('#txtRemark').css('border-color', 'red');
        }
    });
    $('#btnCloseComplaint').on('click', function () {
        var Eq = $('span[data-eqno]').text();
        closeComplaint(Eq);
    });
});

function AssetsQueries() {
    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.DeptHead = Active.userId;
    objBO.Logic = "GetAssetsComplaintForClosing";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblCloseCompl tbody").empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.eq_no + '</td><td>' + val.Compl_code + '</td><td>' + val.Complaint + '</td><td>' + val.cr_date + '</td><td>' + val.eq_category + '</td>' +
                        '<td class="btn text-green complaint" data-dept="' + val.DeptName + '" data-section="' + val.SectionName + '" data-eqno="' + val.eq_no + '" data-eqcategory="' + val.eq_category + '" data-description="' + val.eq_description + '" data-complcode="' + val.Compl_code + '">' +
                        '<span class="fa fa-arrow-right"></span></td></tr>').appendTo($("#tblCloseCompl tbody"));
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
function GetRemarkByComplCode(ComplCode) {
    var url = config.baseUrl + "/api/Asset/AssetsQueries";
    var objBO = {};
    objBO.ComplCode = ComplCode;
    objBO.Logic = "GetRemarkByComplCode";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblRemark tbody").empty();
            if (data != '') {
                
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.Remark_by + '</td><td>'
                        + val.Remarks + '</td><td>' + val.Cr_date + '</td></tr>').appendTo($("#tblRemark tbody"));               
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
function insertComplaintCommunication(ComplCode) {
    var url = config.baseUrl + "/api/Asset/insertComplaintCommunication";
    var objBO = {};
    objBO.ComplCode = ComplCode;
    objBO.login_id = Active.userId;
    objBO.Remarks = $('#txtRemark').val();   
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data != '') {
                $('#txtRemark').val('');  
                GetRemarkByComplCode(ComplCode)
                alert(data);                
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
function closeComplaint(Eq) {
    var url = config.baseUrl + "/api/Asset/closeComplaint";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.EqNo = Eq;   
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data != '') {
                alert(data);                
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