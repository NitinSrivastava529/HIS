$(document).ready(function () {
    FillCurrentDate('txtFromDate');
    FillCurrentDate('txtToDate');
});

function CovidCertificateReport() {
    
    var Mobile = $("#txtMobile").val();
    var UHID = $("#txtUHID").val();
    var ffrom = $("#txtFromDate").val();
    var tto = $("#txtToDate").val();
    var splitfrom = ffrom.split('-');
    var splitto = tto.split('-');
    
    var url = config.baseUrl + "/api/temp/CovidCertificateQueries";
    var objBO = {};

    if (Mobile == "" && UHID == "") {
        objBO.fromdate = splitfrom[0] + "/" + splitfrom[1] + "/" + splitfrom[2];
        objBO.todate = splitto[0] + "/" + splitto[1] + "/" + splitto[2];
    }
    if (Mobile != "" && UHID == "") {
        objBO.fromdate = null;
        objBO.todate = null;
        objBO.prm2 = Mobile;        
    }
    if (UHID != "" && Mobile == "") {
        objBO.fromdate = null;
        objBO.todate = null;
        objBO.prm1 = UHID;
    }
    if (Mobile != "" && UHID != "") {
        objBO.fromdate = null;
        objBO.todate = null;
        objBO.prm1 = UHID;
        objBO.prm2 = Mobile;
    }
    objBO.Logic = "CovidCertificate";
   
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblCovidCertificate tbody").empty();
            var tbody = "";
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += '<tr>';
                tbody += '<td>' + val.uhid + '</td>';
                tbody += '<td>' + val.patientName + '</td>';
                tbody += '<td>' + val.mobileno + '</td>';
                //tbody += '<td>' + val.VirCertPath + '</td>';
                //tbody += '<td>' + val.PhyCertPath + '</td>';
                //tbody += '<td>' + val.virprocertpath + '</td>';
                //tbody += '<td>' + val.phyprocertpath + '</td>';  
                tbody += '<td><a class="btn btn-info btn-xs" target="_blank" href="' + val.VirCertPath + '"><i class="fa fa-arrow-circle-down fa-lg "></i></a></td>';

                tbody += '</tr>';
            });
            $("#tblCovidCertificate tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function SearchByUHID() {
    var url = config.baseUrl + "/api/temp/GetPatientDetailByUHID";
    var objBO = {};
    objBO.UHID = $("#txtUHID").val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblUHIDDetails tbody").empty();
            var tbody = "";
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += '<tr>';
                tbody += '<td>' + val.PNAME + '</td>';
                tbody += '<td>' + val.Mobile + '</td>';
                tbody += '<td>' + val.Gender + '</td>';
                tbody += '<td>' + val.RelationName + '</td>';
                //tbody += '<td><button onclick=UpdateDetails("' + val.Patient_ID + '") class="btn btn-warning">Update</button></td>';
                tbody += '</tr>';
            });
            $("#tblUHIDDetails tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function UploadCertificate() {
    var rowlength = $("#tblUHIDDetails tbody tr").length;
    var filelength = $('#filecovidupload').get(0).files.length;
    var UHID = $("#txtUHID").val();

    if (UHID == "" || typeof UHID == 'undefined') {
        alert('Please enter UHID');
        return false;
    }
    if (rowlength <= 0) {
        alert('Please search the record first');
        return false;
    }
    if (filelength == 0) {
        alert('Please select the file to upload');
        return false;
    }
    else {
        var extension = $('#filecovidupload').get(0).files[0].type;
        if (!extension.includes("pdf")) {
            alert('Please select pdf file only');
            return false;
        }
    }
    UploadFiles($('#filecovidupload'), UHID, "CovidCertificate");

}

function UploadFiles(upload, Id, Logic) {
    var path = "";
    var files = upload.get(0).files;
    var formData = new FormData();
    if (files.length > 0) {
        formData.append(Logic, "Logic");
        formData.append("pdffile", files[0]);
        formData.append(Id, "UHID");
        $.ajax({
            url: config.rootUrl + '/FileUpload/UploadFiles',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response != "") {
                    path = response;
                    InsertUpdateCertificate(path);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

function InsertUpdateCertificate(path) {
    
    var objBO = {};
    var url = config.baseUrl + "/api/temp/CovidCertificateInsertUpdate";
    var combinepath = path;
    if (combinepath != "") {
        var spiltpath = combinepath.split('#');
        var virtualpath = spiltpath[0];
        var phypath = spiltpath[1];
        objBO.autoid = 0;
        objBO.hospid = Active.unitId;
        objBO.UHID = $("#txtUHID").val();
        objBO.PatientName = $("#tblUHIDDetails tbody tr").find('td:eq(0)').text();
        objBO.Mobile = $("#tblUHIDDetails tbody tr").find('td:eq(1)').text();
        objBO.VirPath = virtualpath;
        objBO.PhyPath = phypath;
        objBO.login_id = Active.userId;
        objBO.Logic = "insert"
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                
                var splitdata = data.split('|');
                if (splitdata[0] == "failed" && splitdata[1] == "0") {
                    alert('Failed');
                }
                else if (splitdata[0] == "success" && splitdata[1] == "1") {
                    Clear();
                    alert('Covid Certificate uploaded sucessfully');
                }
                else if (splitdata[0] == "success" && splitdata[1] == "2") {
                    Clear();
                    alert('Record updated successfully');
                }
                else {
                    alert(splitdata[1]);
                }

            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}

function Clear() {
    window.location.reload();
}





//var fakepath = $("#filecovidupload").val();
            //var fakesplitname = JSON.stringify(fakepath).split('\\');
            //var filename = fakesplitname[4];     