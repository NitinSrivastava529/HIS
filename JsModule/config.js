
$(window).on('load', function () {
    isLogin();               
});

//Check User Login
function isLogin() {
    var Username = sessionStorage.getItem('Username');
    var UserID = sessionStorage.getItem('UserID');
    if (Username != null) {
        $("<span><i class='fa fa-user-circle'></i>&nbsp;" + Username + "</span>").appendTo($(".LoggedInUser"));
        $(".LoggedInUserMobile").text(Username + ' [' + UserID+']');
    }
    else {
        window.location.href = config.rootUrl;
    }
}

function preventLogin() {
    var Username = sessionStorage.getItem('Username');
    var UserID = sessionStorage.getItem('UserID');
    var loginUrl = window.location.pathname;
    if (Username != null && loginUrl == "ApplicationResource/Login") {
        alert(Username + loginUrl);
    }
}





