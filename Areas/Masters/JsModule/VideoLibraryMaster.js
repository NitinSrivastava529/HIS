
$(document).ready(function () {
    RowSequence();
    GetViedoLibrary();
});
function RowSequence() {
    $("#tblYoutubeDetail").find('tbody').sortable({
        items: 'tr',
        cursor: 'move',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            $(this).find("tr").each(function (index) {
                if (index > 0) {
                    $(this).find("td").eq(0).html(index);
                }
            });
        }
    });
}
function InsertViedoLibrary() {
    var url = config.baseUrl + "/api/Doctors/Web_InsertUpdateViedoLibrary";
    var objBO = {};
    objBO.Title = $('#txtDescription').val();
    objBO.Link = $('#txtLink').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            
            if (data.includes('Success')) {
                alert(data);
                GetViedoLibrary();
            }
            else {
                alert(data);
            }

        }
    });
}
function GetViedoLibrary() {
    $('#tblYoutubeDetail tbody').empty();
    var url = config.baseUrl + "/api/Doctors/web_ViedoLibraryQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = "GetViedoLibrary";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var count = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += '<tr>';
                        tbody += '<td>' + count + '</td>';
                        tbody += '<td style="display:none">' + val.AutoId + '</td>';
                        tbody += '<td>' + val.title + '</td>';
                        tbody += '<td>' + '<iframe style="width:100px;height:80px" src=' + val.link + '></iframe>' + '</td>';
                        tbody += "<td><button onclick=MakeDefault('" + val.AutoId + "')>" + val.def_val + "</button>&nbsp;<button class='btn btn-danger btn-xs' onclick=DeleteFeatures('" + val.AutoId + "')>Delete</button></td >";
                        tbody += '</tr>';
                    });
                    $('#tblYoutubeDetail tbody').append(tbody);
                }
            }
        }
    });
}
function DeleteFeatures(autoid) {
    if (confirm('Are you Sure To delete this Record?')) {
        var url = config.baseUrl + "/api/Doctors/Web_InsertUpdateViedoLibrary";
        var objBO = {};
        objBO.AutoId = autoid;
        objBO.Logic = "Delete";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
                GetViedoLibrary();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function MakeDefault(autoid) {
    var url = config.baseUrl + "/api/Doctors/Web_InsertUpdateViedoLibrary";
    var objBO = {};
    objBO.AutoId = autoid;
    objBO.Logic = "MakeDefault";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            GetViedoLibrary();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}