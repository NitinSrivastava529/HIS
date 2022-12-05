


function ViewExpiredProduct() {
	var url = config.baseUrl + "/api/warehouse/wh_PurchaseReportQueries";
	var objBO = {};
	var itemids = [];
    $("#tblExpiredProduct tbody").empty();
    objBO.ReportType = 'View';
	objBO.ProcName = 'pwh_AnalysisQueries';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.prm_1 = $('#txtDays').val();
	objBO.login_id = Active.userId;
	objBO.Logic = 'ExPiredProductReport';	
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
		   if (data.ResultSet.Table.length > 0) {
				$("#tblExpiredProduct").show();
				var tbody = "";
				var temp = "";
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.CartName) {
						tbody += "<tr style=background:#bce1fd>";
						tbody += "<td colspan='9'>" + val.CartName + "</td>";	
						tbody += "</tr>";
						temp = val.CartName;
					}
					tbody += "<tr>";											
					tbody += "<td>" + val.item_id+"</td>";										
					tbody += "<td>" + val.item_name+"</td>";										
					tbody += "<td>" + val.pack_type+"</td>";										
					tbody += "<td>" + val.pack_qty+"</td>";										
					tbody += "<td>" + val.master_key_id+"</td>";										
					tbody += "<td>" + val.qty+"</td>";										
					tbody += "<td>" + val.rol+"</td>";										
					tbody += "<td>" + val.moq+"</td>";										
					tbody += "<td>" + val.exp_date+"</td>";										
					tbody += "</tr>";
				});
				$("#tblExpiredProduct tbody").append(tbody);
			}
		},		
		error: function (response) {
			alert('Server Error...!');
		}
	});
}



function DownloadExcel() {
	var url = config.baseUrl + "/api/warehouse/wh_PurchaseReportQueries";
	var objBO = {};
	var itemids = [];	
	objBO.ReportType ='XL';
	objBO.ProcName = 'pwh_AnalysisQueries';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.prm_1 = $('#txtDays').val();
	objBO.login_id = Active.userId;
	objBO.Logic = 'ExPiredProductReport';
	Global_DownloadExcel(url, objBO,'Expired-Product.xlsx');
}