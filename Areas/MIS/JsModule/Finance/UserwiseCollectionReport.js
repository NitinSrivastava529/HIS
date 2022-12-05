
$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
});

function CollectionSummaryReport() {
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Finance/Financial_Queries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.prm_1 = '-';
    objBO.prm_2 = '-';
    objBO.loginId = 'ALL';
    objBO.Logic = "CollectionSummaryReportByUser";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var p_Cash = 0;
            var p_SwipeCard = 0;
            var p_Cheque = 0;
            var p_NEFT_RTGS = 0;
            var n_Cash = 0;
            var n_SwipeCard = 0;
            var n_Cheque = 0;
            var n_NEFT_RTGS = 0;
            var f_cash = 0;
            var f_SwipeCard = 0;
            var f_Cheque = 0;
            var f_NEFT_RTGS = 0;
            var FinalTotal = 0;

            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        p_Cash += val.p_Cash;
                        p_SwipeCard += val.p_SwipeCard;
                        p_Cheque += val.p_Cheque;
                        p_NEFT_RTGS += val.p_NEFT_RTGS;
                        n_Cash += val.n_Cash;
                        n_SwipeCard += val.n_SwipeCard;
                        n_Cheque += val.n_Cheque;
                        n_NEFT_RTGS += val.n_NEFT_RTGS;
                        f_cash += val.f_cash;
                        f_SwipeCard += val.f_SwipeCard;
                        f_Cheque += val.f_Cheque;
                        f_NEFT_RTGS += val.f_NEFT_RTGS;
                        FinalTotal += val.FinalTotal;

                        tbody += '<tr>';
                        tbody += '<td>' + val.StaffName + '</td>';
                        tbody += '<td class="text-right">' + val.p_Cash + '</td>';
                        tbody += '<td class="text-right">' + val.p_SwipeCard + '</td>';
                        tbody += '<td class="text-right">' + val.p_Cheque + '</td>';
                        tbody += '<td class="text-right">' + val.p_NEFT_RTGS + '</td>';
                        tbody += '<td class="text-right">' + val.n_Cash + '</td>';
                        tbody += '<td class="text-right">' + val.n_SwipeCard + '</td>';
                        tbody += '<td class="text-right">' + val.n_Cheque + '</td>';
                        tbody += '<td class="text-right">' + val.n_NEFT_RTGS + '</td>';
                        tbody += '<td class="text-right">' + val.f_cash + '</td>';
                        tbody += '<td class="text-right">' + val.f_SwipeCard + '</td>';
                        tbody += '<td class="text-right">' + val.f_Cheque + '</td>';
                        tbody += '<td class="text-right">' + val.f_NEFT_RTGS + '</td>';
                        tbody += '<td class="text-right">' + val.FinalTotal + '</td>';
                        tbody += '</tr>';
                    });
                    tbody += '<tr>';
                    tbody += '<td class="text-right" style="background:#ddd;font-size:12px;"><b>Total</b></td>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + p_Cash + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + p_SwipeCard + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + p_Cheque + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + p_NEFT_RTGS + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + n_Cash + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + n_SwipeCard + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + n_Cheque + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + n_NEFT_RTGS + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + f_cash + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + f_SwipeCard + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + f_Cheque + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + f_NEFT_RTGS + '</b></th>';
                    tbody += '<th class="text-right" style="background:#ddd;font-size:12px;"><b>' + FinalTotal + '</b></th>';
                    tbody += '</tr>';
                    $('#tblReport tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function PrintReport() {
    var hosp_id = Active.HospId;
    var from = $('#txtFrom').val();
    var to = $('#txtTo').val();
    var loginId = 'ALL';
    var url = "../Print/CollectionSummaryReport?hosp_id=" + hosp_id + "&from=" + from + "&to=" + to + "&loginId=" + loginId;
    window.open(url, '_blank');
}