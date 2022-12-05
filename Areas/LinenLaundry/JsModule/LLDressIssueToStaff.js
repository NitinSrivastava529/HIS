$(document).ready(function () {
    $('#btnGetEmployee').on('click', function () {
        var empName = $('#txtEmpName').val();
        GetEmpDetails(empName);
    });
    $('select').select2
    FillProductList();
    $("#txtQty").on("keydown", function (e) {
        if (e.which == 13) {
            Dispatch();
        }
    });
});
function EmpInfo() {
    var empCode = $('#ddlEmployee option:selected').val();
    var empName = $('#ddlEmployee option:selected').data('name');
    var empDesig = $('#ddlEmployee option:selected').data('desig');
    var empMobile = $('#ddlEmployee option:selected').data('mobile');
    $('#txtEmpCode').text(empCode);
    $('#txtEmployeeName').text(empName);
    $('#txtMobile').text(empMobile);
    $('#txtDesignation').text(empDesig);
    GetDressIssueToStaff();
}
function GetEmpDetails(empName) {
    var url = config.baseUrl + "/api/ApplicationResource/MenuQueries";
    var objBO = {};
    objBO.Prm1 = empName,
        objBO.Logic = 'GetEmployee'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (data != '') {
                $('#ddlEmployee').empty().append($('<option>Select Employee</option>')).select2();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtEmpName').val('');
                    $('#ddlEmployee').append($('<option data-name="' + val.EmpName + '" data-desig="' + val.designation + '" data-mobile="' + val.mobile_no + '"></option>').val(val.emp_code).html(val.emp_name));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function FillProductList() {

    $("#ddlProductList").empty();

    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "LL_ItemList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#ddlProductList').append($('<option selected="selected"></option>').val("Select").html("Select")).select2();
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlProductList').append($('<option></option>').val(val.item_id).html(val.item_name))
            })
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function GetStocks() {
    $('#txtInStock').text("0");
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objConsumpBO = {};
    objConsumpBO.hosp_id = Active.unitId;
    objConsumpBO.CartId = $('#ddlFromCart option:selected').val();
    objConsumpBO.ItemId = $('#ddlProductList').val();
    objConsumpBO.Logic = "LL_StoreStocks";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objConsumpBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $.each(data.ResultSet.Table, function (key, val) {
                $('#txtInStock').val(val.stocks);
                $('#txtQty').focus();
            })
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Issue() {
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
    var objBO = {};
    var stqty = $('#txtInStock').val();
    var qty = $('#txtQty').val();
    if ($('#txtEmpCode').text() == '') {
        alert('Employee Not Selected');
        return false;
    }
    if ($('#ddlProductList option:selected').text() == 'Select') {
        alert('Item Not Selected');
        return false;
    }
    if (qty == '') {
        alert('Enter Quantity.');
        return false;
    }
    if (eval(qty) > eval(stqty)) {
        alert('Transfer qunatity can not be geater than stock qty');
        return false;
    }
    objBO.lot_no = $('#txtEmpCode').text();
    objBO.ItemId = $('#ddlProductList option:selected').val();
    objBO.qty = qty;
    objBO.trf_to = '-';
    objBO.trf_from = '-';
    objBO.login_id = Active.userId;
    objBO.IndentNo = "-";
    objBO.AutoId = "0";
    objBO.Logic = "DressIssueToStaff";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes("Success")) {
                $('#txtQty').val('');
                $('#txtInStock').val('');
                $('#ddlProductList').prop('selectedIndex', '0').change();
            }
            else {
                alert(data);
            }
        },
        complete: function (fn) {
            GetDressIssueToStaff();
        },
        error: function (response) {
            alert('Server Error...!');
        },
    });
}
function GetDressIssueToStaff() {
    $("#tblIssueItems tbody").empty();
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.TranId = '-';
    objBO.Prm1 = $('#txtEmpCode').text();
    objBO.login_id = Active.userId;
    objBO.trf_from = '';
    objBO.CartId = '';
    objBO.Logic = "GetDressIssueToStaff";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var count = 0;
            if (Object.keys(data.ResultSet.Table).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;
                    htmldata += '<tr>';
                    htmldata += '<td>' + count + '</td>';
                    htmldata += '<td>' + val.item_id + '</td>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td class="text-right">' + val.qty + '</td>';
                    htmldata += '<td><button onclick=DeleteIssueItem(' + val.auto_id + ')><i style="font-size:12px" class="fa fa-trash text-red"></i></button></td>';
                    htmldata += '</tr>';
                    $('#txtLotNo').val(val.lot_no);
                });
                $("#tblIssueItems tbody").append(htmldata);
                $('#ddlProductList').focus();
            }
            else {
                $('#txtQty').val('');
                $('#txtInStock').val('');
                $('#ddlProductList').prop('selectedIndex', '0').change();
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DeleteIssueItem(autoid) {
    if (confirm('Are you sure to Delete..!')) {
        var url = config.baseUrl + "/api/LinenLaundry/LL_TransferStock";
        var objBO = {};
        objBO.lot_no = '-';
        objBO.AutoId = autoid;
        objBO.Logic = "DeleteDressIssueItem";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetDressIssueToStaff();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

