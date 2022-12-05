$(document).ready(function () {
	FillCurrentDate("txtFrom");
	FillCurrentDate("txtTo");
	$('#btnSend').on('click', function () {
		$('#tblTallyVoucher tbody tr').each(function () {
            var VoucherNo = $(this).find('td:eq(4)').text();
            if ($(this).closest('tr').find('td:eq(12)').text() == "N") {
                VoucherForSync(VoucherNo, $(this));
            }
		})
	});
	$(document).click(function () {
		$('.msg').hide();
	})
	$('#tblTallyVoucher tbody').on('click', 'button[title=send]', function () {
        var VoucherNo = $(this).closest('tr').find('td:eq(4)').text();
        if ($(this).closest('tr').find('td:eq(12)').text() == "N") {
            VoucherForSync(VoucherNo, $(this).closest('tr'));
        }
        else {
            alert("Already Synced");
        }
	});
	$('#tblTallyVoucher tbody').on('mouseenter', 'button[title=status]', function () {
		if ($(this).is('.btn-danger')) {
			var x = $(this).position();
			var l = x.left;
			var t = x.top;
			$('.msg').text($(this).data('msg'));
			$('.msg').css({ top: t + "px" });
			$('.msg').hide();
			$('.msg').toggle('show');
		}
		else {
			$('.msg').hide();
		}

	});
});
function VoucherDetail() {
	var url = config.baseUrl + "/api/Account/Tally_ViewLedgerInfo";
	var objBO = {};
	objBO.UnitId = Active.unitId;
	objBO.from = $("#txtFrom").val();
	objBO.to = $("#txtTo").val();
	objBO.ledgerId = $('#ddlLedgerName').val();
	objBO.Logic = "Tally:VouchersList";
	objBO.VoucherNo = "-";
	objBO.LoginId = Active.userId;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			$('#tblTallyVoucher tbody').empty();
			$('#txtRemain').text(0);
			var htmldata = "";
			var count = 0;
			$.each(data.ResultSet.Table, function (key, val) {
				count++;
				htmldata += '<tr>';
                
                htmldata += '<td>' + count + '</td>';
                htmldata += '<td><input type="button" id="' + val.voucher_no + '" value="Detail" class="btn btn-info btn-block" onclick="showVoucherPopUp(this.id);" /></td>';
             	htmldata += '<td>' + val.vch_date + '</td>';
				htmldata += '<td>' + val.vch_type + '</td>';
				htmldata += '<td>' + val.voucher_no + '</td>';
				htmldata += '<td>' + val.billNo + '</td>';
				htmldata += '<td>' + val.BillType + '</td>';
				htmldata += '<td>' + val.Credit_Ledger + '</td>';
				htmldata += '<td>' + val.Debit_Ledger + '</td>';
				htmldata += '<td>' + val.amount + '</td>';
                htmldata += '<td>' + val.narration + '</td>';
                if (val.isTallySync == "N") {
                    htmldata += '<td>';
                    htmldata += '<button title="send" class="btn-flat btn-success">Send</button>&nbsp;';
                    htmldata += '</td>';
                }
                else {
                    htmldata += '<td></td>';
                }
				htmldata += '<td>' + val.isTallySync + '</td>';
				htmldata += '<td>';
				htmldata += '<button title="status" class="btn-flat btn-default">-</button>';
				htmldata += '</td>';
				htmldata += '</tr>';
			});
			$('#txtTotal').text(count);
			$('#tblTallyVoucher tbody').append(htmldata);
		},
		error: function (data) {
			alert('Error..!');
		},
	});
}
function VoucherForSync(VoucherNo, elem) {
	var count = 0;
	var url = config.baseUrl + "/api/Account/Tally_VoucherForSync";
	var objBO = {};
	objBO.VoucherNo = VoucherNo;
	objBO.Logic = 'Tally:VoucherForSync';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			count = parseInt($('#txtRemain').text()) + 1;
			$('#txtRemain').text(count);
			if (data == 'Successfully Saved') {
				$(elem).find('td:eq(13)').find('button[title=status]').removeAttr('class');
				$(elem).find('td:eq(13)').find('button[title=status]').addClass('btn-primary');
                $(elem).find('td:eq(13)').find('button[title=status]').html('<i class="fa fa-check"></i>');
                $(elem).find('td:eq(12)').text("Y");
			}
			else {
				$(elem).find('td:eq(13)').find('button[title=status]').removeAttr('class');
				$(elem).find('td:eq(13)').find('button[title=status]').addClass('btn-flat btn-danger');
				$(elem).find('td:eq(13)').find('button[title=status]').html('<i class="fa fa-question-circle"></i>');
                $(elem).find('td:eq(13)').find('button[title=status]').data('msg', data);
			}
		},
		error: function (data) {
			alert('Error..!');
		},
	});
}
function showVoucherPopUp(voucherNo) {
 
    if (voucherNo.length > 2) {
        $('#elVoucherNo').html(voucherNo);
        VoucherPopUp(voucherNo);
    }
    $('#myModal').modal('show');
}
function VoucherPopUp(voucherNo) {
    var url = config.baseUrl + "/api/Account/AC_VoucherDetail";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.ledgerId = $('#ddlLedgerName').val();
    objBO.Logic = "VoucherFullDetail";
    objBO.VoucherNo = voucherNo;
    objBO.LoginId = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $("#elVoucherDetail").html(data);
        }
    });
}