$(document).ready(function () {
    CloseSidebar();
    Onload();
    $("#txtPanicLow").val("0");
    $("#txtPanicHigh").val("0");
    $("#txtSearchInvestigation").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblinvestigation tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#txtSearchObservation").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblObservationDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#btnUpdateObservation").hide();

});

function Onload() {
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
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
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $("#ddlobservation").append($("<option></option>").val("0").html("Please Select"));
                    $("#ddlobservation").prop('selectedIndex', '0');
                    $.each(data.ResultSet.Table1, function (key, value) {
                        $("#ddlobservation").append($("<option></option>").val(value.ObservationId).html(value.ObservationName)).select2();;
                    });
                }
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    $("#ddlMachine").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table2, function (key, value) {
                        $("#ddlMachine").append($("<option></option>").val(value.machineid).html(value.machinename));
                    });
                }
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    $("#ddlLabName").append($("<option></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table3, function (key, value) {
                        $("#ddlLabName").append($("<option></option>").val(value.LabCode).html(value.LabName));
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
function GetInvestigations() {
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var objBO = {};
    var subcat = $("#ddlSubCategory option:selected").val();
    if (subcat == "0") {
        alert('please select subcategory');
        return false;
    }
    objBO.Logic = "GetInvestigations";
    objBO.subcatid = subcat;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            $("#tblinvestigation tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + v.TestName + '</td>';
                        htmldata += '<td><a href="javascript:void(0)" id="btnView' + k + '" data-testcode="' + v.testcode + '" onclick="selectRow(this);ViewDetails(this)"><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a>';
                        htmldata += '</tr>';
                    });
                    $("#tblinvestigation tbody").append(htmldata);
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
function ViewDetails(element) {
    
    var testname = $(element).closest('tr').find('td:eq(0)').text();
    var testcode = $(element).closest('tr').find('td:eq(1)').find('a').data('testcode')
    GetObservationDetails(testcode);
    $("#spntestname").text('(' + testname + ')');
    $("#spnInterpretation").text('(' + testname + ')');
    $("#spnComment").text('(' + testname + ')');
}

function AddObservation() {
    if (validationObservation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/Lab/mObservationInsertUpdate";
        objBO.Logic = "Insert";
        objBO.observationid = "0";
        objBO.observationname = $("#txtObservationName").val();
        objBO.methodname = $("#txtMethodName").val();
        objBO.decimalplace = $("#txtDecimalPlace").val();
        objBO.valuetype = $("#ddlValueTypeName option:selected").val();
        objBO.testunit = $("#txtTestUnitval").val();
        objBO.interpretation = "-";
        objBO.defaultvalue = $("#txtDefaultValue").val();
        objBO.isprintable = $("input[name='IsPrintable']:checked").val();
        objBO.isautoapprove = $("input[name='IsAutoAppove']:checked").val();
        objBO.isdeltarequired = $("input[name='IsDeltaRequired']:checked").val();
        objBO.isactive = $("input[name='IsActive']:checked").val();
        objBO.testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Observation created successfully');
                    $("#myModal input:text,textarea").val('');
                    BindObservation();
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
function UpdateObservation() {
    
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mObservationInsertUpdate";
    var methodname = $("#txtMethod").val();
    var decimalplace = $("#txtDecVal").val();
    var valueType = $("#ddlValueType option:selected").val();
    var testunit = $("#txtTestUnit").val();

    if (valueType == "0") {
        alert('Please select value type');
        return false;
    }
    if (testunit == "") {
        alert('Please enter test unit');
        return false;
    }
    if (methodname == "") {
        alert('Please enter method name');
        return false;
    }
    if (decimalplace == "") {
        alert('Please enter decimal place');
        return false;
    }
    objBO.Logic = "Update";
    objBO.observationid = $("#hidupdobservationid").val();
    objBO.observationname = $("#hidupdobservationname").val();
    objBO.methodname = $("#txtMethod").val();
    objBO.interpretation = "-";
    objBO.decimalplace = $("#txtDecVal").val();
    objBO.valueType = valueType;
    objBO.testunit = testunit;
    if ($('#chkDelta').is(":checked")) {
        objBO.isdeltarequired = 1;
    }
    else {
        objBO.isdeltarequired = 0
    }
    objBO.defaultvalue = $("#hidupdDefaultVal").val();
    objBO.isprintable = $("#hidupdIsPrintable").val();
    objBO.isautoapprove = $("#hidupdIsAutoApprove").val();
    objBO.isactive = $("#hidupdIsActive").val();
    objBO.testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                alert('Observation updated successfully');
                $("#myModal input:text,textarea").val('');
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
function BindObservation() {
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var objBO = {};
    objBO.Logic = "BindDropdownObservation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlobservation").empty();
                    $("#ddlobservation").append($("<option selected></option>").val("0").html("Please Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlobservation").append($("<option></option>").val(value.ObservationId).html(value.ObservationName)).select2();
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
function validationObservation() {
    var obsname = $("#txtObservationName").val();
    var methodname = $("#txtMethodName").val();
    var decimalplace = $("#txtDecimalPlace").val();
    //var intrepretation = $("#txtInterpretation").val();
    //var defaultval = $("#txtDefaultValue").val();
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test name from left');
        return false;
    }
    if (obsname == "") {
        alert('please enter observation name');
        return false;
    }
    if (methodname == "") {
        alert('please enter method name');
        return false;
    }
    if (decimalplace == "") {
        alert('please enter decimal place');
        return false;
    }
    return true;
}

function AddInvestigationObservationLink() {
    if (validationInvestigationObservation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/Lab/mAddInvestigationObservationLink";
        objBO.observationid = $("#ddlobservation option:selected").val();
        objBO.testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
        objBO.isheader = 0;
        objBO.isbold = 0;
        objBO.isitalic = 0;
        objBO.isresultmandatory = 0;
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        objBO.Logic = "Insert";
        //objBO.warehouseCartId = Active.warehouseId
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    //alert('Investigation Observation linked successfully');
                    GetObservationDetails(objBO.testcode);
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
function GetObservationDetails(testCode) {
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var objBO = {};
    objBO.Logic = "GetObservation";
    objBO.testcode = testCode;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            $("#tblObservationDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnDelete' + k + '" data-testcode="' + v.testcode + '" data-observationid="' + v.ObservationId + '"  onclick = "selectRow(this);EditObservationDetails(this)"><i class="fa fa-edit fa-lg text-blue"></i></a ></td>';
                        htmldata += '<td>' + parseInt(k + 1) + '</td>';
                        htmldata += '<td>' + v.ObservationName + '</td>';
                        if (v.IsBold == false) {
                            htmldata += '<td><input type="checkbox" style="margin:0 3px 0;" /></td>';
                        }
                        else {
                            htmldata += '<td><input type="checkbox" checked style="margin:0 3px 0;" /></td>';
                        }
                        if (v.IsHeader == false) {
                            htmldata += '<td><input type="checkbox" style="margin:0 3px 0;"/></td>';
                        }
                        else {
                            htmldata += '<td><input type="checkbox" checked style="margin:0 3px 0;"/></td>';
                        }
                        if (v.IsItalic == false) {
                            htmldata += '<td><input type="checkbox" style="margin:0 3px 0;"/></td>';
                        }
                        else {
                            htmldata += '<td><input type="checkbox" checked style="margin:0 3px 0;"/></td>';
                        }
                        if (v.IsResultMandatory == false) {
                            htmldata += '<td><input type="checkbox" style="margin:0 3px 0;"/></td> ';
                        }
                        else {
                            htmldata += '<td><input type="checkbox" checked style="margin:0 3px 0;"/></td>';
                        }
                        htmldata += '<td><button style="height:15px;line-height:9px;" type="button" class="btn btn-warning btn-xs" id="btnUpdateInterpretation#' + k + '" onclick="ViewInterpretationModal(this)"><i class="fa fa-plus"></i> Interpretation</button></td>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnDelete' + k + '" data-testcode="' + v.testcode + '" data-observationid="' + v.ObservationId + '"  onclick = "selectRow(this);DeleteObservation(this)"><i class="fa fa-trash fa-lg text-red"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblObservationDetails tbody").append(htmldata);
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
function EditObservationDetails(element) {
    
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var objBO = {};
    var testcode = $(element).closest('tr').find('td:eq(0)').find('a').data('testcode');
    var observid = $(element).closest('tr').find('td:eq(0)').find('a').data('observationid');
    objBO.prm_1 = observid;
    objBO.prm_2 = testcode;
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "EditObservation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#txtMethod").val('');
                    $("#txtDecVal").val('');
                    $("#txtMethod").val(data.ResultSet.Table[0].method_name);
                    $("#txtDecVal").val(data.ResultSet.Table[0].decimalPlace);
                    $("#ddlValueType").val(data.ResultSet.Table[0].rValType);
                    $("#txtTestUnit").val(data.ResultSet.Table[0].rTestUnit);
                    $("#txtMethod1").val(data.ResultSet.Table[0].method_name);
                    $("#txtTestUnit1").val(data.ResultSet.Table[0].rTestUnit);
                    $("#hidupdobservationid").val(objBO.prm_1);//observationId
                    $("#hidupdobservationname").val(data.ResultSet.Table[0].ObservationName);
                    $("#hidupdDefaultVal").val(data.ResultSet.Table[0].default_value);
                    if (data.ResultSet.Table[0].AutoAppove == true) {
                        $("#hidupdIsAutoApprove").val(1);
                    }
                    else {
                        $("#hidupdIsAutoApprove").val(0);
                    }
                    if (data.ResultSet.Table[0].IsPrintable == true) {
                        $("#hidupdIsPrintable").val(1);
                    }
                    else {
                        $("#hidupdIsPrintable").val(0);
                    }
                    if (data.ResultSet.Table[0].IsActive == true) {
                        $("#hidupdIsActive").val(1);
                    }
                    else {
                        $("#hidupdIsActive").val(0);
                    }
                    $("#btnUpdateObservation").show();
                    if (data.ResultSet.Table[0].IsDeltaRequired == true) {
                        $("#chkDelta").prop('checked', true);
                    }
                    else {
                        $("#chkDelta").prop('checked', false);
                    }
                    CKEDITOR.instances["txtInterpretation"].setData(data.ResultSet.Table[0].Interpretation)
                    BindObservationInfo(objBO.prm_1);//observationId
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
function DeleteObservation(element) {
    var objBO = {};
    var testcode = $(element).closest('tr').find('td:eq(8)').find('a').data('testcode');
    var observid = $(element).closest('tr').find('td:eq(8)').find('a').data('observationid');
    var url = config.baseUrl + "/api/Lab/mObservationDelete";
    objBO.observationid = observid;
    objBO.testcode = testcode;
    objBO.isheader = 0;
    objBO.isbold = 0;
    objBO.isitalic = 0;
    objBO.isresultmandatory = 0;
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "Delete";
    if (confirm('Are you sure to delete')) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    var row = $(element).closest('tr');
                    row.remove();
                    alert('Observation deleted successfully');
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
function validationInvestigationObservation() {
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    var observation = $("#ddlobservation option:selected").val();
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test name from left');
        return false;
    }
    if (observation == "0") {
        alert('Please select observation');
        return false;
    }
    return true;
}

function AddObservationInfo() {
    if (validationObservationInfo()) {
        var objBO = {};
        var url = config.baseUrl + "/api/Lab/mObservationInfoInsertUpdate";
        objBO.observationid = $("#tblObservationDetails tbody").find('tr.select-row').find('td:eq(0)').find('a').data('observationid');
        objBO.LabCode = $("#ddlLabName option:selected").val();
        objBO.machineid = $("#ddlMachine option:selected").val();
        objBO.prefix = "-";
        objBO.gender = $("#ddlGender option:selected").val();
        objBO.agefrom = $("#txtFromAgeD").val();
        objBO.ageto = $("#txtToAgeD").val();
        objBO.ageto = $("#txtToAgeD").val();
        objBO.lowvalue = $("#txtMinValue").val();
        objBO.highvalue = $("#txtMaxValue").val();
        objBO.paniclow = $("#txtPanicLow").val();
        objBO.panichigh = $("#txtPanicHigh").val();
        objBO.displayreading = $("#txtDisplayReading").val();
        objBO.methodname = $("#txtMethod1").val();
        objBO.testunit = $("#txtTestUnit1").val();
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        objBO.Logic = "Insert";
        //objBO.isreflex = $("input[name='IsReflex']:checked").val();
        //objBO.warehouseCartId = Active.warehouseId
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    BindObservationInfo(objBO.observationid);
                    $('#divobservationinfo input').val('');
                    alert('Observation info created successfully');
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
function BindObservationInfo(observationid) {
    
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var objBO = {};
    objBO.Logic = "GetObservationInfo";
    if (observationid != "") {
        objBO.prm_1 = observationid;
    }
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            $("#tblObservationInfo tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + v.machinename + '</td>';
                        htmldata += '<td>' + v.ObservationName + '</td>';
                        htmldata += '<td>' + v.Prefix + '</td>';
                        htmldata += '<td>' + v.Gender + '</td>';
                        htmldata += '<td>' + v.age_from + '</td>';
                        htmldata += '<td>' + v.age_to + '</td>';
                        htmldata += '<td>' + v.low_value + '</td>';
                        htmldata += '<td>' + v.high_value + '</td>';
                        htmldata += '<td>' + v.panic_low + '</td>';
                        htmldata += '<td>' + v.panic_high + '</td>';
                        //if (v.IsReflex == false) {
                        //    htmldata += '<td><input type="checkbox" /></td>';
                        //}
                        //else {
                        //    htmldata += '<td><input type="checkbox" checked /></td>';
                        //}
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnDelete' + k + '" data-autoid="' + v.auto_id + '" data-observid="' + v.ObservationId + '"  onclick = "selectRow(this);DeleteObservationInfo(this)"><i class="fa fa-trash fa-lg text-red"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblObservationInfo tbody").append(htmldata);
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
function validationObservationInfo() {
    var labname = $("#ddlLabName option:selected").val();
    var machineno = $("#ddlMachine option:selected").val();
    var gender = $("#ddlGender option:selected").val();
    var observationid = $("#tblObservationDetails tbody").find('tr.select-row').find('td:eq(0)').find('a').data('observationid');
    var agefrom = $("#txtFromAgeD").val();
    var ageto = $("#txtToAgeD").val();
    var lowvalue = $("#txtMinValue").val();
    var highvalue = $("#txtMaxValue").val();
    var paniclow = $("#txtPanicLow").val();
    var panichigh = $("#txtPanicHigh").val();
    var methodname = $("#txtMethod1").val();
    var testunit = $("#txtTestUnit1").val();


    if (labname == "0") {
        alert('Please select Lab Name');
        return false;
    }
    if (machineno == "0") {
        alert('Please select machine');
        return false;
    }
    if (gender == "0") {
        alert('Please select gender');
        return false;
    }
    if (observationid <= 0 || observationid == "" || observationid == null || typeof (observationid) == 'undefined') {
        alert('Please select at least on observation from above row');
        return false;
    }
    if (agefrom == "") {
        alert('Please enter age from');
        return false;
    }
    if (ageto == "0") {
        alert('Please enter age to');
        return false;
    }
    if (lowvalue == "") {
        alert('Please enter low value');
        return false;
    }
    if (highvalue == "") {
        alert('Please enter high value');
        return false;
    }
    if (paniclow == "") {
        alert('Please enter panic low value');
        return false;
    }
    if (panichigh == "") {
        alert('Please enter panic high value');
        return false;
    }
    if (methodname == "") {
        alert('Please enter method name');
        return false;
    }
    if (testunit == "") {
        alert('Please enter test unit');
        return false;
    }
    return true;
}

function ViewInterpretationModal(element) {   
    var testcode = $(element).closest('tr').find('td:eq(0)').find('a').data('testcode');
    var observationid = $(element).closest('tr').find('td:eq(0)').find('a').data('observationid');
    $('#hidtestcodeIntpretation').val(testcode);
    $('#hidObservationidIntpretation').val(observationid);

    if ($(element).closest('tr').hasClass('select-row')) {
        $('#myModalInterpretation').modal('show');
    }
    else {
        $('#myModalInterpretation').modal('hide');
    }    
}

function UpdateInterpretation() {
    
    var objBO = {};
    var interpretation = CKEDITOR.instances['txtInterpretation'].getData();
    if (interpretation == "" || interpretation == null || typeof interpretation == 'undefined') {
        alert('Please enter interpretaion');
        return false;
    }
    objBO.observationname = "-";
    objBO.methodname = "-";
    objBO.decimalplace = "-";
    objBO.defaultvalue = "-";
    objBO.isprintable = 1;
    objBO.isautoapprove = 1;
    objBO.isdeltarequired = 1;
    objBO.isactive = 1;
    objBO.testcode = $('#hidtestcodeIntpretation').val();
    objBO.observationid = $('#hidObservationidIntpretation').val();
    objBO.interpretation = interpretation;
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "UpdateInterpretation";
    var url = config.baseUrl + "/api/Lab/mObservationInsertUpdate";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                CKEDITOR.instances['txtInterpretation'].setData();
                alert('Interpretation added successfully');
                $('#hidtestcodeIntpretation').val('');
                $('#hidObservationidIntpretation').val('');
                $('#myModalInterpretation').modal('hide');
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
function AssignReading() {
    var reading = CKEDITOR.instances['txtReading'].getData();
    if (reading == "" || reading == null || typeof reading == 'undefined') {
        alert('Please enter dispaly reading');
        return false;
    }
    $("#txtDisplayReading").val(reading);
    CKEDITOR.instances['txtReading'].setData('');
    $('#myModalReading').modal('hide');
}
function DeleteObservationInfo(element) {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mObservationInfoDelete";
    var autoid = $(element).closest('tr').find('td:eq(10)').find('a').data('autoid');
    var observationid = $(element).closest('tr').find('td:eq(10)').find('a').data('autoid');
    objBO.autoid = autoid;
    objBO.observationid = 0;
    objBO.machineid = "0";
    objBO.prefix = "-";
    objBO.gender = "-";
    objBO.agefrom = 0;
    objBO.ageto = 0;
    objBO.lowvalue = 0;
    objBO.highvalue = 0;
    objBO.paniclow = 0;
    objBO.panichigh = 0;
    objBO.displayreading = '-';
    objBO.login_id = Active.userId;
    objBO.hosp_id = Active.unitId;
    objBO.Logic = "Delete";
    if (confirm('Are you sure to delete this')) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    var row = $(element).closest('tr');
                    row.remove();
                    //alert('Observation info deleted successfully');
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
function SearchObservationByLabCode() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var observationid = $("#tblObservationDetails tbody").find('tr.select-row').find('td:eq(0)').find('a').data('observationid');
    var labcode = $("#ddlLabName option:selected").val();

    if (observationid <= 0 || observationid == "" || observationid == null || typeof (observationid) == 'undefined') {
        alert('Please select at least on observation from above row');
        return false;
    }
    if (labcode == "0") {
        alert('Please select Lab Name');
        return false;
    }
    objBO.Logic = "GetObservationInfoByLabCode";
    objBO.prm_1 = observationid;
    objBO.prm_2 = labcode;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            $("#tblObservationInfo tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td>' + v.machinename + '</td>';
                        htmldata += '<td>' + v.ObservationName + '</td>';
                        htmldata += '<td>' + v.Prefix + '</td>';
                        htmldata += '<td>' + v.Gender + '</td>';
                        htmldata += '<td>' + v.age_from + '</td>';
                        htmldata += '<td>' + v.age_to + '</td>';
                        htmldata += '<td>' + v.low_value + '</td>';
                        htmldata += '<td>' + v.high_value + '</td>';
                        htmldata += '<td>' + v.panic_low + '</td>';
                        htmldata += '<td>' + v.panic_high + '</td>';
                        //if (v.IsReflex == false) {
                        //    htmldata += '<td><input type="checkbox" /></td>';
                        //}
                        //else {
                        //    htmldata += '<td><input type="checkbox" checked /></td>';
                        //}
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnDelete' + k + '" data-autoid="' + v.auto_id + '" data-observid="' + v.ObservationId + '"  onclick = "selectRow(this);DeleteObservationInfo(this)"><i class="fa fa-trash fa-lg text-red"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblObservationInfo tbody").append(htmldata);
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

function ViewTestInterPretation() {
    $('#myModalTestInterpretation').modal('show');
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    objBO.Logic = "GetTestInterpretation";
    objBO.testcode = testcode;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    CKEDITOR.instances['txtTestInterpretation'].setData(data.ResultSet.Table[0].Interpretation);
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
function ViewTestComment() {
    $('#myModalTestComment').modal('show');
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    objBO.Logic = "GetTestInterpretation";
    objBO.testcode = testcode;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    CKEDITOR.instances['txtTestComment'].setData(data.ResultSet.Table[0].testComment);
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
function AddUpdateTestInterpretation() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mInsertUpdateTestInterpretation";
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test from left side');
        return false;
    }
    var testInterpretation = CKEDITOR.instances['txtTestInterpretation'].getData();
    if (testInterpretation == "" || typeof testInterpretation == 'undefined') {
        alert('Please enter intepretation value');
        return false;
    }
    objBO.investcode = testcode;
    objBO.text = testInterpretation;
    objBO.login_id = Active.userId;
    objBO.Logic = "InsertTestInterpretation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                CKEDITOR.instances['txtTestInterpretation'].setData('');
                $('#myModalTestInterpretation').modal('hide');
                alert('Test Interpretation addedd successfully');
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
function AddUpdateTestComment() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mInsertUpdateTestInterpretation";
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');

    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test from left side');
        return false;
    }
    var testInterpretation = CKEDITOR.instances['txtTestComment'].getData();
    if (testInterpretation == "" || typeof testInterpretation == 'undefined') {
        alert('Please enter comment');
        return false;
    }
    objBO.investcode = testcode;
    objBO.text = testInterpretation;
    objBO.login_id = Active.userId;
    objBO.Logic = "InsertTestComment";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                CKEDITOR.instances['txtTestComment'].setData('');
                $('#myModalTestComment').modal('hide');
                alert('Test Comment added successfully');
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
function DeleteTestInterpretation() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mDeleteTestInterpretation";
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test from left side');
        return false;
    }
    objBO.investcode = testcode;
    objBO.login_id = Active.userId;
    objBO.Logic = "DeleteTestInterpretation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                CKEDITOR.instances['txtTestInterpretation'].setData('');
                $('#myModalTestInterpretation').modal('hide');
                alert('Test Interpretation Deleted successfully');
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
function DeleteTestComment() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mDeleteTestInterpretation";
    var testcode = $("#tblinvestigation tbody").find('tr.select-row').find('td:eq(1)').find('a').data('testcode');
    if (testcode == "" || testcode == null || typeof testcode == 'undefined') {
        alert('Please select test from left side');
        return false;
    }
    objBO.investcode = testcode;
    objBO.login_id = Active.userId;
    objBO.Logic = "DeleteTestComment";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                CKEDITOR.instances['txtTestComment'].setData('');
                $('#myModalTestComment').modal('hide');
                alert('Test Comment Deleted successfully');
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



function ViewDefaultValues() {
    $("#myDefaultValueModal").modal('show');
    var observationid = $("#tblObservationDetails tbody").find('tr.select-row').find('td:eq(0)').find('a').data('observationid');
    var observationname = $("#tblObservationDetails tbody").find('tr.select-row').find('td:eq(2)').text();
    $("#spnDefaultValue").text('(' + observationname + ')');
    GetDefaultValue(observationid)
}
function AddDefaultValue() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mDefaultValueInsert";
    var observationid = $("#tblObservationDetails tbody").find('tr.select-row').find('td:eq(0)').find('a').data('observationid');
    var defaultvalue = $("#txtdefaultName").val();
    if (observationid <= 0 || observationid == "" || observationid == null || typeof (observationid) == 'undefined') {
        alert('Please select at least on observation from above row');
        return false;
    }
    if (defaultvalue == "") {
        alert('Please enter default value name');
        return false;
    }
    objBO.Logic = "Insert";
    objBO.observationid = observationid;
    objBO.defaultvalue = defaultvalue;
    objBO.login_id = Active.userId;
    objBO.autoid = 0;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'success') {
                $("#myDefaultValueModal input:text").val('');
                GetDefaultValue(observationid);
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
function GetDefaultValue(observationid) {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    objBO.Logic = "GetDefaultValue";
    objBO.prm_1 = observationid;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            $("#tblDefaultvalueInfo tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        htmldata += '<tr>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnDelete' + k + '" data-autoid="' + v.auto_id + '" onclick = "selectRow(this);DeleteDefaultValue(this)"><i class="fa fa-trash fa-lg text-red"></i></a ></td>';
                        htmldata += '<td>' + v.ObservationName + '</td>';
                        htmldata += '<td>' + v.DefaultValue + '</td>';
                        htmldata += '</tr>';
                    });
                    $("#tblDefaultvalueInfo tbody").append(htmldata);
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
function DeleteDefaultValue(element) {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/mDefaultValueInsert";
    var autoid = $("#tblDefaultvalueInfo tbody").find('tr.select-row').find('td:eq(0)').find('a').data('autoid');
    if (autoid <= 0 || autoid == "" || autoid == null || typeof (autoid) == 'undefined') {
        alert('Please select row');
        return false;
    }
    objBO.Logic = "Delete";
    objBO.observationid = 0;
    objBO.defaultvalue = "-";
    objBO.login_id = Active.userId;
    objBO.autoid = autoid;
    if (confirm('Are you sure to delete this row')) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    var row = $(element).closest('tr');
                    row.remove();
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


function onlynumeric(elem, val) {
    
    $(elem).val($(elem).val().replace(/[^\d]/g, ''));
    if (val == 1) {
        $("#txtFromAgeD").val(parseInt($(elem).val() * 365));
    }
    if (val == 2) {
        $("#txtToAgeD").val(parseInt($(elem).val() * 365));
    }

}
function numericdecimal(elem) {
    
    $(elem).val($(elem).val().replace(/[^\d.]/g, ''));
}

//$("#txtQty").keyup(function () {
//    var $this = $(this);
//    $this.val($this.val().replace(/[^\d.]/g, ''));
//});

