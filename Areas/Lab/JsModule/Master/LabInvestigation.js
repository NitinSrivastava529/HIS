$(document).ready(function () {
    CloseSidebar();
    Onload();
    $('#ddlSamplesdata').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        filterBehavior: 'text',
        filterPlaceholder: 'Search',
        enableCaseInsensitiveFiltering: true,
        includeFilterClearBtn: false
    });
    $('#txtInvestName').keyup(function (e) {
        var txtVal = $(this).val();
        $('#txtInvestReportName').val(txtVal);
    });

    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblTestDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#divInvestType").removeClass('col-sm-6');
    $("#divInvestType").addClass('col-sm-12');

    $("#ddlSampleoption").change(function () {
        var selectedval = $('#ddlSampleoption option:selected').val();
        if (selectedval == "Not Required") {
            $("#txtSampleQty").prop('disabled', true);
            $("#txtSampleRemark").prop('disabled', true);
            $("#ddlSampleTemp").prop('disabled', true); 
            $("#txtSampleQty").removeAttr('style');
            $("#txtSampleRemark").removeAttr('style');
            $("#ddlSampleTemp").removeAttr('style');
            $("#ddlSampleContainer").val("N/A").prop('selected', true);
        }
        else {
            $("#txtSampleQty").prop('disabled', false);
            $("#txtSampleRemark").prop('disabled', false);
            $("#ddlSampleTemp").prop('disabled', false);

            $("#txtSampleQty").css('border', '1px solid red');
            $("#txtSampleRemark").css('border', '1px solid red');
            $("#ddlSampleTemp").css('border', '1px solid red');
        }
    });
});

function Onload() {
    var url = config.baseUrl + "/api/Lab/mInvestigationQueries";
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
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCategory").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlCategory").append($("<option></option>").val(value.CatID).html(value.CatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlTestSubCategory").append($("<option selected></option>").val("ALL").html("ALL"));
                    $("#ddlTestSubCategory").append($("<option></option>").val("0").html("Please Select"));
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlTestSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                        $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    
                    $.each(data.ResultSet.Table2, function (key, value) {
                        $("#ddlSamplesdata").append($("<option></option>").val(value.samp_code).html(value.samp_type));
                        $("#ddlSamplesdata").multiselect('rebuild');
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

function BindSubCategoryByCategory() {
    
    var catId = $("#ddlCategory").val();
    var url = config.baseUrl + "/api/Lab/mInvestigationQueries";
    var objBO = {};
    objBO.Logic = "BindSubCategoryByCategory";
    objBO.catid = catId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlSubCategory").empty();
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select"));
                    if (Object.keys(data.ResultSet.Table).length > 0) {
                        $.each(data.ResultSet.Table, function (key, value) {
                            $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                        });
                    }
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

function InsertUpdateLabInvestigation() {
    
    if (validation()) {
        var arrsampledata = [];
        var objBO = {};
        var btntext = $("#btnInvestigationSample").val();
        if (btntext== "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext == "Update") {
            objBO.Logic = "Update";
        }
        var url = config.baseUrl + "/api/Lab/mInvestigationInsertUpdate";
        objBO.catid = $("#ddlCategory option:selected").val();
        objBO.subcateid = $("#ddlSubCategory option:selected").val();
        objBO.investcode = $("#txtInvestCode").val();
        objBO.investname = $("#txtInvestName").val();
        objBO.investreportname = $("#txtInvestReportName").val();
        objBO.investtype = $("#ddlInvestType option:selected").val();
        objBO.bookfor = $("#ddlBookFor option:selected").val();
        objBO.repotytype = $("#ddlReportType option:selected").val();
        objBO.rate = $("#txtRate").val();
        objBO.cost = $("#txtCost").val();
        objBO.maxtime = $("#txtMaxTime").val();
        objBO.sampleoption = $("#ddlSampleoption option:selected").val();
        objBO.sampleqty = $("#txtSampleQty").val();
        objBO.sampleremark = $("#txtSampleRemark").val();
        objBO.sampletemp = $("#ddlSampleTemp option:selected").val();
        objBO.samplecontainer = $("#ddlSampleContainer option:selected").val();
        objBO.sampletype = $("#txtSampleType").val();
        objBO.defaultsample = $("#txtDefaultSample").val();
        objBO.testprep = $("#txttestPrep").val();
        objBO.abouttest = $("#txtAboutTest").val();

        $('#ddlSamplesdata :selected').each(function () {
            arrsampledata.push($(this).val());
        });

        if (arrsampledata.length > 0) {
            objBO.samplelinkdata = arrsampledata.join();
            objBO.defaultsample = $("#ddlDefaultSample option:selected").text();
        }
        else {
            objBO.samplelinkdata = "-";
            objBO.defaultsample = "-";
        }
        if ($('#chkIsOutSource:checkbox:checked').length > 0) {
            objBO.isoutsource = 'Y';
        }
        else {
            objBO.isoutsource = 'N';
        }
        if ($('#chkIncementFlag:checkbox:checked').length > 0) {
            objBO.incrementflag = 'Y';
        }
        else {
            objBO.incrementflag = 'N';
        }
        if ($('#chkPromotionFlag:checkbox:checked').length > 0) {
            objBO.promotionflag = 'Y';
        }
        else {
            objBO.promotionflag = 'N';
        }
        if ($('#chkReportFlag:checkbox:checked').length > 0) {
            objBO.reportflag = 'Y';
        }
        else {
            objBO.reportflag = 'N';
        }
        if ($('#chkIgnorTat:checkbox:checked').length > 0) {
            objBO.ignortat = 'Y';
        }
        else {
            objBO.ignortat = 'N';
        }
        if ($('#chkInoutRequired:checkbox:checked').length > 0) {
            objBO.inoutrequired = 'Y';
        }
        else {
            objBO.inoutrequired = 'N';
        }
        if ($('#chkDisplayInWeb:checkbox:checked').length > 0) {
            objBO.displayinweb = 'Y';
        }
        else {
            objBO.displayinweb = 'N';
        }
        if ($('#chkConsentFlag:checkbox:checked').length > 0) {
            objBO.consentflag = 'Y';
        }
        else {
            objBO.consentflag = 'N';
        }
        if ($('#chkPrintSampleInReport:checkbox:checked').length > 0) {
            objBO.printsampleinreport = 'Y';
        }
        else {
            objBO.printsampleinreport = 'N';
        }
        objBO.login_id = Active.userId;
        //objBO.warehouseCartId = Active.warehouseId
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Test investigation saved successfully');
                    ClearValues();
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

function SearchBySubCategory() {
    $("#tblTestDetails tbody").empty();
    var htmldata = "";
    var url = config.baseUrl + "/api/Lab/mInvestigationQueries";
    var objBO = {};
    objBO.Logic = "GetTestBySubCategory";
    objBO.subcateid = $("#ddlTestSubCategory option:selected").val();
    objBO.prm_1 = $("#ddlStatus option:selected").val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + val.testcode + '</td>';
                        htmldata += '<td>' + val.TestName + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnEditInvestigation' + key + '" onclick=EditInvestigationDetails("' + val.testcode + '")><i class="fa fa-edit fa-lg  text-blue"></i></a>';
                        htmldata += '</tr>';
                    });
                    $("#tblTestDetails").append(htmldata);
                }
                else {
                    htmldata += '<tr>';
                    htmldata += '<td colspan="3" class="text-center text-red">No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblTestDetails").append(htmldata);
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

function EditInvestigationDetails(testcode) {
    var url = config.baseUrl + "/api/Lab/mInvestigationQueries";
    var objBO = {};
    objBO.Logic = "EditInvestigation";
    objBO.investcode = testcode
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCategory").val(data.ResultSet.Table[0].CatId);
                    $('#ddlCategory').trigger('change');
                    $("#ddlSubCategory").val(data.ResultSet.Table[0].SubCatId).prop('selected', true);
                    $("#divInvestCode").show();

                    $("#divInvestType").removeClass('col-sm-12');
                    $("#divInvestType").addClass('col-sm-6');
                    
                    $("#txtInvestCode").val(data.ResultSet.Table[0].testcode);
                    $("#txtInvestCode").prop('disabled', true);
                    $("#txtInvestName").val(data.ResultSet.Table[0].TestName);
                    $("#txtInvestReportName").val(data.ResultSet.Table[0].nameonreport);
                    $("#ddlInvestType").val(data.ResultSet.Table[0].testType);
                    $("#ddlBookFor").val(data.ResultSet.Table[0].bookFor);
                    $("#ddlReportType").val(data.ResultSet.Table[0].r_type);
                    $("#txtRate").val(data.ResultSet.Table[0].offer_rate);
                    $("#txtCost").val(data.ResultSet.Table[0].test_perfcost);
                    $("#txtMaxTime").val(data.ResultSet.Table[0].max_time);
                    if (data.ResultSet.Table[0].sample_option == "Not Required") {

                        $("#ddlSampleoption").val(data.ResultSet.Table[0].sample_option);
                        $("#txtSampleQty").val(data.ResultSet.Table[0].sample_qty);
                        $("#txtSampleRemark").val(data.ResultSet.Table[0].sample_remark);
                        $("#ddlSampleTemp").val(data.ResultSet.Table[0].sample_temp_required);

                        $("#txtSampleQty").prop('disabled', true);
                        $("#txtSampleRemark").prop('disabled', true);
                        $("#ddlSampleTemp").prop('disabled', true); 

                        $("#txtSampleQty").removeAttr('style');
                        $("#txtSampleRemark").removeAttr('style');
                        $("#ddlSampleTemp").removeAttr('style');
                    }
                    else {
                        $("#ddlSampleoption").val(data.ResultSet.Table[0].sample_option);
                        $("#txtSampleQty").val(data.ResultSet.Table[0].sample_qty);
                        $("#txtSampleRemark").val(data.ResultSet.Table[0].sample_remark);
                        $("#ddlSampleTemp").val(data.ResultSet.Table[0].sample_temp_required);

                        $("#txtSampleQty").prop('disabled', false);
                        $("#txtSampleRemark").prop('disabled', false);
                        $("#ddlSampleTemp").prop('disabled', false);

                        $("#txtSampleQty").css('border', '1px solid red');
                        $("#txtSampleRemark").css('border', '1px solid red');
                        $("#ddlSampleTemp").css('border', '1px solid red');
                    }
                    
                    $("#ddlSampleContainer").val(data.ResultSet.Table[0].sample_container);
                    $("#txttestPrep").val(data.ResultSet.Table[0].test_preperation);
                    $("#txtAboutTest").val(data.ResultSet.Table[0].about_test);

                    data.ResultSet.Table[0].out_source == 'Y' ? $('#chkIsOutSource').prop('checked', true) : $('#chkIsOutSource').prop('checked', false);
                    data.ResultSet.Table[0].Increment_flag == 'Y' ? $('#chkIncementFlag').prop('checked', true) : $('#chkIncementFlag').prop('checked', false);
                    data.ResultSet.Table[0].promo_flag == 'Y' ? $('#chkPromotionFlag').prop('checked', true) : $('#chkPromotionFlag').prop('checked', false);
                    data.ResultSet.Table[0].report_flag == 'Y' ? $('#chkReportFlag').prop('checked', true) : $('#chkReportFlag').prop('checked', false);
                    data.ResultSet.Table[0].IgnoreTAT == 'Y' ? $('#chkIgnorTat').prop('checked', true) : $('#chkIgnorTat').prop('checked', false);
                    data.ResultSet.Table[0].InOutRequired == 'Y' ? $('#chkInoutRequired').prop('checked', true) : $('#chkInoutRequired').prop('checked', false);
                    data.ResultSet.Table[0].web_flag == 'Y' ? $('#chkDisplayInWeb').prop('checked', true) : $('#chkDisplayInWeb').prop('checked', false);
                    data.ResultSet.Table[0].PrintSampleInReport == 'Y' ? $('#chkPrintSampleInReport').prop('checked', true) : $('#chkPrintSampleInReport').prop('checked', false);
                    data.ResultSet.Table[0].consent_flag == 'Y' ? $('#chkConsentFlag').prop('checked', true) : $('#chkConsentFlag').prop('checked', false);

                    var links = data.ResultSet.Table[0].sample_Links;
                    if (links != "" && links != null && typeof links != 'undefined') {
                        var data1 = links.split(',');
                        $('#ddlSamplesdata').multiselect('deselectAll', false);
                        $("#ddlSamplesdata").multiselect('select', data1);
                        $("#ddlSamplesdata").multiselect('rebuild');
                    }

                    $("#ddlDefaultSample").empty();
                    $('#ddlSamplesdata :selected').each(function () {
                        if ($(this).text() == data.ResultSet.Table[0].default_sample) {
                            $("#ddlDefaultSample").append($("<option selected></option>").val($(this).val()).html($(this).text()));
                        }
                        else {
                            $("#ddlDefaultSample").append($("<option></option>").val($(this).val()).html($(this).text()));
                        }
                    });
                    $("#btnInvestigationSample").val('Update');
                }
                else {
                    MsgBox('No Data Found');
                }
            }
            else {
                MsgBox('No Data Found');
            }
        },
        complete: function (data) {
            //            
            //$("#ddlSubCategory").val(JSON.parse(data.responseText).ResultSet.Table[0].SubCatId).prop('selected', 'selected');
            //$("#ddlSubCategory").trigger("chosen:updated");
            //$("#ddlSubCategory").val(data.ResultSet.Table[0].SubCatId).prop('selected', true);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function validation() {
    var arrsamplelinks = [];
    var catid = $("#ddlCategory option:selected").val();
    var subcatid = $("#ddlSubCategory option:selected").val();
    //var investcode = $("#txtInvestCode").val();
    var investname = $("#txtInvestName").val();
    var investreprtname = $("#txtInvestReportName").val();
    var investtype = $("#ddlInvestType option:selected").val();
    var bookfor = $("#ddlBookFor option:selected").val();
    var repotytype = $("#ddlReportType option:selected").val();
    //var rate = $("#txtRate").val();
    var cost = $("#txtCost").val();
    var maxtime = $("#txtMaxTime").val();
    var sampleoption = $("#ddlSampleoption option:selected").val();
    var sampleqty = $("#txtSampleQty").val();
    var sampleremark = $("#txtSampleRemark").val();
    var sampletemp = $("#ddlSampleTemp option:selected").val();
    var samplecontainer = $("#ddlSampleContainer option:selected").val();
    //var testprep = $("#txttestPrep").val();
    //var abouttest = $("#txtAboutTest").val();
    $('#ddlSamplesdata :selected').each(function () {
        arrsamplelinks.push($(this).val());
    });

    if (catid == "0") {
        alert('Please select category');
        $("#ddlCategory").css('border', '1px solid red');
        return false;
    }
    if (subcatid == "0") {
        alert('Please select sub category');
        $("#ddlSubCategory").css('border', '1px solid red');
        return false;
    }
    //if (investcode == "") {
    //    alert('Please enter test code');
    //    $("#txtInvestCode").css('border', '1px solid red');
    //    return false;
    //}
    if (investtype == "0") {
        alert('Please select investigation type');
        $("#ddlInvestType").css('border', '1px solid red');
        return false;
    }
    if (investname == "") {
        alert('Please enter investigation name');
        $("#txtInvestName").css('border', '1px solid red');
        return false;
    }
    if (investreprtname == "") {
        alert('Please enter report name');
        $("#txtInvestReportName").css('border', '1px solid red');
        return false;
    }
    if (bookfor == "0") {
        alert('Please select book for');
        $("#ddlBookFor").css('border', '1px solid red');
        return false;
    }
    if (repotytype == "0") {
        alert('Please select report type');
        $("#ddlReportType").css('border', '1px solid red');
        return false;
    }
    if (cost == "") {
        alert('Please enter cost');
        $("#txtCost").css('border', '1px solid red');
        return false;
    }
    if (maxtime == "") {
        alert('Please enter max time');
        $("#txtMaxTime").css('border', '1px solid red');
        return false;
    }
    if (sampleoption == "0") {
        alert('Please select sample option');
        $("#ddlSampleoption").css('border', '1px solid red');
        return false;
    }
    if (samplecontainer == "0") {
        alert('Please select sample container');
        $("#ddlSampleContainer").css('border', '1px solid red');
        return false;
    }

    if (sampleoption == "Required") {
        if (arrsamplelinks.length == 0) {
            alert('Please select at least one sample links');
            $("#btndefault").css('border', '1px solid red');
            return false;
        }
        if (sampleqty == "") {
            alert('Please enter sample quantity');
            $("#txtSampleQty").css('border', '1px solid red');
            return false;
        }
        if (sampleremark == "") {
            alert('Please enter sample remark');
            $("#txtSampleRemark").css('border', '1px solid red');
            return false;
        }
        if (sampletemp == "0") {
            alert('Please select sample temperature');
            $("#ddlSampleTemp").css('border', '1px solid red');
            return false;
        }


    }


    return true;
}

function ClearValues() {
    $("#ddlCategory").prop("selectedIndex", 0); //.val()
    $("#ddlSubCategory").prop("selectedIndex", 0);
    $("#txtInvestCode").val('');
    $("#txtInvestName").val('');
    $("#txtInvestReportName").val('');
    $("#ddlInvestType").prop("selectedIndex", 0);
    $("#ddlReportType").prop("selectedIndex", 0);
    $("#txtRate").val('');
    $("#txtCost").val('');
    $("#txtMaxTime").val('');
    $("#ddlSampleoption").prop("selectedIndex", 0);
    $("#txtSampleQty").val('');
    $("#txtSampleRemark").val('');
    $("#ddlSampleTemp").prop("selectedIndex", 0);
    $("#ddlSampleContainer").prop("selectedIndex", 0);
    $("#txttestPrep").val('');
    $("#txtAboutTest").val('');
    $('#chkIsOutSource').removeAttr('checked');
    $('#chkIncementFlag').removeAttr('checked');
    $('#chkPromotionFlag').removeAttr('checked');
    $('#chkReportFlag').removeAttr('checked');
    $('#chkIgnorTat').removeAttr('checked');
    $('#chkInoutRequired').removeAttr('checked');
    $('#chkDisplayInWeb').removeAttr('checked');
    $('#chkConsentFlag').removeAttr('checked');
    $('#chkPrintSampleInReport').removeAttr('checked');
    $('#ddlSamplesdata').multiselect('deselectAll', false);
    $("#ddlSamplesdata").multiselect('rebuild');
    $("#ddlDefaultSample").empty();
    $("#btnInvestigationSample").val('');
    $("#btnInvestigationSample").val('Save');
    $("#divInvestCode").hide();
    $("#divInvestType").removeClass('col-sm-6');
    $("#divInvestType").addClass('col-sm-12');
}



