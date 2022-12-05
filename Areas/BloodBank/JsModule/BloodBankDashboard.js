$(document).ready(function () {
    BloodStockSummary();
    BloodStockSummaryByExpiryDays();
});
function BloodStockSummary() {
    $('.component').empty();
    $('#tblStockInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_StockAndDashBoard_Queries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.BloodGroup = '-';
    objBO.ExpireInDays = 0;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "BloodStockSummary";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data.ResultSet.Table1)
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        ComponentChart(data.ResultSet.Table)
                        BloodGroupChart(data.ResultSet.Table)
                        tbody += "<div class='col-md-2'>";
                        tbody += "<label>" + val.AliasName + "<hr /><span class='stock'>" + val.Stock + "</span></label>";
                        tbody += "</div>";
                    });
                    $('.component').append(tbody);
                }
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = "";
                    var temp = "";
                    var count = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        if (temp != val.AliasName) {
                            tbody += "<tr class='group'>";
                            tbody += "<td>" + val.ComponentName + ' : ' + val.AliasName + "</td>";
                            tbody += "<td>0</td>";
                            tbody += "<td>0</td>";
                            tbody += "<td>0<i class='fa fa-question-circle-o question' onclick=BloodStockDetailed('" + val.ComponentID + "','BloodStockDetailed')></i></td>";
                            tbody += "</tr>";
                            temp = val.AliasName;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td>" + val.Stock + "</td>";
                        tbody += "<td>" + val.HoldStock + "</td>";
                        tbody += "<td>" + val.UnTestedStock + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblStockInfo tbody').append(tbody);
                }
            }
        },
        complete: function () {
           
        },
        error: function (response) {
            alert('Server Error...!');
        }
    }); 
}
function BloodStockDetailed(componentId, logic) {
    $('#tblBloodStockDetailed tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_StockAndDashBoard_Queries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.BloodGroup = '-';
    objBO.ExpireInDays = $('#txtExpiryDays').val();
    objBO.Prm1 = componentId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        //if (temp != val.AliasName) {
                        //    tbody += "<tr style='background:#f3eaca'>";
                        //    tbody += "<td colspan='4'>" + val.ComponentName + ' : ' + val.AliasName + "<i class='fa fa-question-circle-o question'></i></td>";
                        //    tbody += "</tr>";
                        //    temp = val.AliasName;
                        //}
                        tbody += "<tr>";
                        tbody += "<td>" + val.donor_id + "</td>";
                        tbody += "<td>" + val.donorName + "</td>";
                        tbody += "<td>" + val.donorName + "</td>";
                        tbody += "<td>" + val.BBTubeNo + "</td>";
                        tbody += "<td>" + val.BagType + "</td>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.ExPiryDate + "</td>";
                        tbody += "<td>" + val.Stock + "</td>";
                        tbody += "<td>" + val.HoldStock + "</td>";
                        tbody += "<td>" + val.UnTestedStock + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblBloodStockDetailed tbody').append(tbody);
                    $('#modalBloodStockDetailed').modal('show');
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BloodStockSummaryByExpiryDays() {
    $('#tblStockInfoInExpire tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_StockAndDashBoard_Queries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.BloodGroup = '-';
    objBO.ExpireInDays = $('#txtExpiryDays').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "BloodStockSummaryByExpiryDays";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.AliasName) {
                            tbody += "<tr style='background:#c9ecff'>";
                            tbody += "<td colspan='4'>" + val.ComponentName + ' : ' + val.AliasName + "<i class='fa fa-question-circle-o question' onclick=BloodStockDetailed('" + val.ComponentID + "','BloodStockDetailedByExpiry')></i></td>";
                            tbody += "</tr>";
                            temp = val.AliasName;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + val.BloodGroup + "</td>";
                        tbody += "<td>" + val.Stock + "</td>";
                        tbody += "<td>" + val.HoldStock + "</td>";
                        tbody += "<td>" + val.UnTestedStock + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblStockInfoInExpire tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function BloodGroupChart(response) {
    $('#bloodGroupGraphContainer').empty(); // this is my <canvas> element
    $('#bloodGroupGraphContainer').append('<canvas id="chartBloodGroup"><canvas><br />');
    var canvas = document.querySelector('#chartBloodGroup');
    var ctxL = canvas.getContext('2d');
    var xValues = [];
    var TempArr = [];
    for (var i in response) {
        xValues.push(response[i].AliasName);
        TempArr.push(response[i].Stock);
    }
    var config = {
        type: 'bar',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Total Blood Group",
                    data: TempArr,
                    backgroundColor: ['rgba(0, 137, 132, .2)',], borderColor: ['rgba(0, 10, 130, .7)',],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true
            //,scales: {
            //    yAxes: [{
            //        ticks: {
            //            min: 10,
            //            max: 5000
            //        }
            //    }]
            //}
        }
    };
    var myLineChart = new Chart(ctxL, config);
}
function ComponentChart(response) {
    $('#componentContainer').empty(); // this is my <canvas> element
    $('#componentContainer').append('<canvas id="chartComponent"><canvas><br />');
    var canvas = document.querySelector('#chartComponent');
    var ctxL = canvas.getContext('2d');
    var xValues = [];
    var TempArr = [];
    for (var i in response) {
        xValues.push(response[i].AliasName);
        TempArr.push(response[i].Stock);
    }
    var config = {
        type: 'pie',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Total Component",
                    data: TempArr,
                    backgroundColor: ["rgba(117,169,255,0.6)", "rgba(148,223,215,0.6)",
                        "rgba(208,129,222,0.6)", "rgba(247,127,167,0.6)",
                        "#f39c12", "#337ab7", "#539906", "#f60"
                    ],
                    borderWidth: 2
                }
            ]
        }
    };
    var myLineChart = new Chart(ctxL, config);
}