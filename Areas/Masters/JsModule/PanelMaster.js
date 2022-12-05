
$(document).ready(function () {
    CloseSidebar();
    OnLoad();
    $("#ddlPaymentMode").multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        filterBehavior: 'text',
        filterPlaceholder: 'Search',
        enableCaseInsensitiveFiltering: true,
        includeFilterClearBtn: false
    });

    $("#txtSeachPanel").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblPanelDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function OnLoad() {
    //ddlRatePanel
    var url = config.baseUrl + "/api/master/mPanelQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    $("#ddlRatePanel").append($("<option></option>").val("0").html("Please Select"));
                    $("#ddlRatePanel").append($("<option selected='selected'></option>").val("SELF").html("SELF"));
                    $.each(data.ResultSet.Table2, function (key, value) {
                        $("#ddlRatePanel").append($("<option></option>").val(value.RateListId).html(value.RateListName));
                    });
                }              
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function AddUpdatePanel() {
    
    var objBO = {};
    var selfratetypearr = [];
    var paymode = [];
    var url = config.baseUrl + "/api/master/mInsertUpdatePanelMaster";
    var btnname = $("#btndaddupdate").text();
    if (btnname == "Save") {
        objBO.Logic = "Insert";
        objBO.PanelId = null;
    }
    else {
        objBO.Logic = "Update";
        objBO.PanelId = $("#hidPanelId").val();
    }
    objBO.PanelName = $("#txtPanelName").val();
    objBO.PanelGroup = $("#ddlGroupType option:selected").text();
    objBO.PanelGroupId = $("#ddlGroupType option:selected").val();
    objBO.PanelType = $("#ddlPanelType option:selected").text();
    if (objBO.PanelType == "Cash") {
        objBO.IsCredit = 0;
    }
    else {
        objBO.IsCredit = 1;
    }
    objBO.Address1 = $("#txtAddress1").val();
    objBO.Address2 = $("#txtAddress2").val();
    objBO.ContactPerson = $("#txtContactPerson").val();
    objBO.ContactNo = $("#txtContactNo").val();
    objBO.PhoneNo = $("#txtPhoneNo").val();
    objBO.Email = $("#txtEmail").val();
    objBO.Fax = $("#txtFaxNo").val();
    objBO.ValidFrom = Properdate($("#txtValidFrom").val());
    objBO.ValidTo = Properdate($("#txtValidTo").val());

    $('#ddlPaymentMode :selected').each(function () {
        paymode.push($(this).val());
    });
    objBO.PaymentMode = paymode.join();
    objBO.RatePalenId = $("#ddlRatePanel option:selected").val();
    objBO.ReferRateIpd = '-';
    objBO.ReferRateOpd = '-';
    objBO.CreditLimit = $("#txtCreditLimit").val();
    $('input[name=chkratetype]:checked').each(function () {
        selfratetypearr.push($(this).val());
    });
    objBO.RateTypeIpdOpd = selfratetypearr.join();
    objBO.ShowPrintOut = $("#ddlShowPrint option:selected").val();
    objBO.HideRate = $("#ddlHideRate option:selected").val();
    objBO.CoPaymentOn = $("#ddlCoPaymentOn option:selected").val();
    objBO.CoPaymentIn = $("#txtCoPaymentIn").val();
    objBO.FollowCuurency = $("#ddlCurrency option:selected").val();
    objBO.AllowPartialPay = $("#ddlAllowPartialPay option:selected").val();
    objBO.login_id = Active.userId;
    objBO.HospId = Active.unitId;

    if (ValidatePanel()) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var splitval = data.split('|');
                if (splitval[0] == '1' && splitval[1] == 'success') {
                    alert('Panel created successfully');
                    BindPanel(splitval[2]);
                }
                else if (splitval[0] == '2' && splitval[1] == 'success') {
                    alert('Panel Updated successfully');
                    BindPanel(splitval[2]);
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

function BindPanel(PanelId) {   
    var url = config.baseUrl + "/api/master/mPanelQueries";
    var objBO = {};
    if (PanelId != "") {
        objBO.PanelId = PanelId;
    }
    else {
        objBO.PanelId = null;
    }
    objBO.Logic = "GetPanelList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $("#tblPanelDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnEdit' + k + '" data-panelid="' + v.PanelId + '"  onclick = "selectRow(this);EditPanel(this)"><i class="fa fa-edit fa-lg text-blue"></i></a ></td>';
                        htmldata += '<td>' + v.PanelName + '</td>';
                        htmldata += '<td>' + v.Address + '</td>';
                        //htmldata += '<td>' + v.ReferenceCode + '</td>';  
                        //htmldata += '<td>' + v.ReferenceCodeOPD + '</td>'; 
                        htmldata += '<td>' + v.Contact_Person + '</td>';
                        htmldata += '<td>' + v.DateFrom + '</td>';
                        htmldata += '<td>' + v.DateTo + '</td>';
                        htmldata += '<td>' + v.CreditLimit + '</td>';
                        //htmldata += '<td><a class="btn btn-xs btn-warning" href = "javascript:void(0)">Service Offered</a ></td>'; 
                        htmldata += '</tr>';
                    });
                    $("#tblPanelDetails tbody").append(htmldata);
                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function EditPanel(element) {
    var PanelId = $(element).closest('tr.select-row').find('td:eq(0)').find('a').data('panelid')
    var url = config.baseUrl + "/api/master/mPanelQueries";
    var objBO = {};
    objBO.PanelId = PanelId;
    objBO.Logic = "EditPanelList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#hidPanelId").val(data.ResultSet.Table[0].PanelId);
                    $("#txtPanelName").val(data.ResultSet.Table[0].PanelName);
                    $("#ddlGroupType").val(data.ResultSet.Table[0].PanelGroupID);
                    $("#txtAddress1").val(data.ResultSet.Table[0].Add1);
                    $("#txtAddress2").val(data.ResultSet.Table[0].Add2);
                    $("#txtContactPerson").val(data.ResultSet.Table[0].Contact_Person);
                    $("#txtContactNo").val(data.ResultSet.Table[0].Mobile);
                    $("#txtPhoneNo").val(data.ResultSet.Table[0].Phone);
                    $("#txtEmail").val(data.ResultSet.Table[0].EmailID);
                    $("#txtFaxNo").val(data.ResultSet.Table[0].Fax_No);                   

                    var dtfrom = data.ResultSet.Table[0].DateFrom;
                    var dtto = data.ResultSet.Table[0].DateTo;

                    if (dtfrom != "" && dtfrom != null && typeof dtfrom != 'undefined') {
                        var dtfromsplit = dtfrom.split('/');
                        var dtfromddmmyy = dtfromsplit[2] + "-" + dtfromsplit[1] + "-" + dtfromsplit[0];
                        $("#txtValidFrom").val(dtfromddmmyy);
                    }
                    if (dtto != "" && dtto != null && typeof dtto != 'undefined') {
                        var dttosplit = dtto.split('/');
                        var dttomddmmyy = dttosplit[2] + "-" + dttosplit[1] + "-" + dttosplit[0];
                        $("#txtValidTo").val(dttomddmmyy);
                    }
                   

                    var paymode = data.ResultSet.Table[0].PaymentMode;
                    if (paymode != "" && paymode != null && typeof paymode != 'undefined') {
                        var data2 = paymode.split(',');
                        $("#ddlPaymentMode").multiselect('deselectAll', false);
                        $("#ddlPaymentMode").multiselect('select', data2);
                        $("#ddlPaymentMode").multiselect('rebuild');
                    }

                    $("#ddlRatePanel").val(data.ResultSet.Table[0].RateListId);
                    //$("#ddlReferRateIpd").val(data.ResultSet.Table[0].ReferenceCode);
                    //$("#ddlReferRateOpd").val(data.ResultSet.Table[0].ReferenceCodeOPD);
                    $("#txtCreditLimit").val(data.ResultSet.Table[0].CreditLimit);

                    var RateType = data.ResultSet.Table[0].RateTypeIpdOpd;
                    if (RateType != "" && RateType != null && typeof RateType != 'undefined') {
                        var splitRateType = RateType.split(',');
                        $("input[name='chkratetype']:checkbox").prop('checked', false);
                        if (splitRateType[0] != "" && splitRateType[0] != null && splitRateType[0] != 'undefined') {
                            $("input[type=checkbox][value=" + splitRateType[0] + "]").prop("checked", true);
                        }
                        if (splitRateType[1] != "" && splitRateType[1] != null && splitRateType[1] != 'undefined') {
                            $("input[type=checkbox][value=" + splitRateType[1] + "]").prop("checked", true);
                        }
                    }

                    $("#ddlShowPrint").val(data.ResultSet.Table[0].ShowPrintOut);
                    $("#ddlHideRate").val(data.ResultSet.Table[0].HideRate);
                    $("#ddlCoPaymentOn").val(data.ResultSet.Table[0].Co_PaymentOn);
                    $("#txtCoPaymentIn").val(data.ResultSet.Table[0].Co_PaymentPercent);
                    $("#ddlCurrency").val(data.ResultSet.Table[0].RateCurrencyCountryID);
                    $("#ddlAllowPartialPay").val(data.ResultSet.Table[0].IsAllowPartialPay);
                    $("#btndaddupdate").text('Update');
                    $("#btndaddupdate").val('Update')

                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function ValidatePanel() {
    var panelname = $("#txtPanelName").val();
    var contactperson = $("#txtContactPerson").val();
    var mobile = $("#txtContactNo").val();
    var vdfrom = $("#txtValidFrom").val();
    var vdto = $("#txtValidTo").val();

    if (panelname == "") {
        alert('Please enter panel name');
        return false;
    }
    if (contactperson == "") {
        alert('Please enter contact person name');
        return false;
    }
    if (mobile == "") {
        alert('Please enter contact number');
        return false;
    }
    if (vdfrom == "") {
        alert('Please select valid to');
        return false;
    }
    if (vdto == "") {
        alert('Please select valid from');
        return false;
    }

    return true;

    //$("#ddlPaymentMode").prop("selectedIndex", "0").val();
    //$("#ddlReferRateIpd").prop("selectedIndex", "0").val();
    //$("#ddlReferRateOpd").prop("selectedIndex", "0").val();
    //$("#txtCreditLimit").val('');
    //$('input[type=checkbox]').prop('checked', false);   
    //$("#ddlShowPrint").prop("selectedIndex", "0").val();
    //$("#ddlHideRate").prop("selectedIndex", "0").val();
    //$("#ddlCoPaymentOn").prop("selectedIndex", "0").val();
    //$("#txtCoPaymentIn").val('');
    //$("#ddlCurrency").prop("selectedIndex", "0").val();
    //$("#ddlAllowPartialPay").prop("selectedIndex", "0").val();
}

function ClearValues() {
    $("#txtPanelName").val('');
    $("#ddlGroupType").prop("selectedIndex", "0").val();
    $("#txtAddress1").val('');
    $("#txtAddress2").val('');
    $("#txtContactPerson").val('');
    $("#txtContactNo").val('');
    $("#txtPhoneNo").val('');
    $("#txtEmail").val('');
    $("#txtFaxNo").val('');
    $("#txtValidFrom").val('');
    $("#txtValidTo").val('');
    $("#ddlPaymentMode").prop("selectedIndex", "0").val();
    //$("#ddlReferRateIpd").prop("selectedIndex", "0").val();
    //$("#ddlReferRateOpd").prop("selectedIndex", "0").val();
    $("#ddlRatePanel").prop("selectedIndex", "1").val();
    $("#txtCreditLimit").val('');
    $('input[type=checkbox]').prop('checked', false);
    //$("#chkselfopd").val('');
    //$("#chkselfipd").val('');
    $("#ddlShowPrint").prop("selectedIndex", "0").val();
    $("#ddlHideRate").prop("selectedIndex", "0").val();
    $("#ddlCoPaymentOn").prop("selectedIndex", "0").val();
    $("#txtCoPaymentIn").val('');
    $("#ddlCurrency").prop("selectedIndex", "0").val();
    $("#ddlAllowPartialPay").prop("selectedIndex", "0").val();
}


