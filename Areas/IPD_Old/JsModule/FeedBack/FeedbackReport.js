$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate15('txtTo');
})
function IPDDischaregFeedBack() {
    $('#divOverAll').html('');
    $('#divQuest').html('');
    $('#divDoctor').html('');
    $('#divNurses').html('');
    $('#divFloor').html('');
    var url = config.baseUrl + "/api/IPOPAudit/FeedbackReport_Quesries";
    var objBO = {};
    objBO.prm_1 = $('#ddlRepType').val();
    objBO.prm_2 = "-";
    objBO.empCode = "-";
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Logic = "FEEDBACK-REPORT";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                var tsumRate = 0;
                var tCount = 0;
                if (Object.keys(data.ResultSet.Table).length > 0){
                    var tbody = '<table class="table table-bordered"  style="margin:0;width:100%">';
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td colspan='2' style='text-align:center;background-color:#16c9ff94;font-size:13px;font-weight:bold' > Overall Rating  " + val.totalRating + " / Out of " + val.TotalIPDCount + " IP/OP </td>";
                        tbody += "</tr>";
                    });
                    tbody += "</table>";
                    $('#divOverAll').html(tbody);
                }
                tbody = ''
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    var strQheader;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.QInfo + "</td>";
                        tbody += "<td style='text-align:center;'>" + val.TotalIPDCount + "</td>";
                        tbody += "<td style='text-align:center;background-color:#c2dff9'>" + val.totalRating + "</td>";
                        tbody += "</tr>";
                        tsumRate += eval(val.totalRating);
                        tCount++;
                    });
                    strQheader = '<table class="table table-bordered"  style="margin:0;width:100%">';
                    strQheader += "<tr>";
                    strQheader += "<th style='background-color:#c2dff9'>Question wise </th>";
                    strQheader += "<th style='background-color:#c2dff9'>IP/OP</th>";
                    strQheader += "<th style='text-align:center;background-color:#c2dff9'>" + (tsumRate / tCount).toFixed(2) + "</th>";
                    strQheader += "</tr>";
                    tbody = strQheader + tbody;
                    tbody += "</table>";
                    $('#divQuest').html(tbody);
                    tbody = ''
                }
                tsumRate = 0;
                tCount = 0;
                tbody = ''
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                   var strDoctor;
                    $.each(data.ResultSet.Table2, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td style='text-align:center;'>" + val.TotalIPDCount + "</td>";
                        tbody += "<td style='text-align:center;background-color:#c2dff9'>" + val.totalRating + "</td>";
                        tbody += "</tr>";
                        tsumRate += eval(val.totalRating);
                        tCount++;
                    });
                    strDoctor = '<table class="table table-bordered"  style="margin:0;width:100%">';
                    strDoctor += "<tr>";
                    strDoctor += "<th style='background-color:#c2dff9'>Doctors Over All Rating </th>";
                    strDoctor += "<th style='background-color:#c2dff9'>IP/OP</th>";
                    strDoctor += "<th style='text-align:center;background-color:#c2dff9'>" + (tsumRate / tCount).toFixed(2) + "</th>";
                    strDoctor += "</tr>";
                    tbody = strDoctor + tbody;
                    tbody += "</table>";
                    $('#divDoctor').html(tbody);
                    tbody = ''
                }
                tsumRate = 0;
                tCount = 0;
                tbody = ''
                if (Object.keys(data.ResultSet.Table3).length > 0) {
                    var strNurse;
                    $.each(data.ResultSet.Table3, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.NurseName + "</td>";
                        tbody += "<td style='text-align:center;'>" + val.TotalIPDCount + "</td>";
                        tbody += "<td style='text-align:center;background-color:#c2dff9'>" + val.totalRating + "</td>";
                        tbody += "</tr>";
                        tsumRate += eval(val.totalRating);
                        tCount++;
                    });
                    strNurse = '<table class="table table-bordered"  style="margin:0;width:100%">';
                    strNurse += "<tr>";
                    strNurse += "<th style='background-color:#c2dff9'>Nurses Over All Rating </th>";
                    strNurse += "<th style='background-color:#c2dff9'>IP/OP</th>";
                    strNurse += "<th style='text-align:center;background-color:#c2dff9'>" + (tsumRate / tCount).toFixed(2) + "</th>";
                    strNurse += "</tr>";
                    tbody = strNurse + tbody;
                    tbody += "</table>";
                    $('#divNurses').html(tbody);
                }
                tbody = ''
                tsumRate = 0;
                tCount = 0;
                if (Object.keys(data.ResultSet.Table4).length > 0) {
                    var strFloor;
                    $.each(data.ResultSet.Table4, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.FloorName + "</td>";
                        tbody += "<td style='text-align:center;'>" + val.TotalIPDCount + "</td>";
                        tbody += "<td style='text-align:center;background-color:#c2dff9'>" + val.totalRating + "</td>";
                        tbody += "</tr>";
                        tsumRate += eval(val.totalRating);
                        tCount++;
                    });
                    strFloor = '<table class="table table-bordered"  style="margin:0;width:100%">';
                    strFloor += "<tr>";
                    strFloor += "<th style='background-color:#c2dff9'>Floor Over All Rating </th>";
                    strFloor += "<th style='background-color:#c2dff9'>IP/OP</th>";
                    strFloor += "<th style='text-align:center;background-color:#c2dff9'>" + (tsumRate / tCount).toFixed(2) + "</th>";
                    strFloor += "</tr>";
                    tbody = strFloor + tbody;
                    tbody += "</table>";
                    $('#divFloor').html(tbody);
                }
               
            }
          
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function OTSchedulePivot() {
    var url = config.baseUrl + "/api/OT/OTScheduleQueries";
    var objBO = {};
    objBO.OTId = '-';
    objBO.DoctorId = '-';
    objBO.IPDNo = "";
    objBO.from = "1900-01-01";
    objBO.to = "1900-01-01";
    objBO.Prm1 = "";
    objBO.Logic = "OTSchedulePivot";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var col = [];
            for (var i = 0; i < data.ResultSet.Table.length; i++) {
                for (var key in data.ResultSet.Table[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }
            var t = "";
            t += "<table style='width:100%' class='table-bordered tblBorder'>";
            t += "<tr>";
            for (var i = 0; i < col.length; i++) {
                t += "<th style='text-align:center;width:30%;white-space:nowrap'>" + col[i] + "</th>";
            }
            t += "</tr>";
            $.each(data.ResultSet.Table, function (key, val) {
                t += "<tr>";
                for (var i = 0; i < col.length; i++) {
                    if (val[col[i]].includes('OT'))
                        t += "<td style='text-align:center;vertical-align:middle'>" + val[col[i]] + "</td>";
                    else {
                        var str = val[col[i]];
                        console.log(str);
                        if (str.length > 5) {
                            var slots = val[col[i]].split('|');
                            var s = "";
                            for (var j = 0; j < slots.length; j++) {
                                if (slots[j].length > 5) {
                                    var str2 = slots[j];
                                    var tr = str2.split('$');
                                    s += "<span id='" + tr[0] + "' onclick='OTScheduleInfo(this.id);'  class='badge  mr-1' style='font-size:10pt;background-color:#4caed1;'>" + tr[1] + "</span> ";
                                }

                            }
                            t += "<td style='text-align:center;vertical-align:middle'>" + s + "</td>";
                        }
                        else
                            t += "<td style='text-align:center;vertical-align:middle'></td>";

                    }
                }
                t += "</tr>";
            });
            t += "</table>";
            $('#divEntryForm').empty();
            $('#divEntryForm').html(t);

        },
        complete: function (com) {

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}



