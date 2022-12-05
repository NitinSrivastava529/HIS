$(document).ready(function () {
    TransferIds();
    $('#tblStockIds tbody').on('click', 'button', function () {
        selectRow($(this));
    });
});


function TransferIds() {
    var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.TransferId = '';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "TransferIds";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $('#tblStockIds tbody').empty();
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td style="width:20%">' + val.trf_id + '</td>';
                    tbody += '<td style="width:20%">' + val.trf_date + '</td>';
                    tbody += '<td style="width:1%"><button onclick=TransferDetail("' + val.trf_id + '") class="btn-success btn-flat">>></button></td>';
                    tbody += '</tr>';
                });
                $('#tblStockIds tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function TransferDetail(TransferId) {
    var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.TransferId = TransferId;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "TransferDetail";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data.ResultSet.Table.length > 0) {
                $('#tblTransferDetail tbody').empty();
                $('#txtTransId').val(TransferId);
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td>' + val.master_key_id + '</td>';
                    tbody += '<td>' + val.Item_name + '</td>';
                    tbody += '<td>' + val.batch_no + '</td>';
                    tbody += '<td>' + val.expiry + '</td>';
                    tbody += '<td>' + val.pack_type + '</td>';
                    tbody += '<td>' + val.pack_qty + '</td>';
                    tbody += '<td>' + val.qty + '</td>';
                    //tbody += '<td style="width:1%"><button class="btn-success btn-flat">>></button></td>';
                    tbody += '</tr>';
                });
                $('#tblTransferDetail tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function MarkReceived(TransferId) {
    var url = config.baseUrl + "/api/warehouse/Hospital_GeneralStoreQueries";
    var objBO = {};
    objBO.unit_id = Active.unitId;
    objBO.TransferId = TransferId;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "MarkReceived";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function ReceiveStock() {
    if (confirm('Are you sure want to receive?')) {
        var transId = $("#txtTransId").val();
        if (transId != "") {
            var url = config.baseUrl + "/api/warehouse/wh_ImportFromPharmacy";
            var objBO = {};
            objBO.unit_id = Active.unitId;
            objBO.TransferId = transId;
            objBO.from = '1900/01/01';
            objBO.to = '1900/01/01';
            objBO.login_id = Active.userId;
            objBO.Logic = "TransferDetail";
            objBO.WHLogic = "ReceiveFromPharmacy";
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    
                    if (data.includes('suc')) {
                        MarkReceived(transId);
                        alert(data);
                        $('#txtTransId').val('');
                        $('#tblTransferDetail tbody').empty();
                        $('#tblStockIds tbody').find('tr.select-row').remove();
                    }
                },
                error: function (response) {
                    alert('Server Error...!');
                }
            });
        }
    }
}




