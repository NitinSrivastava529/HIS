$(document).ready(function () {
    CloseSidebar();    
    OnLoad();
    $('#txtSeachState').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblStateDetails tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
    $('#txtSeachDistrict').on('keyup', function () {
        
        var val = $(this).val().toLowerCase();
        $('#tblDistrictDetails tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });    
});

function OnLoad() {
    var url = config.baseUrl + "/api/master/mStateDistrictQueries";
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
                    $("#ddlCountry").empty();
                    $("#ddlState").empty();
                    $.each(data.ResultSet.Table, function (k, v) {
                        $("#ddlCountry").append($("<option></option>").val("0").html("--Please Select--"));
                        $("#ddlState").append($("<option></option>").val("").html("--Please Select--"));
                        $.each(data.ResultSet.Table, function (key, value) {
                            $("#ddlCountry").append($("<option></option>").val(value.CountryId).html(value.CountryName));
                        });
                        $.each(data.ResultSet.Table1, function (key, value) {
                            $("#ddlState").append($("<option></option>").val(value.StateCode).html(value.StateName));
                        });
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
function AddUpdateState() {
    if (validateState()) {
        var objBO = {};
        var url = config.baseUrl + "/api/master/mStateDistrictInsertUpdate";
        var btnname = $("#btndaddupdateState").val();        
        if (btnname == "Save") {
            objBO.Logic = "InsertState";
            objBO.autoid = 0;            
        }
        else {            
            objBO.Logic = "UpdateState";
            objBO.autoid = $("#hidStateautoid").val();
        }
        objBO.CountryId = $("#ddlCountry option:selected").val();
        objBO.StateName = $("#txtStateName").val();        
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var autoid = 0;
                var splitval = data.split('|');
                if (splitval[0] == '1' && splitval[1] == 'success') {
                    autoid = splitval[2];
                    BindState(autoid);
                    alert('State created successfully');
                }
                else if (splitval[0] == '2' && splitval[1] == 'success') {
                    autoid = splitval[2];
                    BindState(autoid);
                    alert('State Updated successfully');
                }
                else {
                    alert(data);
                }
                OnLoad();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function BindState(autoid) {
    var url = config.baseUrl + "/api/master/mStateDistrictQueries";
    var objBO = {};
    if (autoid > 0) {
        objBO.autoid = autoid;
    }
    else {
        objBO.autoid = 0;
    }
    objBO.Logic = "GetState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var countryname = ""
            $("#tblStateDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        if (countryname != v.contry_Name) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="4" style="font-weight:bold;background-color:#d1ebfb">' + v.contry_Name + '</td>';
                            htmldata += '</tr>';
                            countryname = v.contry_Name;
                        }
                        htmldata += '<tr>';
                        htmldata += '<td>' + v.state_name + '</td>';                        
                        htmldata += '<td><a href = "javascript:void(0)" id = "btn' + k + '" data-autoid="' + v.RecId + '" data-statecode="' + v.state_code + '"  onclick = "selectRow(this);BindDistrictByStateCode(this)"><i class="fa fa-arrow-circle-o-right fa-lg text-green"></i></a ></td>';
                        htmldata += '<td><a href = "javascript:void(0)" id = "btn' + k + '" data-autoid="' + v.RecId + '" onclick = "selectRow(this);EditState(this)"><i class="fa fa-pencil fa-lg text-red"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblStateDetails tbody").append(htmldata);
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

function EditState(element) {
    var autoid = $(element).data('autoid');
    var url = config.baseUrl + "/api/master/mStateDistrictQueries";
    var objBO = {};
    if (autoid > 0) {
        objBO.autoid = autoid;
    }   
    objBO.Logic = "EditState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {                   
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCountry").val(data.ResultSet.Table[0].country_id);
                    $("#txtStateName").val(data.ResultSet.Table[0].state_name);
                    $("#hidStateautoid").val(data.ResultSet.Table[0].RecId)
                    $("#btndaddupdateState").val('Update');
                    $("#btndaddupdateState").text('Update');
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

function BindDistrictByStateCode(element) {
    var url = config.baseUrl + "/api/master/mStateDistrictQueries";
    var objBO = {};    
    var autoid = $(element).data('autoid');
    var statecode = $(element).data('statecode');
    if (autoid > 0) {
        objBO.autoid = autoid;        
    }
    else {
        objBO.autoid = 0;
    }
    objBO.StateCode = statecode;
    objBO.Logic = "GetDistrictByStateCode";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var htmldata = "";
            var statename = ""
            $("#tblDistrictDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {
                        $("#ddlState").val(data.ResultSet.Table[0].state_code);
                        if (statename != v.state_name) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="4" style="font-weight:bold;background-color:#d1ebfb">' + v.state_name + '</td>';
                            htmldata += '</tr>';
                            statename = v.state_name;
                        }
                        htmldata += '<tr>';
                        htmldata += '<td>' + v.distt_name + '</td>';                        
                        htmldata += '<td><a href = "javascript:void(0)" id = "btn' + k + '" data-autoid="' + v.recId + '" onclick = "selectRow(this);EditDistrict(this)"><i class="fa fa-pencil fa-lg text-red"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblDistrictDetails tbody").append(htmldata);
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

function AddUpdateDistrict() {
    if (validateDistrict()) {
        var objBO = {};
        var url = config.baseUrl + "/api/master/mStateDistrictInsertUpdate";
        var btnname = $("#btndaddupdatedistrict").val();
        if (btnname == "Save") {
            objBO.Logic = "InsertDistrict";
            objBO.autoid = 0;                     
        }
        else {
            objBO.Logic = "UpdateDistrict";
            objBO.autoid = $("#hiddistrictautoid").val();
        }
        objBO.StateCode = $("#ddlState option:selected").val();  
        objBO.DistrictName = $("#txtDistrictName").val();
        objBO.login_id = Active.userId;
        objBO.hosp_id = Active.unitId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                var autoid = 0;
                var splitval = data.split('|');
                if (splitval[0] == '1' && splitval[1] == 'success') {
                    autoid = splitval[2];
                    BindDistrict(autoid);
                    alert('District created successfully');
                }
                else if (splitval[0] == '2' && splitval[1] == 'success') {
                    autoid = splitval[2];
                    BindDistrict(autoid);
                    alert('District Updated successfully');
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

function BindDistrict(autoid) {
    var url = config.baseUrl + "/api/master/mStateDistrictQueries";
    var objBO = {};
    if (autoid > 0) {
        objBO.autoid = autoid;
    }
    else {
        objBO.autoid = 0;
    }
    objBO.Logic = "GetDistrict";    
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            var htmldata = "";
            var statename = "";
            $("#tblDistrictDetails tbody").empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, v) {                        
                        if (statename != v.state_name) {
                            htmldata += '<tr>';
                            htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb">' + v.state_name + '</td>';
                            htmldata += '</tr>';
                            statename = v.state_name;
                        }
                        htmldata += '<td>' + v.distt_name + '</td>';                       
                        htmldata += '<td><a href = "javascript:void(0)" id = "btnDistrict' + k + '" data-autoid="' + v.recid + '"  onclick = "selectRow(this);EditDistrict(this)"><i class="fa fa-edit fa-lg text-red"></i></a ></td>';
                        htmldata += '</tr>';
                    });
                    $("#tblDistrictDetails tbody").append(htmldata);
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

function EditDistrict(element) {
    var url = config.baseUrl + "/api/master/mStateDistrictQueries";
    var objBO = {};
    var autoid = $(element).data('autoid');    
    objBO.autoid = autoid; 
    objBO.Logic = "EditDistrict"; 
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
                                   
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {                    
                    $("#ddlState").val(data.ResultSet.Table[0].state_code);
                    $("#txtDistrictName").val(data.ResultSet.Table[0].distt_name);
                    $("#hiddistrictautoid").val(data.ResultSet.Table[0].recid);                   
                    $("#btndaddupdatedistrict").val('Update');
                    $("#btndaddupdatedistrict").text('Update');
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


function validateState() {
    var state = $("#txtStateName").val();
    var country = $("#ddlCountry option:selected").val();
    if (country == "0") {
        alert('Please select country');
        return false;
    }
    if (state == "") {
        alert('Please enter state name')
        return false;
    }
    return true;
}
function validateDistrict() {
    var stateid = $("#ddlState option:selected").val();
    var DistrictName = $("#txtDistrictName").val();
    if (stateid == "") {
        alert('Please select state');
        return false;
    }
    if (DistrictName == "") {
        alert('Please enter district name')
        return false;
    }   
    return true;
}