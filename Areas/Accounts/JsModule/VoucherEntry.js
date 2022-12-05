$(document).ready(function () {
    FillCurrentDate("txtDate");
    
    var d = GetPreviousDate();
    document.getElementById("txtDate").min = d + 'T10:38'

});
var PageNameLogic = "";
$(function () {
    $('#txtPayTo').on('keyup', function () {
        var value = $(this).val();
        var patt = new RegExp(value, "i");

        $('#FillDataRight').find('tr').each(function () {
            if (!($(this).find('td').text().search(patt) >= 0)) {
                $(this).not('.myHead').hide();
            }
            if (($(this).find('td').text().search(patt) >= 0)) {
                $(this).show();
            }
        });
        $('#hfPayTo').val('');
    });


    $('#txtPayBy').on('keyup', function () {
        var value = $(this).val();
        var patt = new RegExp(value, "i");

        $('#FillDataRight').find('tr').each(function () {
            if (!($(this).find('td').text().search(patt) >= 0)) {
                $(this).not('.myHead').hide();
            }
            if (($(this).find('td').text().search(patt) >= 0)) {
                $(this).show();
            }
        });

        $('#hfPayBy').val('');
    });
    PageNameLogic = $('#txtVchType').val()
    BindOnloadData();
});
function BindOnloadData() {
    
    var url = config.baseUrl + "/api/Account/BindOnloadData";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.VoucherNo ='-';
    objBO.VchType = PageNameLogic;
    objBO.Logic = "By Date and Voucher Type";
    objBO.LoginId = Active.userId;

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            
            if (data.length > 0) {
                $("#FillData").empty().append('<thead style="background: #00a65a;color: #fff;"><tr><th width="30%">Debit A/C or Pay To</th><th width="30%">Credit A/C or Pay By</th><th width="10%">Amount</th><th width="30%">Narration</th></tr></thead><tbody></tbody>');
                for (var i = 0; i < data.length; i++) {
                    // PayBy_Code  and PayTo_Code are opposite due to data base colomn 
                    $("#FillData").append('<tr>' +
                        '<td>' + data[i].PayBy_Code + '</td>' +
                        '<td>' + data[i].PayTo_Code + '</td>' +
                        '<td align="right">' + data[i].DrCrAmount + '</td>' +
                        '<td>' + data[i].Narration + '</td>' +
                        '</tr>');
                }
            }
            else {
                $("#FillData").empty();
            }
        }
    });
}
function Bind_PayTo_PayBy(SearchType) {
    var rightTitle = "";
    if (SearchType == "Debit") {
        rightTitle = "Pay To";
    }
    else if (SearchType == "Credit") {
        rightTitle = "Pay By";
    }

    var url = config.baseUrl + "/api/Account/Bind_PayTo_PayBy";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.VchType = PageNameLogic;
    objBO.Prm1 = SearchType;

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.length > 0) {
                $("#FillDataRight").empty()
                $("#FillDataRight").append('<input type="text" style="width:100%" id="myInput" onkeyup="myFunction()" placeholder="Search for names..">')
                $("#FillDataRight").append('<thead style="background: #00a65a;color: #fff;"><tr class="myHead"><th>' + rightTitle + '</th></tr></thead><tbody></tbody>');
                for (var i = 0; i < data.length; i++) {
                    $("#FillDataRight").append('<tr>' +
                        '<td>' +
                        '<a href="javascript:void(0)" onclick="Set_Details(\'' + SearchType + '\',\'' + data[i].Code + '\',\'' + data[i].Name + '\');">' + data[i].Name + '</a>' +
                        '</td>' +
                        '</tr>');
                }
            }
            else {
                 $("#FillDataRight").empty();
            }
        }
    });
}



function Set_Details(SearchType, Code, Name) {
    $("#FillDataRight").empty();
    if (SearchType == "Debit") {
        $("#txtPayTo").val('').val(Name);
        $('#hfPayTo').val(Code);
    }
    else if (SearchType == "Credit") {
        $("#txtPayBy").val('').val(Name);
        $('#hfPayBy').val(Code);



    }
}


function BindCredit(e) {
    $('#txtCrAmount').val($(e).val());
}



function SubmitPayDetails() {
    
    var objPay = {};
    var url = config.baseUrl + "/api/Account/SubmitPayment";
    objPay.UnitId = Active.unitId;
    objPay.VchType = PageNameLogic;
    objPay.VchDate = $('#txtDate').val();
    objPay.PayTo_Code = $('#hfPayTo').val();
    objPay.PayBy_Code = $('#hfPayBy').val();
    objPay.DrCrAmount = $('#txtDrAmount').val();
    objPay.Narration = $('#txtNarration').val();
    objPay.LoginId = Active.userId;
    objPay.Logic = "ReturnCurrentDayRecord";
    objPay.GenFrom = "Web-UI";
    objPay.Division = '-';
    objPay.VoucherNo = '-';

    if (objPay.PayTo_Code == "") {
        alert("Please fill pay To");
        $('#txtPayTo').focus();
        return false;
    }
    else if (objPay.DrCrAmount == "") {
        alert("Please fill Debit Amount");
        $('#txtDrAmount').focus();
        return false;
    }
    else if (objPay.PayBy_Code == "") {
        alert("Please fill pay By");
        $('#txtPayBy').focus();
        return false;
    }
    else if (objPay.Narration == "") {
        alert("Please fill Narration");
        $('#txtNarration').focus();
        return false;
    }
    $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objPay),
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                success: function (data) {
                    if (data.length > 0) {
                        ClearControl();
                        alert("Successfully Saved");
                        $("#FillData").empty().append('<thead style="background: #00a65a;color: #fff;"><tr><th width="30%">Debit A/C or Pay To</th><th width="30%">Credit A/C or Pay By</th><th  width="10%">Amount</th><th  width="30%">Narration</th></tr></thead><tbody></tbody>');
                        for (var i = 0; i < data.length; i++) {
                            // PayBy_Code  and PayTo_Code are opposite due to data base colomn 
                            $("#FillData").append('<tr>' +
                                '<td>' + data[i].PayBy_Code + '</td>' +
                                '<td>' + data[i].PayTo_Code + '</td>' +
                                '<td align="right">' + data[i].DrCrAmount + '</td>' +
                                '<td>' + data[i].Narration + '</td>' +
                                '</tr>');
                        }
                    }
                    else {
                        alert("Not Saved");
                        $("#FillData").empty();
                    }
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
   
}


function ClearControl() {
    $("#FillDataRight").empty();
    $("#txtPayTo").val('');
    $('#hfPayTo').val('');
    $("#txtPayBy").val('');
    $('#hfPayBy').val('');
    $("#txtDrAmount").val('0');
    $("#txtCrAmount").val('0');
    $("#txtNarration").val('');
}