
$(document).ready(function () {
    $('#tblLabTrasportTime tbody').on('click', 'button', function () {      
        var autoid = $(this).data('autoid');
        DeleteLabTrasport(autoid);
    });
    GetLabInfo();
    GetLabTrasportTime();
});
function GetLabTrasportTime() {
    var url = config.baseUrl +"/api/Lab/mObservationQueries";
    var objBO = {};
    objBO.Logic = "GetLabTrasportTime";
    $.ajax({
        method: "POST",
        url: url,        
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblLabTrasportTime tbody').empty();         
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count+"</td>";
                        tbody += "<td>" + val.labcode+"</td>";
                        tbody += "<td>" + val.dispatch_lab+"</td>";
                        tbody += "<td>" + val.inshift+"</td>";
                        tbody += "<td>" + val.outshift+"</td>";
                        tbody += "<td>" + val.transport_time + "</td>";                        
                        tbody += "<td>" + val.cr_date + "</td>";                      
                        tbody += "<td><button class='btn btn-danger btn-xs id='btndelete' data-autoid="+ val.autoid+"><span class='fa fa-trash'></button></td >";                  
                        tbody += "</tr>";                    
                    });
                    $('#tblLabTrasportTime tbody').append(tbody);    
                    
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
function GetLabInfo() {
    var url = config.baseUrl + "/api/Lab/mObservationQueries";
    var objBO = {};
    objBO.Logic = "GetLabInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {                
            $('#ddlFrom').empty().append($('<option></option>').val("0").html("Select"));
            $('#ddlTo').empty().append($('<option></option>').val("0").html("Select"));
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (k, val) {
                        $('#ddlFrom').append($('<option></option>').val(val.lab_id).html(val.lab_name));
                    });
                    $.each(data.ResultSet.Table1, function (k, val) {
                        $('#ddlTo').append($('<option></option>').val(val.lab_id).html(val.lab_name));
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
function LabTrasportTime() {
    var objBO = {};
    var url = config.baseUrl + "/api/Lab/LabTransportTime";
    objBO.autoid = 0;
    objBO.dispatch_lab = $('#ddlFrom option:selected').val();
    objBO.labcode = $('#ddlTo option:selected').val();   
    objBO.inshift = $('#txtInShift').val();
    objBO.outshift = $('#txtOutShift').val();
    objBO.transport_time = $('#txtLogisticTime').val(); 
    objBO.login_id = Active.userId;
    objBO.Logic = "InsertUpdate";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                GetLabTrasportTime();
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
function DeleteLabTrasport(autoid) {
    if (confirm('Are you Sure To delete this Record?')) {
        var objBO = {};
        var url = config.baseUrl + "/api/Lab/LabTransportTime";
        objBO.autoid = autoid;
        objBO.Logic = "Delete";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                GetLabTrasportTime();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
  
}