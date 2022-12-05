$(document).ready(function () {
    CloseSidebar();
    searchTable('txtSearch', 'tblSetInfo');
    GetSetInfo();
});
function GetSetInfo() {
    $("#tblSetInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = '-';
    objBO.Logic = 'GetSetInfoForStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {            
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var count = 0;             
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if(val.SetStatus == 'Sterlized')
                            tbody += "<tr style='background:#e6fff0'>";    
                        else if (val.SetStatus == 'InUse')
                            tbody += "<tr style='background:#ffe6ff'>";                                 


                        tbody += "<tr>";                                 
                        tbody += "<td>" + val.SetId + "</td>";
                        tbody += "<td>" + val.SetName + "</td>";
                        tbody += "<td><a href='#' onclick=TrackSetByBatchNo('" + val.batch_no + "')>" + val.batch_no + "</a></td>";
                        tbody += "<td>" + val.SetStatus + "</td>";
                        tbody += "<td><button onclick=selectRow(this);SetInfo('" + val.SetId + "') class='btn btn-warning btn-xs'><i class='fa fa-sign-in'>&nbsp;</i></button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblSetInfo tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TrackSetByBatchNo(batchNo) {
    $('#txtBatchInfo').text('');
    $("#tblTrackingInfo tbody").empty();
    var url = config.baseUrl + "/api/cssd/CSSD_MovementQueries";
    var objBO = {};
    objBO.Prm_1 = batchNo;
    objBO.Logic = 'TrackSetByBatchNo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var temp = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        //if (temp != val.doc_date) {
                        //    tbody += "<tr style='background:#ddd'>";
                        //    tbody += "<td colspan='9'>" + val.doc_date + "</td>";
                        //    tbody += "</tr>";
                        //    temp = val.doc_date;                  
                        //    $('#txtBatchInfo').text(val.batch_no);
                        //}
                        tbody += "<tr>";                      
                        tbody += "<td>" + val.trn_type + "</td>";
                        tbody += "<td>" + val.batch_no + "</td>";                    
                        tbody += "<td>" + val.doc_date + "</td>";                    
                        tbody += "<td>" + val.exp_date.substring(0,10) + "</td>";                    
                        tbody += "<td>" + val.SetId + "</td>";                    
                        tbody += "<td>" + val.fromcart + "</td>";                    
                        tbody += "<td>" + val.tocART + "</td>";                    
                        tbody += "<td>" + val.IPDNo + "</td>";                    
                        tbody += "<td>" + val.patient_name + "</td>";                    
                        tbody += "<td>" + val.DoctorName + "</td>";                    
                        tbody += "<td>" + val.emp_name + "</td>";                    
                        tbody += "</tr>";
                    });
                    $("#tblTrackingInfo tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}