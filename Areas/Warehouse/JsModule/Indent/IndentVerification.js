$(document).ready(function () {
    BindStaticRemark();
    GetCartListByLoginId();
    $("#ddlStaticRemark").change(function () {
        
        var selectedvalue = $("#ddlStaticRemark").val();
        $('#tblPendingIndentList > tbody  > tr').each(function (index) {
            $(this).find("#ddlRemark" + index).val(selectedvalue);
        });
    });

    $("#ddlCartList").change(function () {
        var cid = $('#ddlCartList :selected').val();
        GetPendingIndentList(cid);
    });
});

function ValidateQTY(data) {
    var passval = $("#" + data).val();
    var regex = /^[0-9]+$/;
    var isValid = regex.test(passval);
    if (!isValid) {
        alert('Only nmbers are allowed');
        $("#" + data).val('');
        return false;
    }
}


function GetCartListByLoginId() {
	
	var url = config.baseUrl + "/api/warehouse/wh_IndentQueries";
	var objIdentBO = {};
	objIdentBO.login_id = Active.userId;
	objIdentBO.Logic = "GetCartListByLogin";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objIdentBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			
			if (data.ResultSet.Table.length > 0) {
				$("ddlCartList").empty();
				$("#ddlCartList").append($("<option></option>").val("0").html("Please Select"));
				$.each(data.ResultSet.Table, function (key, value) {
					$("#ddlCartList").append($("<option></option>").val(value.CartId).html(value.CartName));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function BindStaticRemark() {
    $("#ddlStaticRemark").empty();
    $("#ddlStaticRemark").append($("<option></option>").val("OK").html("OK"));
    $("#ddlStaticRemark").append($("<option></option>").val("No Stock In Warehouse").html("No Stock In Wharehose"));
    $("#ddlStaticRemark").append($("<option></option>").val("Less Stock in warehouse").html("Less Stock in warehouse"));
    $("#ddlStaticRemark").append($("<option></option>").val("Cancel").html("Cancel"));
    $("#ddlStaticRemark").append($("<option></option>").val("Adequate stock at unit").html("Adequate stock at unit"));
    $("#ddlStaticRemark").append($("<option></option>").val("Corrected Pack Size").html("Corrected Pack Size"));
}

function GetPendingIndentList(CartId) {
	var url = config.baseUrl + "/api/Warehouse/wh_IndentProcessQueries";
    var objPendiningIndentBO = {};
    objPendiningIndentBO.CartId = CartId;
    objPendiningIndentBO.Logic = "IndentDetailAllPending";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objPendiningIndentBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            if (data.ResultSet.Table.length > 0) {
                $('#tblPendingIndentList').show();
                $('#tblPendingIndentList tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    $("#txtOrder").val(val.Indent_no);
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.order_date + '</td>';
                    htmldata += '<td>' + val.indent_no + '</td>';
                    htmldata += '<td>' + val.item_id + '</td>';
                    htmldata += '<td>' + val.item_Name + '</td>';
                    htmldata += '<td>' + val.verify_qty + '</td>';
                    htmldata += '<td>' + val.wh_stocks + '</td>';
                    htmldata += '<td>' + val.cart_stocks + '</td>';
                    htmldata += '<td><input style="width:40px"  class="txtQty" type=text id="txtverfyqty" maxlength="5" name="txtverfyqty" onkeyup="return ValidateQTY(this.id)"</td>';
                    htmldata += '<td><select class="dddata" id="ddlRemark' + key + '" name="ddlRemark' + key + '"></select></td>';
                    htmldata += '<td>' + val.emp_name + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblPendingIndentList tbody').append(htmldata);
            }
            else {
                $('#tblPendingIndentList').show();
                $('#tblPendingIndentList tbody').empty();
                htmldata += '<tr>';
                htmldata += '<td colspan="7" style="color:red;text-align:center">' + "No record found" + '</td>';
                htmldata += '</tr>';
                //$("#txtOrder").val("New");
                $('#tblPendingIndentList tbody').append(htmldata);
            }
        },
        complete: function (com) {
            var pdata = JSON.parse(com.responseText);
            $.each(pdata.ResultSet.Table, function (key, val) {
                //$("#ddlRemark" + key).append($("<option></option>").val(val.verify_remark).html(val.verify_remark));
                $("#ddlRemark" + key).append($("<option></option>").val("OK").html("OK"));
                $("#ddlRemark" + key).append($("<option></option>").val("No Stock In Warehouse").html("No Stock In Wharehose"));
                $("#ddlRemark" + key).append($("<option></option>").val("Less Stock in warehouse").html("Less Stock in warehouse"));
                $("#ddlRemark" + key).append($("<option></option>").val("Cancel").html("Cancel"));
                $("#ddlRemark" + key).append($("<option></option>").val("Adequate stock at unit").html("Adequate stock at unit"));
                $("#ddlRemark" + key).append($("<option></option>").val("Corrected Pack Size").html("Corrected Pack Size"));
            });
            $.each(pdata.ResultSet.Table, function (key, val) {
                // Set the value comming from database
                $("[name='ddlRemark" + key + "'] option").filter(function () {
                    return ($(this).val() == val.verify_remark);
                }).prop('selected', true);
                //remove the duplicate value from dropdown
                $(".select option").val(function (idx, val) {
                    $(this).siblings('[value="' + val + '"]').remove();
                });
            });

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function VerifyQuantity() {
    var ary = [];
    var objIdentVerification = {};    
    objIdentVerification.login_id = Active.userId;
    $('#tblPendingIndentList tbody tr').each(function () {
        var indentno = $(this).find('td:eq(0)').html();
        var itemId = $(this).find('td:eq(2)').html();
        var veifyqty = $(this).find("td:eq(7) input[type='text']").val();
        var remark = $(this).find('select.dddata>option:checked').val();
        ary.push({ Indent_no: indentno, item_id: itemId, verify_qty: veifyqty, verify_remark: remark });        
    });

    objIdentVerification.VeriftDataTable = JSON.stringify(ary);    
    objIdentVerification.Logic = "Order_Verification";
    alert(JSON.stringify(objIdentVerification));

    var url = config.baseUrl + "/api/Indent/VerifyIndent";

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objIdentVerification),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {            
            if (data == "success") {
                alert('Successfully Verified');                
            }
            else {
                alert('Not Saved');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

