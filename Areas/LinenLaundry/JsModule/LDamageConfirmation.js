$(document).ready(function () {
    searchTable('txtSearchProduct', 'tblPendingReceive');
    GetPendingReceive();
    $('input[id=chkAll]').on('change', function () {
        var isCheck = $(this).is(':checked');
        if (isCheck) {
            $(this).closest('table').find('tbody input:checkbox').prop('checked', true);
        }
        else {
            $(this).closest('table').find('tbody input:checkbox').prop('checked', false);
        }
    });
    $('#tblPendingReceive tbody').on('keyup', 'input:text', function () {
        var Qty = $(this).closest('tr').find('td:eq(6)').text();
        var receiveQty = $(this).val();
        if (eval(receiveQty) > eval(Qty)) {
            $(this).val(Qty);
            alert('Receive quantity should not be greater then Qty..');
            return;
        }
    });
});



function GetPendingReceive() {
    var url = config.baseUrl + "/api/LinenLaundry/LL_TransferAndReceiveQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.CartId = '-';
    objBO.ItemId = '-';
    objBO.Logic = "LLDamagePendingReceive";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            
            $('#tblPendingReceive tbody').empty();
            var tbody = "";
            var temp = "";
            var cart = "";
            var count = 0;
            $.each(data.ResultSet.Table, function (key, val) {
                count++;
                if (cart != val.CartName) {
                    tbody += "<tr style='background:#bbe1ff'>";
                    tbody += "<td colspan='7'>" + val.CartName + "</td>";
                    cart = val.CartName;
                }
                if (temp != val.tran_id) {
                    tbody += "<tr style='background:#ddd'>";
                    tbody += "<td colspan='7'>" + val.tran_id + "<span class='pull-right'>" + val.cr_date + "</span></td>";
                    temp = val.tran_id;
                }
                tbody += "<tr>";
                tbody += "<td style='width:5%'>" + count + "</td>";
                tbody += "<td style='display:none'>" + val.tran_id + "</td>";
                tbody += "<td style='display:none'>" + val.CartId + "</td>";
                tbody += "<td style='width:10%'>" + val.item_id + "</td>";
                tbody += "<td style='width:40%'>" + val.item_name + "</td>";
                tbody += "<td style='width:20%'>" + val.remarks + "</td>";
                tbody += "<td style='width:10%'>" + val.qty + "</td>";
                tbody += "<td style='width:10%'><input type='text' style='height:20px;background:#cfffe4' class='form-control text-right' value='" + val.qty + "'/></td>";
                tbody += "<td style='width:1%'><input type='checkbox' checked/></td>";
                tbody += "</tr>";
            });
            $('#tblPendingReceive tbody').append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function ReceiveInDamage() {
    if (confirm('Are you sure to Receive Selected Damage?')) {
        var url = config.baseUrl + "/api/LinenLaundry/LL_AllPendingReceiving";
        var objBO = [];
        $('#tblPendingReceive tbody tr input:checkbox:checked').map(function () {
            objBO.push({
                'hosp_id': Active.unitId,
                'login_id': Active.userId,
                'transid': $(this).closest('tr').find('td:eq(1)').text(),
                'frmcart': Active.LinenDamageCartId,
                'tocart': Active.LinenDamageCartId,
                'item_id': $(this).closest('tr').find('td:eq(3)').text(),
                'qty': $(this).closest('tr').find('td:eq(7)').find('input:text').val(),       
                'Logic': 'DamageReceiving'         
            });
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);                 
                    GetPendingReceive();
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