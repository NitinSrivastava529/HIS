var config = {
    baseUrl: "http://localhost:54699",
    PharmacyWebAPI_baseUrl: "http://192.168.0.11/PharmacyWebApi/",
    rootUrl: 'http://localhost:54687',

    //baseUrl: 'http://192.168.0.11/HISWebApi',
    documentServerUrl: 'http://localhost:54687'

    //server Url   
    //baseUrl: window.location.origin + '/HISWebApi',
    //rootUrl: window.location.origin + '/HIS'
};
var pageArray = [];
$(document).ready(function () {
    //DisableRightClick();
    inputLimit();
    onlyInt();
    loading();
    voiceRecord();
    //sessionStorage.setItem('backLocation', sessionStorage.getItem('backLocation1')) 
    //sessionStorage.setItem('backLocation1', window.location.href)

    //if (typeof sessionStorage['backLocation'] != 'undefined') {
    //    pageArray.push(Object.assign([], sessionStorage.getItem('backLocation')));
    //}
    //pageArray.push(Object.assign([], sessionStorage.getItem('backLocation')));
    //pageArray.push(JSON.parse(localStorage.getItem('backLocation')));  
    if (typeof sessionStorage['backLocation'] != 'undefined') {
        for (var i = 0; i < JSON.parse(sessionStorage.getItem('backLocation')).length; i++) {
            pageArray.push(JSON.parse(sessionStorage.getItem('backLocation'))[i]);
        }
    }
    pageArray.push(window.location.href);
    sessionStorage.setItem('backLocation', JSON.stringify(pageArray))

    //pageArray.push(window.location.href);    
    //sessionStorage.setItem('backLocation',JSON.stringify(pageArray))
    //urlEncript();
});
function goBack() {

}
function DisableRightClick() {
    var _HISDebugPermission = sessionStorage.getItem("_HISDebugPermission");
    if (_HISDebugPermission == 'N') {
        $(window).on('keydown', function (event) {
            if (event.keyCode == 123) {               
                return false;
            }
            else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {                
                return false;  //Prevent from ctrl+shift+i
            }
            else if (event.ctrlKey && event.keyCode== 85) {
                return false;  //Prevent from ctrl+U
            }
            else if (event.ctrlKey && event.keyCode == 73) {              
                return false;  //Prevent from ctrl+shift+i
            }
        });
        $("body").on("contextmenu", function (e) {
            return false;
        });
        $(document).keyup(function (evtobj) {
            if (!(evtobj.altKey || evtobj.ctrlKey || evtobj.shiftKey)) {
                if (evtobj.keyCode == 16) { return false; }
                if (evtobj.keyCode == 17) { return false; }
                if (evtobj.keyCode == 51) { return false; }
                $("body").append(evtobj.keyCode + " ");
            }
        });
    }
    else {
        $("body").on("contextmenu", function (e) {
            return true;
        });
        $(document).keyup(function (evtobj) {
            if (!(evtobj.altKey || evtobj.ctrlKey || evtobj.shiftKey)) {
                if (evtobj.keyCode == 16) { return true; }
                if (evtobj.keyCode == 17) { return true; }
                if (evtobj.keyCode == 51) { return true; }
                $("body").append(evtobj.keyCode + " ");
            }
        });
    }
}
var Active = {
    userName: sessionStorage.getItem('Username'),
    userId: sessionStorage.getItem('UserID'),
    unitId: "CH01",
    HospId: "CH01",
    pharmacyId: "MS-H0048",
    warehouseId: "WC0001",
    CSSDCartId: "WC0068",
    LinenDamageCartId: "WC0182",
    LinenStoreCartId: "WC0163",
    AppId: sessionStorage.getItem('AppId'),
    LaundaryCartId: "WC0082",
    CSSDInspectionCartId: "WC0177",
    CSSDContaminationCartId: "WC0178",
    doctorId: sessionStorage.getItem('DoctorId'),
}
var Loading = {
    small_gear: "<i><img src='" + config.rootUrl + "/images/gear.gif' /></i>"
}
function Global_DownloadExcel(Url, objBO, fileName) {

    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
        }
    };
    ajax.send(JSON.stringify(objBO));
}
function voiceRecord() {
    $('input:text').on('click', function () {
        var recognition = new webkitSpeechRecognition();
        recognition.lang = "en-GB";
        recognition.onresult = function (event) {
            console.log(event.results[0][0].transcript);
            $(this).val(event.results[0][0].transcript);
        }
        recognition.start();
    })
}
function FillCurrentTime(elementid) {
    var dt = new Date();
    var hh = dt.getHours();
    var mm = dt.getMinutes();
    if (hh < 10) hh = "0" + hh;
    if (mm < 10) mm = "0" + mm;
    var time = hh + ":" + mm;
    $("#" + elementid).attr("value", time);
}
function FillCurrentDate15(elementid) {
    var date = new Date();
    date.setDate(date.getDate() + 15);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    $("#" + elementid).attr("value", today);
}


function Global_DownloadPdf(Url, objBO, fileName) {
    $('#LineLoader').show();

    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    type: 'POST',
        ajax.responseType = "blob";

    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            //var blob = new Blob([this.response], { type: "application/application/pdf" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
            $('#LineLoader').hide();
        }
    };
    ajax.send(objBO);
}

function lockPreviousDate(elementid) {
    //var today = new Date().toISOString().split('T')[0];	
    var today = sessionStorage.getItem('ServerTodayDate').split('T')[0];
    alert(today);
    $("#" + elementid).attr("min", today);
}
function FillCurrentDate(elementid) {

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    $("#" + elementid).attr("value", today);
}
function GetCurrentDate() {
    var today = '';
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var Minute = date.getMinutes();
    var Second = date.getSeconds();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    today = day + "-" + month + "-" + year + ' ' + hour + ':' + Minute + ':' + Second;

    return today;
}
function query() {
    var vars = [], hash;
    var url = window.location.href.replace('#', '');
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
    }
    return vars;
}

function GetPreviousDate() {

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return year + "-" + month + "-" + day;

}

function Properdate(inp_date, seprater) {
    if (inp_date == "")
        corr_formate = "1900/01/01";
    else
        corr_formate = inp_date
    //if (inp_date != "") {
    //    var f = inp_date.split(seprater);
    //    corr_formate = f[2] + "/" + f[1] + "/" + f[0];
    //}
    //else { corr_formate = "1900/01/01"; }
    return corr_formate;
}

function ddmmyyToyymmdd(inp_date, seprater) {

    //if (inp_date == "")
    //    corr_formate = "1900/01/01";
    //else
    //    corr_formate = inp_date
    if (inp_date != "") {
        var f = inp_date.split(seprater);
        corr_formate = f[2] + "/" + f[1] + "/" + f[0];
    }
    else { corr_formate = "1900/01/01"; }
    return corr_formate;
}

function FixTableHead() {
    var table = $('#tblUnCompleteOrder').height();
    var thead = $('#tblUnCompleteOrder').find('thead');
    var tbody = $('#tblUnCompleteOrder').find('tbody');
    if (table == 335) {
        $(thead).css('position', 'absolute');
    }
}

function chkSession() {
    var Username = sessionStorage.getItem('Username');
    var UserID = sessionStorage.getItem('UserID');
    var urlPath = window.location.pathname.toLowerCase();
    var urlOrigin = window.location.origin.toLowerCase();
    var siteUrl = config.rootUrl;
    if (Username != null && urlOrigin == siteUrl) {
        window.location.href = siteUrl + "/Admin/Dashboard";
    }
}

function CloseSidebar() {
    $('body').addClass('closed-sidebar');
}
function inputLimit() {
    $('input[data-count]').on('click', function (e) {
        $('limit').remove('.count');
        $(this).after('<limit class="count"></limit>');
        t = $(this).data('count');
        $('input[data-count]').on('keyup', function (e) {
            $(this).siblings('limit').show();
            $(this).attr('maxlength', t);
            $(this).siblings('limit').text(t);
            len = $(this).val().length;
            r = parseInt(t) - parseInt(len);
            $(this).siblings('limit').text(r);
            if (r <= 0)
                $(this).css('border-color', 'red');
            else
                $(this).removeAttr('style');
        });
    });
}
function selectRow(id) {
    $(id).closest('tr').parents('tbody').find('tr').removeClass('select-row');
    $(id).closest('tr').addClass('select-row');
}
function onlyInt() {
    $('input[data-int]').on('keyup', function () {
        if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '');
    });
}
function searchTable(txt, tbl) {
    $('#' + txt).on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#' + tbl + ' tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
}
function RowSequence(tables) {
    $.each(tables, function (key, val) {
        $(val).find('tbody').sortable({
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
                        $(this).find("td").eq(1).html(index);
                    }
                });
            }
        });
    });
}
function disableLoading() {
    $(document).on({
        ajaxStart: function () {
            $('#LineLoader').hide();
        },
        ajaxStop: function () {
            mendatory();
            $('#LineLoader').hide();
        }
    });
}
function loading() {
    $(document).on({
        ajaxStart: function () {
            $('#LineLoader').show();
        },
        ajaxStop: function () {
            mendatory();
            $('#LineLoader').hide();
        }
    });
}
function mendatory() {
    $('input[data-imp],select[data-imp],textarea[data-imp]').addClass('border-imp');
    var id = $('select[data-imp]').attr('id');
    //$('select[data-imp]').each(function () {
    //    var id = $('select[data-imp]').attr('id');
    //    $(this).next('span.selection').find('span[aria-labelledby=select2-' + id + '-container]').addClass('border-imp');
    //});
           
}
function urlEncript() {
    var url = window.location.href;
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + '?' + btoa(url);
        window.history.pushState({ path: newurl }, '', newurl);
    }
}
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
function MsgBox(msg) {
    $('.alert-msg').remove();
    var msgBox = "";
    msgBox += "<div class='alert-msg'><i class='fa fa-warning fa-2X'></i>";
    msgBox += "<span>" + msg + "</span>";
    msgBox += "<span class='timeout'>X</span>";
    msgBox += "</div>";
    $('#page-content').append(msgBox);

    $('.alert-msg').show();
    $(".alert-msg").fadeIn()
        .css({ top: 0, position: 'absolute' })
        .animate({ top: 20 }, 800, function () {
            setTimeout(function () {
                $('.alert-msg').hide();
                $('.alert-msg').remove();
            }, 100000);
        });
    $('.alert-msg .timeout').click(function () {
        $('.alert-msg').remove();
        $('.alert-msg').fadeOut()
            .css({ top: 0, position: 'absolute' })

    });
}
//Uploading Document
function UploadDocument(url, data) {
    var UploadDocumentInfo = new XMLHttpRequest();
    UploadDocumentInfo.upload.addEventListener('progress', function (e) {
        $('#LineLoader').show();
        var val = (e.loaded / e.total) * 100;
        var percent = val.toFixed(0);
        $('#UploadingStatus').css('width', '' + percent + '%').text(percent + '%');
        if (percent == 100) {
            $('#UploadingStatus').text('Uploading Completed');
            $('#LineLoader').hide();
        }
    });
    function query() {
        var vars = [], hash;
        var url = window.location.href.replace('#', '');
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
        }
        return vars;
    }
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                if (json.Message.includes('Success')) {
                    $('#modalUploadDocument input[id=txtNewAttachment]').val('');
                    $('#modalUploadDocument').modal('hide');
                    $('#UploadingStatus').text('');
                    $('#tblPurchaseBills tbody').find('tr.select-row').find('td:eq(13)').
                        html("<a class='btn-warning btn-flat attach' href='" + json.virtual_path + "' target='_blank'>View</a>");
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data);
}