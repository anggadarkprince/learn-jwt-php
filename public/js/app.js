$(document).ready(function () {
    showHomePage();

    // remove any prompt messages
    function clearResponse() {
        $('#response').html('');
    }

    // show sign up / registration form
    $(document).on('click', '#sign_up', function (e) {
        e.preventDefault();

        const html = `
                <h3>Sign Up</h3>
                <form id='sign_up_form'>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" name="name" id="name" placeholder="Full name" required />
                    </div>

                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" name="username" id="username" placeholder="Username" required />
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" name="email" id="email" placeholder="Email address" required />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password" required />
                    </div>

                    <button type='submit' class='btn btn-primary'>Sign Up</button>
                </form>
            `;

        clearResponse();
        $('#content').html(html);
    });

    // trigger when registration form is submitted
    $(document).on('submit', '#sign_up_form', function () {
        const sign_up_form = $(this);
        const form_data = JSON.stringify(sign_up_form.serializeObject());

        // submit form data to api
        $.ajax({
            url: "api/create_user.php",
            type: "POST",
            contentType: 'application/json',
            data: form_data,
            success: function (result) {
                // if response is a success, tell the user it was a successful sign up & empty the input boxes
                $('#response').html("<div class='alert alert-success'>Successful sign up. Please login.</div>");
                sign_up_form.find('input').val('');
            },
            error: function (xhr, resp, text) {
                // on error, tell the user sign up failed
                $('#response').html("<div class='alert alert-danger'>Unable to sign up. Please contact your administrator.</div>");
            }
        });

        return false;
    });


    // show login form
    $(document).on('click', '#login', function (e) {
        e.preventDefault();
        showLoginPage();
    });

    // if the user is logged in
    function showLoggedInMenu() {
        // hide login and sign up from navbar & show logout button
        $("#login, #sign_up").hide();
        $("#logout, #account").show();
    }

    // if the user is logged out
    function showLoggedOutMenu() {
        // show login and sign up from navbar & hide logout button
        $("#login, #sign_up").show();
        $("#logout, #account").hide();
    }

    // function to set cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // get or read cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // show login page
    function showLoginPage() {
        // remove jwt
        setCookie("jwt", "", 1);

        // login page html
        var html = `
                <h2>Login</h2>
                <form id='login_form'>
                    <div class='form-group'>
                        <label for='email'>Email address</label>
                        <input type='email' class='form-control' id='email' name='email' placeholder='Enter email'>
                    </div>

                    <div class='form-group'>
                        <label for='password'>Password</label>
                        <input type='password' class='form-control' id='password' name='password' placeholder='Password'>
                    </div>

                    <button type='submit' class='btn btn-primary'>Login</button>
                </form>
            `;

        $('#content').html(html);
        clearResponse();
        showLoggedOutMenu();
    }

    // trigger when login form is submitted
    $(document).on('submit', '#login_form', function () {
        var login_form = $(this);
        var form_data = JSON.stringify(login_form.serializeObject());

        // submit form data to api
        $.ajax({
            url: "api/login.php",
            type: "POST",
            contentType: 'application/json',
            data: form_data,
            success: function (result) {
                // store jwt to cookie
                setCookie("jwt", result.jwt, 1);

                // show home page & tell the user it was a successful login
                showHomePage();
                $('#response').html("<div class='alert alert-success'>Successful login.</div>");

            },
            error: function (xhr, resp, text) {
                // on error, tell the user login has failed & empty the input boxes
                $('#response').html("<div class='alert alert-danger'>Login failed. Email or password is incorrect.</div>");
                login_form.find('input').val('');
            }
        });

        return false;
    });

    // show home page
    $(document).on('click', '#home', function (e) {
        e.preventDefault();
        showHomePage();
        clearResponse();
    });

    // show home page
    function showHomePage() {
        // validate jwt to verify access
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({jwt: jwt}))
            .done(function (result) {
                // if valid, show homepage
                var html = `
                    <div class="card">
                        <div class="card-header">Welcome to Home!</div>
                        <div class="card-body">
                            <h5 class="card-title">You are logged in.</h5>
                            <p class="card-text">You won't be able to access the home and account pages if you are not logged in.</p>
                        </div>
                    </div>
                    `;

                $('#content').html(html);
                showLoggedInMenu();
            })
            .fail(function (result) {
                showLoginPage();
                $('#response').html("<div class='alert alert-danger'>Please login to access the home page.</div>");
            });
    }


    // show update account form
    $(document).on('click', '#account', function (e) {
        e.preventDefault();

        // validate jwt to verify access
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({jwt: jwt}))
            .done(function (result) {
                // if response is valid, put user details in the form
                var html = `
                        <h3>Update Account</h3>
                        <form id='update_account_form'>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" class="form-control" name="name" id="name" required value="` + result.data.name + `" placeholder="Full name" />
                            </div>

                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" name="username" id="username" required value="` + result.data.username + `" placeholder="Username" />
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" name="email" id="email" required value="` + result.data.email + `" placeholder="Email address" />
                            </div>

                            <div class="form-group">
                                <label for="password">New Password</label>
                                <input type="password" class="form-control" name="password" id="password" placeholder="New password" />
                            </div>

                            <button type='submit' class='btn btn-primary'>
                                Save Changes
                            </button>
                        </form>
                    `;

                clearResponse();
                $('#content').html(html);
            })
            .fail(function (result) {
                showLoginPage();
                $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
            });
    });

    // trigger when 'update account' form is submitted
    $(document).on('submit', '#update_account_form', function () {
        // handle for update_account_form
        var update_account_form = $(this);

        // validate jwt to verify access
        var jwt = getCookie('jwt');

        // get form data
        var update_account_form_obj = update_account_form.serializeObject();

        // add jwt on the object
        update_account_form_obj.jwt = jwt;

        // convert object to json string
        var form_data = JSON.stringify(update_account_form_obj);

        // submit form data to api
        $.ajax({
            url: "api/update_user.php",
            type: "POST",
            contentType: 'application/json',
            data: form_data,
            success: function (result) {

                // tell the user account was updated
                $('#response').html("<div class='alert alert-success'>Account was updated.</div>");

                // store new jwt to cookie
                setCookie("jwt", result.jwt, 1);
            },
            error: function (xhr, resp, text) {
                if (xhr.responseJSON.message == "Unable to update user.") {
                    $('#response').html("<div class='alert alert-danger'>Unable to update account.</div>");
                } else if (xhr.responseJSON.message == "Access denied.") {
                    showLoginPage();
                    $('#response').html("<div class='alert alert-success'>Access denied. Please login</div>");
                }
            }
        });

        return false;
    });

    $(document).on('click', '#logout', function (e) {
        e.preventDefault();

        showLoginPage();
        $('#response').html("<div class='alert alert-info'>You are logged out.</div>");
    });

    // function to make form values to json format
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
});