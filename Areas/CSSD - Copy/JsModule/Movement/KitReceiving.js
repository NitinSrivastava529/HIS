$(document).ready(function () {
    searchTable('txtSearch', 'tblIndentInfo');
    GetCart();
});
function GetCart() {
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetCartByLogin';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#ddlCart").append($("<option></option>").val('0').html('Select'));
            $.each(data.ResultSet.Table, function (key, val) {
                $("#ddlCart").append($("<option></option>").val(val.CartId).html(val.CartName)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetIndentForReceiving() {
    $("#tblIndentInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Prm_1 = $("#ddlCart option:selected").val();
    objBO.Logic = 'GetIndentForReceiving';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var count = 0;
                    var TranId = '';
                    var Type = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (TranId != val.tran_id) {
                            Type = '';
                            tbody += "<tr class='bg1'>";
                            tbody += "<td colspan='8'><b>Tran-Id : </b>" + val.tran_id + '[ ' + val.cr_date + ' ]' + "<button onclick=Receive('" + val.tran_id + "') class='btn-warning pull-right' style='border: none;padding: 2px 7px;'><i class='fa fa-sign-in'>&nbsp;</i>Receive</button></td>";
                            tbody += "</tr>";
                            TranId = val.tran_id;
                        }
                        if (Type != val.type) {
                            count = 0;
                            tbody += "<tr class='bg2'>";
                            tbody += "<td colspan='8'><b>Receive From : </b>" + val.type + "</td>";
                            tbody += "</tr>";
                            Type = val.type;
                        }
                        count++;
                        tbody += "<tr class='" + val.tran_id + "'>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";
                        tbody += "<td>" + val.exp_date + "</td>";
                        tbody += "<td style='padding-right:10px;' class='text-right'>" + val.stockQty + "</td>";
                        tbody += "<td style='padding-right:10px;' class='text-right'>" + val.ReqQty + "</td>";
                        tbody += "</tr>";
                    });
                    $("#tblIndentInfo tbody").append(tbody);
                }
                else {
                    //alert("Data Not Found");
                };
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Receive(tranId) {
    if (confirm('Are you sure to Receive?')) {
        var url = config.baseUrl + "/api/cssd/CSSD_ItemDispatchAndReceive";
        var objBO = [];
        objBO.push({
            'TrnNo': tranId,
            'expDate': '1900/01/01',
            'hosp_id': Active.unitId,
            'login_id': Active.userId,
            'Logic': "Receive"
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GetIndentForReceiving();
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