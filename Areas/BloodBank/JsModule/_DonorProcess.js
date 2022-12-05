var _BillNo = "";
var _DonorId, _VisitId, _bbGroupingId, _DonorName, _Gender, _BloodGroup, _BagType, _Quantity, _EntryDate, _BloodCollectionId = 'New', _Volume, _BBTubeNo, _IsScreened, _IsScreenedApproved,_IsDiscarded;
$(document).ready(function () {
    $('#lblApproveStatus').hide();
    EnableDiableApprove();
    $('select').select2();
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    DonorProcess("Donor:Inprocess");
    $('#tblDonorProcessInfo tbody').on('click', 'i', function () {
        var elem = $(this).closest('td').index() - 9;
        getProcess($(this));
        if (elem == 1) {
            CollectionInfo();
            $('#modalBloodCollection').modal('show');
        }
        if (elem == 2) {
            GroupedInfo();
            $('#modalGrouping').modal('show');
        }
        if (elem == 3) {
            ComponentInfo();
            $('#modalComponent').modal('show');
        }
        if (elem == 4) {
            GetBloodTest();
            $('#modalScreened').modal('show');
        }
    });
    $('#tblBloodTest thead').on('change', 'input:checkbox', function () {
        var isCheck = $(this).is(':checked');
        if (isCheck) {
            $(this).closest('tr').addClass('selected');
            $(this).parents('table').find('tbody input:checkbox').prop('checked', true);
        }
        else {
            $(this).closest('tr').removeClass('selected');
            $(this).parents('table').find('tbody input:checkbox').prop('checked', false);
            $('#tblBloodTest tbody tr').removeClass('error');
        }
        $('#tblBloodTest tbody tr').each(function () {
            $(this).find('.form-control').removeClass('error');
            if ($(this).find('input:checkbox').is(':checked'))
                $(this).closest('tr').addClass('selected').find('.form-control').prop('disabled', false);
            else
                $(this).closest('tr').removeClass('selected').find('.form-control').prop('disabled', true);
        });
    });
    $('#tblBloodTest tbody').on('change', 'input:checkbox', function () {
        $('#tblBloodTest tbody').removeClass('error');
        $('#tblBloodTest tbody tr').each(function () {
            if ($(this).find('input:checkbox').is(':checked'))
                $(this).closest('tr').addClass('selected').find('.form-control').prop('disabled', false);
            else
                $(this).closest('tr').removeClass('selected').find('.form-control').removeClass('error').prop('disabled', true);
        });
    });
    $('.tblDonorInfoForProcess').on('mouseenter', 'i.healthStatus', function () {
        GetDonorHealthStatus();
        //$('.healthStatusContainer').css({ top: $(this).position().top, left: $(this).position().left }).show();
        $('.healthStatusContainer').css({ top: '27%', right: '23%' }).show();
    }).on('mouseleave', 'i.healthStatus', function () {
        $('.healthStatusContainer*').find('td[id]').text('');
        $('.healthStatusContainer').hide();
    });
    $('#ddlDonationCompleted').on('change', function () {
        if ($(this).find('option:selected').val() == 'Y') {
            $('.IsDonation').show();
            $('.PoorShocked').hide();
        }
        else {
            $('.IsDonation').hide();
            $('.PoorShocked').show();
        }
    });
    $('.AntiList1 .radioList').on('change', 'input:radio', function () {
        var val = [];
        if ($('.AntiList1 .radioList').find('input:radio:checked').length == 4) {
            $('#tblAntigen tbody tr').removeClass('bg-success');
            $('.AntiList1 .radioList').each(function () {
                val.push($(this).find('input:radio:checked').val());
            });
            $('#tblAntigen tbody tr').each(function () {
                if ($(this).attr('class') == val.join(''))
                    $(this).addClass('bg-success');
            });
        }
        IsValidGroupInfo();
        $('Alloted').text($('#tblAntigen tbody tr.bg-success').find('td:eq(4)').text());
        $('Cell').text($('#tblAntigen tbody tr.bg-success').find('td:eq(5)').text());
    });
    $('.AntiList2 .radioList').on('change', 'input:radio', function () {
        var val = [];
        if ($('.AntiList2 .radioList').find('input:radio:checked').length == 3) {
            $('#tblCell tbody tr').removeClass('bg-success');
            $('.AntiList2 .radioList').each(function () {
                val.push($(this).find('input:radio:checked').val());
            });
            $('#tblCell tbody tr').each(function () {
                if ($(this).attr('class') == val.join(''))
                    $(this).addClass('bg-success');
            });
        }
        IsValidGroupInfo();
        $('Alloted').text($('#tblAntigen tbody tr.bg-success').find('td:eq(4)').text());
        $('Cell').text($('#tblAntigen tbody tr.bg-success').find('td:eq(5)').text());
    });
    $('#tblBloodTest tbody').on('change', '#ddlMethod', function () {
        var testName = $(this).closest('tr').find('td:eq(1)').text();
        var method = $(this).closest('tr').find('#ddlMethod option:selected').text();
        var value = $(this).closest('tr').find('input:text').val();
        var result = $(this).closest('tr').find('#ddlResult option:selected').text();
        $(this).closest('tr').find('.form-control').removeClass('error');
        if (method == '--') {
            $(this).closest('tr').find('#ddlMethod').addClass('error');
            $(this).closest('tr').find('input:text').val('').prop('disabled', true);
            $(this).closest('tr').find('#ddlResult').prop('selectedIndex', '0').prop('disabled', true);
        }
        else {
            $(this).closest('tr').find('#ddlMethod').removeClass('error');
        }
        if (method.includes('Elisa')) {
            $(this).closest('tr').find('input:text').prop('disabled', false);
            $(this).closest('tr').find('#ddlResult').prop('disabled', false);
            if (value == '') {
                $(this).closest('tr').find('input:text').addClass('error');
            }
            else {
                $(this).closest('tr').find('input:text').removeClass('error');
            }
            if (result == '--') {
                $(this).closest('tr').find('#ddlResult').addClass('error');
            }
            else {
                $(this).closest('tr').find('#ddlResult').removeClass('error');
            }
        }
        if (method.includes('Spot')) {
            $(this).closest('tr').find('input:text').val('').prop('disabled', true);
            $(this).closest('tr').find('#ddlResult').prop('disabled', false);
            if (result == '--') {
                $(this).closest('tr').find('#ddlResult').addClass('error');
            }
            else {
                $(this).closest('tr').find('#ddlResult').removeClass('error');
            }
        }
    });
    $('#tblComponentInfo thead').on('change', 'input:checkbox', function () {
        var isCheck = $(this).is(':checked');
        $('#tblComponentInfo tbody tr').find('#ddlPackSize').removeClass('error');
        if (isCheck)
            $(this).parents('table').find('tbody input:checkbox:not(.whole)').prop({ 'checked': true, 'disabled': false });
        else
            $(this).parents('table').find('tbody input:checkbox').prop({ 'checked': false, 'disabled': false });
    });
    $('#tblComponentInfo tbody').on('change', 'input:checkbox', function () {
        var val = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
        if ($(this).is(':checked')) {
            if ($(this).attr('class') != 'whole') {
                if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked:not(.whole)').length > 0)
                    $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': true });
                else {
                    $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': false });
                }
            }
            else {
                $('#tblComponentInfo tbody tr').find('input[type=checkbox]:not(.whole)').prop({ 'checked': false, 'disabled': true });
            }

            $('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').each(function () {
                if ($(this).closest('tr').find('td:eq(6)').find('#ddlPackSize option:selected').text() == 'Select')
                    $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').addClass('error');
                else
                    $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
            });
        }
        else {
            if ($(this).attr('class') == 'whole') {
                $('#tblComponentInfo tbody tr').find('input[type=checkbox]').prop('disabled', false);
            }
            if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked:not(.whole)').length > 0)
                $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': true });
            else
                $('#tblComponentInfo tbody tr').find('input[type=checkbox][class=whole]').prop({ 'checked': false, 'disabled': false });

            $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
        }
    });
});
function EnableDiableApprove() {   
    var arrPath = window.location.pathname.split('/');
    if (arrPath[arrPath.length - 1] == 'ProcessEntry') {
        if (_IsScreenedApproved == 'Y') {
            $('div[class*=action-btn]').hide();
            $('button[class*=approve]').hide();
        }
        else {
            $('div[class*=action-btn]').show();
            $('button[class*=approve]').hide();
        }
    }
    else {
        if (_IsScreened == 'N') {
            $('div[class*=action-btn]').show();
            $('#lblApproveStatus').text('Screening Pending').addClass('text-warning').show();
            $('button[class*=approve]').hide();
        }
        else if (_IsScreenedApproved == 'Y') {
            $('div[class*=action-btn]').hide();
            $('button[class*=approve]').hide();
            $('#lblApproveStatus').text('Donation Approved').addClass('text-success').show();
        }
        else {
            $('div[class*=action-btn]').show();
            $('button[class*=approve]').show();
            $('#lblApproveStatus').removeClass('text-success').hide();
        }
    }
}
function DonorProcess(logic) {
    $('#tblDonorProcessInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = $('#txtSearchInput').val();
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
                    var DoonorInfo = "";
                    var count = 0;
                    var counter = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        if (val.IsDiscarded == 'Y')
                            DoonorInfo += "<tr class='discarded'>";
                        else
                            DoonorInfo += "<tr>";

                        DoonorInfo += "<td class='hide'>" + JSON.stringify(data.ResultSet.Table[count]) + "</td>";
                        DoonorInfo += "<td>" + counter + "</td>";
                        DoonorInfo += "<td class='hide'>" + val.donor_id + "</td>";
                        DoonorInfo += "<td class='hide'>" + val.visit_id + "</td>";
                        DoonorInfo += "<td>" + val.visit_id + "</td>";
                        DoonorInfo += "<td>" + val.entryDate + "</td>";
                        DoonorInfo += "<td>" + val.donorName + "</td>";
                        DoonorInfo += "<td>" + val.Gender + "</td>";
                        DoonorInfo += "<td>" + val.DOB + "</td>";
                        DoonorInfo += "<td>" + val.contactNo + "</td>";
                        if (val.IsDonated == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check DoneProcess'></i></td>";
                        else
                            DoonorInfo += "<td><i class='fa fa-check'></i></td>";

                        if (val.isGrouped == 'N' && val.IsDonated == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check'></i></td>";
                        else if (val.isGrouped == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check DoneProcess'></i></td>";
                        else
                            DoonorInfo += "<td><i class='fa fa-check lockProcess'></i></td>";

                        if (val.isComponent == 'N' && val.isGrouped == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check'></i></td>";
                        else if (val.isComponent == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check DoneProcess'></i></td>";
                        else
                            DoonorInfo += "<td><i class='fa fa-check lockProcess'></i></td>";

                        if (val.isScreened == 'N' && val.isComponent == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check'></i></td>";
                        else if (val.isScreened == 'P')
                            DoonorInfo += "<td><i class='fa fa-check InProcess'></i></td>";
                        else if (val.isScreened == 'Y' && val.isComponent == 'Y')
                            DoonorInfo += "<td><i class='fa fa-check DoneProcess'></i></td>";
                        else
                            DoonorInfo += "<td><i class='fa fa-check lockProcess'></i></td>";

                        if (val.isScreenedApproved == 'Y')
                            DoonorInfo += "<td><i onclick=ApprovalInfo(this) class='fa fa-check DoneProcess'></i></td>";
                        else if (val.isScreened == 'Y')
                            DoonorInfo += "<td><i onclick=ApprovalInfo(this) class='fa fa-check InProcess'></i></td>";
                        else
                            DoonorInfo += "<td><i onclick=ApprovalInfo(this) class='fa fa-check '></i></td>";

                        DoonorInfo += "</tr>";

                        count++;
                    });
                    $('#tblDonorProcessInfo tbody').append(DoonorInfo);
                }
            }
        },
        complete: function () {
            $('#ddlCountry').val(14).change();
            $('#ddlCity').val(45).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDonorHealthStatus() {
    $('.healthStatusContainer*').find('td[id]').text('-');
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = _DonorId;
    objBO.VisitId = _VisitId;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetDonorHealthStatus";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtHealthBP').text(val.Blood_Pressure);
                        $('#txtHealthWeight').text(val.Weight);
                        $('#txtHealthTemprature').text(val.Temprature);
                        $('#txtHealthHeight').text(val.Height);
                        $('#txtHealthPulse').text(val.Pulse);
                        $('#txtHealthHemoglobin').text(val.Hb);
                        $('#txtHealthGPE').text(val.GPE);
                        $('#txtHealthPlatelet').text(val.platelet);
                    });
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
function ApprovalInfo(elem) {
    getProcess(elem);
    GetInfoForApproval();
    $('#modalApprove').modal('show');
}
function getProcess(elem) {
    var val = JSON.parse($(elem).closest('tr').find('td:eq(0)').text());
    $('.txtInfoDonorID').text(val.donor_id);
    $('.txtInfoDonorName').text(val.donorName);
    $('.txtInfoGender').text(val.Gender);
    $('.txtInfoBloodGroup').text(val.BloodGroup);
    $('.txtInfoBagType').text(val.BagType);
    $('.txtInfoQuantity').text(val.Qty);
    $('.txtInfoEntryDate').text(val.entryDate);
    $('.txtInfoTubeNo').text(val.BBTubeNo);
    $('.txtInfoVolume').text(val.Volume);
    $('.txtInfoBloodCollectionId').text(val.BloodCollection_Id);
    _DonorId = val.donor_id;
    _VisitId = val.visit_id;
    _DonorName = val.donorName;
    _Gender = val.Gender;
    _BloodGroup = val.BloodGroup;
    _BagType = val.BagType;
    _Quantity = val.Qty;
    _EntryDate = val.entryDate;
    _Volume = val.Volume;
    _BBTubeNo = val.BBTubeNo;
    _bbGroupingId = val.bb_Grouping_Id;
    _BloodCollectionId = val.BloodCollection_Id;
    _IsScreened = val.isScreened;
    _IsScreenedApproved = val.isScreenedApproved;
    _IsDiscarded = val.IsDiscarded;
    EnableDiableApprove();
    var btnHealth = "<i class='fa fa-heartbeat healthStatus'>&nbsp;</i>";
    $('table[class*=tblDonorInfoForProcess] tr:last-child').find('td:last-child').find('i.healthStatus').remove();
    $('table[class*=tblDonorInfoForProcess] tr:last-child').find('td:last-child').append(btnHealth);
}
function GetBloodTest() {
    $('#tblBloodTest tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = _DonorId;
    objBO.VisitId = _VisitId;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetBloodTest";
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
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        ResultValue = (val.ResultValue == null) ? '' : val.ResultValue;
                        IsChecked = (val.ResultValue != null) ? 'checked' : '-';
                        IsDisabled = (val.ResultValue != null) ? '-' : 'Disabled';

                        if (val.Method != null)
                            tbody += "<tr class='selected'>";
                        else
                            tbody += "<tr>";

                        tbody += "<td style='padding:0px 5px'><input type='checkbox' " + IsChecked + "/></td>";
                        tbody += "<td class='hide'>" + val.testId + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";
                        tbody += "<td>" + val.BloodCollection_Id + "</td>";
                        tbody += "<td><select id='ddlMethod' " + IsDisabled + " class='form-control'>";
                        tbody += (val.Method == '') ? "<option selected>--" : "<option>--";
                        tbody += (val.Method == 'Elisa') ? "<option selected>Elisa" : "<option>Elisa";
                        tbody += (val.Method == 'Spot') ? "<option selected>Spot" : "<option>Spot";
                        tbody += (val.Method == 'Spot2') ? "<option selected>Spot2" : "<option>Spot2";
                        tbody += (val.Method == 'Elisa2') ? "<option selected>Elisa2" : "<option>Elisa2";
                        tbody += "</select></td>";
                        tbody += "<td><input type='text' " + IsDisabled + " class='form-control' value='" + ResultValue + "'/></td>";
                        tbody += "<td><select id='ddlResult' " + IsDisabled + " class='form-control'>";
                        tbody += (val.Result == '') ? "<option selected>--" : "<option>--";

                        if ((val.TestName != 'MP') && (val.TestName != 'VDRL')) {
                            tbody += (val.Result == 'NonReactive') ? "<option selected>NonReactive" : "<option>NonReactive";
                            tbody += (val.Result == 'Reactive') ? "<option selected>Reactive" : "<option>Reactive";
                        }

                        tbody += (val.Result == 'Negative') ? "<option selected>Negative" : "<option>Negative";
                        tbody += (val.Result == 'Positive') ? "<option selected>Positive" : "<option>Positive";
                        tbody += "</select></td>";
                        tbody += "</tr>";
                    });
                    $('#tblBloodTest tbody').append(tbody);
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
//Insert Update Collection Info
function CollectionInfo() {
    ClearCollectionInfo();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = _DonorId;
    objBO.VisitId = _VisitId;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "CollectionInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlDonationCompleted').val(val.Isdonated).change();
                        $('#txtCollectionRemark').val(val.CollectionRemark);
                        $('#ddlCollectionBagType').val(val.BagType).change();
                        $('#ddlCollectionVolumeTaken').val(val.Volume).change();
                        $('#txtCollectionBBTubeNo').val(val.BBTubeNo);
                        if (val.IsShocked == 1)
                            $('input[name=PoorShocked]').prop('checked', true);
                        else
                            $('input[name=PoorShocked]').prop('checked', false);
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertUpdateCollection() {
    if (ValidateCollection()) {
        if (confirm('Are you sure?')) {
            var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyCollectionInfo";
            var objBO = {};
            objBO.Hosp_Id = Active.HospId;
            objBO.Donor_id = _DonorId;
            objBO.Visit_ID = _VisitId;
            objBO.BloodCollection_Id = _BloodCollectionId;
            objBO.TubeNo = $('#txtCollectionBBTubeNo').val();
            objBO.BagType = $('#ddlCollectionBagType option:selected').val();
            objBO.Volume = $('#ddlCollectionVolumeTaken option:selected').val();
            objBO.CollectionRemark = $('#txtCollectionRemark').val();
            objBO.CollectionBy = Active.userId;
            objBO.Phlebotomy = $('#ddlIsPhlebotomy option:selected').val();
            objBO.Isdonated = $('#ddlDonationCompleted option:selected').val();
            objBO.IsShocked = ($('input[name=PoorShocked]').is(':checked')) ? 1 : 0;
            objBO.login_id = Active.userId;
            objBO.Logic = (_BloodCollectionId == 'New') ? 'Insert' : 'Update';
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                success: function (data) {
                    if (data.includes('Success')) {
                        alert('Successfully Saved..!');
                        ClearCollectionInfo();
                        DonorProcess("Donor:Inprocess");
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
}
function ApproveCollection() {
    if (confirm('Are you sure to Approve?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyCollectionInfo";
        var objBO = {};
        objBO.Hosp_Id = Active.HospId;
        objBO.Donor_id = _DonorId;
        objBO.Visit_ID = _VisitId;
        objBO.BloodCollection_Id = _BloodCollectionId;
        objBO.TubeNo = '-';
        objBO.BagType = '-';
        objBO.Volume = '-';
        objBO.CollectionRemark = '-';
        objBO.CollectionBy = Active.userId;
        objBO.Isdonated = '-';
        objBO.IsShocked = 1;
        objBO.login_id = Active.userId;
        objBO.Logic = "Approve";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Successfully Approved..!');
                    DonorProcess("Donor:Inprocess");
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
function ValidateCollection() {
    var DonorId = _DonorId;
    var VisitID = _VisitId;
    var BloodCollectionId = _BloodCollectionId;
    var Isdonated = $('#ddlDonationCompleted option:selected').text();
    var CollectionRemark = $('#txtCollectionRemark').val();
    var BagType = $('#ddlCollectionBagType option:selected').text();
    var Volume = $('#ddlCollectionVolumeTaken option:selected').text();
    var TubeNo = $('#txtCollectionBBTubeNo').val();
    var IsShocked = ($('input[name=PoorShocked]').is(':checked')) ? 1 : 0;

    if (Isdonated == 'Select') {
        $('span.selection').find('span[aria-labelledby=select2-ddlDonationCompleted-container]').css('border-color', 'red').focus();
        alert('Please Select Donation Status..');
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlDonationCompleted-container]').removeAttr('style');
    }
    if (CollectionRemark == '') {
        $('#txtCollectionRemark').css('border-color', 'red').focus();
        alert('Please Provide Collection Remark..');
        return false;
    }
    else {
        $('#txtCollectionRemark').removeAttr('style');
    }
    if (Isdonated == 'Yes') {
        if (BagType == 'Select') {
            $('span.selection').find('span[aria-labelledby=select2-ddlCollectionBagType-container]').css('border-color', 'red').focus();
            alert('Please Select Bag Type..');
            return false;
        }
        else {
            $('span.selection').find('span[aria-labelledby=select2-ddlCollectionBagType-container]').removeAttr('style');
        }
        if (Volume == 'Select') {
            $('span.selection').find('span[aria-labelledby=select2-ddlCollectionVolumeTaken-container]').css('border-color', 'red').focus();
            alert('Please Select Volume Taken..');
            return false;
        }
        else {
            $('span.selection').find('span[aria-labelledby=select2-ddlCollectionVolumeTaken-container]').removeAttr('style');
        }
        if (TubeNo == '') {
            $('#txtCollectionBBTubeNo').css('border-color', 'red').focus();
            alert('Please Provide Tube No..');
            return false;
        }
        else {
            $('#txtCollectionBBTubeNo').removeAttr('style');
        }
    }
    return true;
}
function ClearCollectionInfo() {
    $('#ddlDonationCompleted').prop('selectedIndex', '2').change();
    $('#ddlCollectionBagType').prop('selectedIndex', '0').change();
    $('#ddlCollectionVolumeTaken').prop('selectedIndex', '0').change();
    $('#txtCollectionBBTubeNo').val('');
    $('#txtCollectionRemark').val('');
}

//Insert Update Group Info
function GroupedInfo() {
    ClearGroupingInfo();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = _DonorId;
    objBO.VisitId = _VisitId;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GroupedInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('input[name=AntiA]').val([val.AntiA]).change();
                        $('input[name=AntiB]').val([val.AntiB]).change();
                        $('input[name=AntiAB]').val([val.AntiAB]).change();
                        $('input[name=AntiRH]').val([val.RH]).change();
                        $('input[name=ACell]').val([val.ACell]).change();
                        $('input[name=BCell]').val([val.BCell]).change();
                        $('input[name=OCell]').val([val.OCell]).change();
                    });
                    $('Alloted').text($('#tblAntigen tbody tr.bg-success').find('td:eq(4)').text());
                    $('Group').text($('#tblCell tbody tr.bg-success').find('td:eq(5)').text());
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertUpdateGroupingInfo() {
    if (ValidateGroupingInfo()) {
        if (confirm('Are you sure?')) {
            var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyGroupingInfo";
            var objBO = {};
            objBO.hosp_id = Active.HospId;
            objBO.donor_id = _DonorId;
            objBO.visit_id = _VisitId;
            objBO.BloodCollection_Id = _BloodCollectionId;
            objBO.ScreenedBG = '-';
            objBO.AntiA = $('input[name=AntiA]:checked').val();
            objBO.AntiB = $('input[name=AntiB]:checked').val();
            objBO.AntiAB = $('input[name=AntiAB]:checked').val();
            objBO.RH = $('input[name=AntiRH]:checked').val();
            objBO.BloodTested = $('#tblAntigen tbody tr.bg-success').find('td:eq(4)').text();
            objBO.Remark = '-';
            objBO.CreatedBy = Active.userId;
            objBO.ACell = $('input[name=ACell]:checked').val();
            objBO.BCell = $('input[name=BCell]:checked').val();
            objBO.OCell = $('input[name=OCell]:checked').val();
            objBO.BloodGroupAlloted = $('#tblCell tbody tr.bg-success').find('td:eq(3)').text();
            objBO.IsMotherSample = 1;
            objBO.IsMType = 1;
            objBO.IsMTested = 1;
            objBO.LedgerType = 1;
            objBO.BGTested = '-';
            objBO.MotherBG = '-';
            objBO.Logic = 'Insert';
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                success: function (data) {
                    if (data.includes('Success')) {
                        alert('Successfully Saved..!');
                        ClearGroupingInfo();
                        DonorProcess("Donor:Inprocess");
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
}
function ApproveGroupInfo() {
    if (confirm('Are you sure to Approve?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyGroupingInfo";
        var objBO = {};
        objBO.hosp_id = Active.HospId;
        objBO.donor_id = _DonorId;
        objBO.visit_id = _VisitId;
        objBO.bb_Grouping_Id = _bbGroupingId;
        objBO.BloodCollection_Id = _BloodCollectionId;
        objBO.ScreenedBG = '-';
        objBO.AntiA = '-';
        objBO.AntiB = '-';
        objBO.AntiAB = '-';
        objBO.RH = '-';
        objBO.BloodTested = '-';
        objBO.Remark = '-';
        objBO.CreatedBy = Active.userId;
        objBO.ACell = '-';
        objBO.BCell = '-';
        objBO.OCell = '-';
        objBO.BloodGroupAlloted = '-';
        objBO.IsMotherSample = 1;
        objBO.IsMType = 1;
        objBO.IsMTested = 1;
        objBO.LedgerType = 1;
        objBO.BGTested = '-';
        objBO.MotherBG = '-';
        objBO.Logic = 'Approve';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Successfully Approved..!');
                    DonorProcess("Donor:Inprocess");
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
function ValidateGroupingInfo() {
    var IsAntigen = $('#tblAntigen tbody tr.bg-success').length;
    var IsCell = $('#tblCell tbody tr.bg-success').length;

    if (IsAntigen == 0) {
        alert('Please Select Antigen Value..');
        return false;
    }
    if (IsCell == 0) {
        alert('Please Select Cell Value..');
        return false;
    }
    return true;
}
function ClearGroupingInfo() {
    $('.radioList').find('input[type=radio]').prop('checked', false);
    $('#tblAntigen tbody tr').removeClass('bg-success');
    $('#tblCell tbody tr').removeClass('bg-success');
    $('#btnSaveGroupInfo').prop('disabled', true);
}
function IsValidGroupInfo() {
    var IsAntigen = $('#tblAntigen tbody tr.bg-success').length;
    var IsCell = $('#tblCell tbody tr.bg-success').length;
    var AntigenGroup = $('#tblAntigen tbody tr.bg-success').find('td:eq(5)').text();
    var CellGroup = $('#tblCell tbody tr.bg-success').find('td:eq(3)').text();
    console.log(AntigenGroup + CellGroup)
    if (AntigenGroup != '' && CellGroup != '') {
        if (AntigenGroup == CellGroup) {
            $('#lblBBNotSame').hide();
            $('#btnSaveGroupInfo').prop('disabled', false);
        }
        else {
            $('#lblBBNotSame').show();
            $('#btnSaveGroupInfo').prop('disabled', true);
        }
    }
    //if ((IsAntigen + IsCell) == 2)
    //    $('#btnSaveGroupInfo').prop('disabled', false);
    //else
    //    $('#btnSaveGroupInfo').prop('disabled', true);
}

//Component Creation Section
function ComponentInfo() {
    $('#tblComponentInfo tbody').empty();
    $('#tblAllotedComponentInfo tbody').empty();
    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = '-';
    objBO.VisitId = '-';
    objBO.Prm1 = _BloodCollectionId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "ComponentCreation:ComponentInfo";
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
                    var counter = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += (val.ComponentID == 'COMP01') ? "<td style='padding:0px 5px'><input class='whole' type='checkbox'/>" : "<td style='padding:0px 5px'><input type='checkbox'/>";
                        tbody += "<td class='hide'>" + val.ComponentID + "</td>";
                        tbody += "<td class='hide'>" + val.isComponent + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td>" + val.AliasName + "</td>";
                        tbody += "<td><input type='text' disabled class='form-control' style='height: 24px;padding: 4px;text-align:right' value='1'/></td>";
                        tbody += "<td><select id='ddlPackSize' class='form-control' style='height: 24px;padding: 4px;'>";
                        tbody += "<option>Select";
                        tbody += "<option>350 ml";
                        tbody += "<option>450 ml";
                        tbody += "</select></td>";
                        tbody += "<td>" + val.expDate + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblComponentInfo tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbody = "";
                    var counter = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        counter++;
                        tbody += "<tr>";
                        tbody += "<td class='hide'>" + val.AutoId + "</td>";
                        tbody += "<td class='hide'>" + val.ComponentID + "</td>";
                        tbody += "<td>" + val.ComponentName + "</td>";
                        tbody += "<td class='text-right'>" + val.Qty + "</td>";
                        tbody += "<td class='text-right'>" + val.PackSize + "</td>";
                        tbody += "<td>" + val.ExpiryDate + "</td>";
                        tbody += "<td style='padding:0px 5px'><button onclick=DeleteComponent(" + val.AutoId + ") style='height: 17px;line-height:0;' class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblAllotedComponentInfo tbody').append(tbody);
                }
            }
        },
        complete: function () {
            $('#tblAllotedComponentInfo tbody tr').each(function () {
                var componentId = $(this).find('td:eq(1)').text();
                $('#tblComponentInfo tbody tr').each(function () {
                    if ($(this).find('td:eq(1)').text() == componentId)
                        $(this).closest('tr').remove();
                });
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertComponentReation() {
    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyComponentCreation";
        var objBO = {};
        var componentInfo = [];
        if ($('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').length == 0) {
            alert('Please Select Component.');
            return
        }
        $('#tblComponentInfo tbody tr').find('input[type=checkbox]:checked').each(function () {
            if ($(this).closest('tr').find('td:eq(6)').find('#ddlPackSize option:selected').text() == 'Select')
                $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').addClass('error');
            else
                $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize').removeClass('error');
        });
        if ($('#tblComponentInfo tbody .error').length > 0) {
            alert('Please Select Pack Size.');
            return
        }
        $('#tblComponentInfo tbody tr').each(function () {
            if ($(this).find('input[type=checkbox]').is(':checked')) {
                var date = $(this).closest('tr').find('td:eq(7)').text();
                componentInfo.push({
                    'ComponentID': $(this).closest('tr').find('td:eq(1)').text(),
                    'ComponentName': $(this).closest('tr').find('td:eq(3)').text(),
                    'Qty': $(this).closest('tr').find('td:eq(5)').find('input:text').val(),
                    'PackSize': $(this).closest('tr').find('td:eq(6)').find('#ddlPackSize option:selected').text(),
                    'IsComponent': $(this).closest('tr').find('td:eq(2)').text(),
                    'EntryDate': '1900/01/01',
                    'ExpiryDate': date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0]
                });
            }
        });
        objBO.hosp_id = Active.unitId;
        objBO.donor_id = _DonorId;
        objBO.visit_id = _VisitId;
        objBO.BloodCollection_Id = _BloodCollectionId;
        objBO.BagType = _BagType;
        objBO.BBTubeNo = _BBTubeNo;
        objBO.BloodGroup = _BloodGroup;
        objBO.componentInfo = componentInfo;
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    ComponentInfo();
                    DonorProcess("Donor:Inprocess");
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
function DeleteComponent(AutoId) {
    if (confirm('Are you sure to delete?')) {
        var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyComponentCreation";
        var objBO = {};
        var componentInfo = [];
        componentInfo.push({
            'ComponentID': '-',
            'ComponentName': '-',
            'Qty': 0,
            'PackSize': '-',
            'IsComponent': 0,
            'EntryDate': '1900/01/01',
            'ExpiryDate': '1900/01/01'
        });
        objBO.hosp_id = Active.unitId;
        objBO.donor_id = AutoId;
        objBO.visit_id = '-';
        objBO.BloodCollection_Id = '-';
        objBO.BagType = '-';;
        objBO.BBTubeNo = '-';
        objBO.BloodGroup = '-';
        objBO.componentInfo = componentInfo;
        objBO.login_id = Active.userId;
        objBO.Logic = 'Delete';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    ComponentInfo();
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
//Insert Update Screening Info
function InsertScreeningInfo() {
    if (confirm('Are you sure?')) {
        if (ValidateScreen()) {
            var url = config.baseUrl + "/api/BloodBank/BB_InsertModifyBloodScreening";
            var objBO = {};
            var objScreeningValue = [];
            var count = 0;
            var selectedLength = $('#tblBloodTest tbody tr.selected').length;
            if (selectedLength == 0) {
                alert('Please Choose Test.');
                return;
            }

            $('#tblBloodTest tbody tr').each(function () {
                if ($(this).find('input[type=checkbox]').is(':checked')) {
                    count++;
                    objScreeningValue.push({
                        'BloodCollection_Id': $(this).closest('tr').find('td:eq(3)').text(),
                        'TestId': $(this).closest('tr').find('td:eq(1)').text(),
                        'Method': $(this).closest('tr').find('td:eq(4)').find('select option:selected').text(),
                        'resultValue': $(this).closest('tr').find('td:eq(5)').find('input:text').val(),
                        'Result': $(this).closest('tr').find('td:eq(6)').find('select option:selected').text()
                    });
                }
            });
            objBO.hosp_id = Active.unitId;
            objBO.donor_id = _DonorId;
            objBO.visit_id = _VisitId;
            objBO.screening_id = '-';
            objBO.ScreeningValue = objScreeningValue;
            objBO.login_id = Active.userId;
            objBO.Logic = '-';
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                success: function (data) {
                    if (data.includes('Success')) {
                        alert('Successfully Saved..!');
                        DonorProcess("Donor:Inprocess");
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
        else
            alert('Please Provide Mendatory Values.');
    }
}
function ValidateScreen() {
    $('#tblBloodTest tbody tr').find('input[type=checkbox]:checked').each(function () {
        $('#tblBloodTest tbody').removeClass('error');
        var testName = $(this).closest('tr').find('td:eq(1)').text();
        var method = $(this).closest('tr').find('#ddlMethod option:selected').text();
        var value = $(this).closest('tr').find('input:text').val();
        var result = $(this).closest('tr').find('#ddlResult option:selected').text();
        if (method == '--') {
            $(this).closest('tr').find('#ddlMethod').addClass('error');
            $(this).closest('tr').find('input:text').val('').prop('disabled', true);
            $(this).closest('tr').find('#ddlResult').prop('selectedIndex', '0').prop('disabled', true);
        }
        else {
            $(this).closest('tr').find('#ddlMethod').removeClass('error');
        }
        if (method.includes('Elisa')) {
            $(this).closest('tr').find('input:text').prop('disabled', false);
            $(this).closest('tr').find('#ddlResult').prop('disabled', false);
            if (value == '') {
                $(this).closest('tr').find('input:text').addClass('error');
            }
            else {
                $(this).closest('tr').find('input:text').removeClass('error');
            }
            if (result == '--') {
                $(this).closest('tr').find('#ddlResult').addClass('error');
            }
            else {
                $(this).closest('tr').find('#ddlResult').removeClass('error');
            }
        }
        if (method.includes('Spot')) {
            $(this).closest('tr').find('input:text').val('').prop('disabled', true);
            $(this).closest('tr').find('#ddlResult').prop('disabled', false);
            if (result == '--') {
                $(this).closest('tr').find('#ddlResult').addClass('error');
            }
            else {
                $(this).closest('tr').find('#ddlResult').removeClass('error');
            }
        }
    });
    return ($('#tblBloodTest tbody').find('.error').length == 0) ? true : false;
}
function ClearScreenInfo() {
    $('#tblBloodTest tbody').removeClass('error');
    $('#tblBloodTest tbody tr').removeClass('selected');
    $('#tblBloodTest tbody').find('input:text').val('');
    $('#tblBloodTest tbody').find('select').prop('selectedIndex', '0');
    $('#tblBloodTest tbody').find('.form-control').prop('disabled', true);
    $('#tblBloodTest tbody').find('input:checkbox').prop('checked', false);
}

function GetInfoForApproval() {
    $('#tblApprovalComponentInfo tbody').empty();
    $('#tblApproveScreenedInfo tbody').empty();
    $('#tblApprAntigen tbody tr').removeClass('bg-success');
    $('#tblApprCell tbody tr').removeClass('bg-success');
    $('.lblBBApprovalInfo* Alloted').text('');
    $('.lblBBApprovalInfo* Cell').text('');
    $('.tblApproveInfo .txtBagType').text('-');
    $('.tblApproveInfo .txtVolumeTaken').text('-');
    $('.tblApproveInfo .txtBBTubeNo').text('-');
    $('.tblApproveInfo .txtCollectionRemark').text('-');

    var url = config.baseUrl + "/api/BloodBank/BB_SelectQueries";
    var objBO = {};
    objBO.hosp_id = Active.HospId;
    objBO.DonorId = _DonorId;
    objBO.VisitId = _VisitId;
    objBO.Prm1 = _BloodCollectionId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetInfoForApproval";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {          
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('.tblApproveInfo .txtBagType').text(val.BagType);
                        $('.tblApproveInfo .txtVolumeTaken').text(val.Volume);
                        $('.tblApproveInfo .txtBBTubeNo').text(val.BBTubeNo);
                        $('.tblApproveInfo .txtCollectionRemark').text(val.CollectionRemark);
                    });
                }
                if (Object.keys(data.ResultSet.Table1).length) {
                    var tbodyComponent = "";
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbodyComponent += "<tr>";
                        tbodyComponent += "<td>" + val.ComponentName + "</td>";
                        tbodyComponent += "<td class='text-right'>" + val.Qty + "</td>";
                        tbodyComponent += "<td>" + val.PackSize + "</td>";
                        tbodyComponent += "<td>" + val.ExpiryDate + "</td>";
                        tbodyComponent += "</tr>";
                    });
                    $('#tblApprovalComponentInfo tbody').append(tbodyComponent);
                }
                if (Object.keys(data.ResultSet.Table2).length) {
                    var tbodyScreened = "";
                    $('#DiscardedInfo').text('');
                    $.each(data.ResultSet.Table2, function (key, val) {
                        if (_IsDiscarded == 'N') {
                            if (val.Result != null) {
                                if (val.Result.includes('Positive') || val.Result.includes('Reactive')) {
                                    $('#DiscardedInfo').text('Blood is going to be Discarded.');
                                    $('button[id=btnApproveFinal]').text('Discard').addClass('btn-danger').removeClass('btn-success');
                                }
                            }
                        }
                        tbodyScreened += "<tr>";
                        tbodyScreened += "<td>" + val.TestName + "</td>";
                        tbodyScreened += "<td>" + val.BloodCollection_Id + "</td>";
                        tbodyScreened += "<td>" + val.Method + "</td>";
                        tbodyScreened += "<td>" + val.ResultValue + "</td>";
                        tbodyScreened += "<td>" + val.Result + "</td>";
                        tbodyScreened += "</tr>";
                    });
                    $('#tblApproveScreenedInfo tbody').append(tbodyScreened);             
                    if (_IsDiscarded == 'Y') {
                        $('#lblApproveStatus').text('Blood is Discarded.').css('background', 'red').show();
                    }
                    else {
                        $('#lblApproveStatus').removeAttr('style');
                        $('#DiscardedInfo').text('-');
                        $('button[id=btnApproveFinal]').text('Approve').addClass('btn-success').removeClass('btn-danger');
                    }
                }
                if (Object.keys(data.ResultSet.Table3).length) {
                    var Antigen = "";
                    var Cell = "";
                    $.each(data.ResultSet.Table3, function (key, val) {
                        Antigen += val.AntiA + val.AntiB + val.AntiAB + val.RH;
                        Cell += val.ACell + val.BCell + val.OCell;
                    });
                    $('#tblApprAntigen tbody tr').each(function () {
                        if ($(this).attr('class') == Antigen)
                            $(this).addClass('bg-success');
                    });
                    $('#tblApprCell tbody tr').each(function () {
                        if ($(this).attr('class') == Cell)
                            $(this).addClass('bg-success');
                    });

                    $('.lblBBApprovalInfo* Alloted').text($('#tblApprAntigen tbody tr.bg-success').find('td:eq(4)').text());
                    $('.lblBBApprovalInfo* Cell').text($('#tblApprAntigen tbody tr.bg-success').find('td:eq(5)').text());
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ApproveDonation() {
    if (confirm('Are you sure to Approve')) {
        var url = config.baseUrl + "/api/BloodBank/BB_ApproveDonation";
        var objBO = {};
        objBO.hosp_id = Active.HospId;
        objBO.donor_id = _DonorId;
        objBO.visit_id = _VisitId;
        objBO.BloodCollectionId = _BloodCollectionId;
        objBO.Prm1 = '-';
        objBO.Prm2 = '-';
        objBO.login_id = Active.userId;
        objBO.Logic = "Approve";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
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