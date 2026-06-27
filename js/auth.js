/* =====================================================
   BookMyRoom Pro
   Authentication
===================================================== */

"use strict";

/* ==========================================
   ELEMENTS
========================================== */

const adminLoginBtn =
    document.getElementById("adminLoginBtn");

const guestLoginBtn =
    document.getElementById("guestLoginBtn");

const guestRegisterBtn =
    document.getElementById("guestRegisterBtn");

/* ==========================================
   ADMIN LOGIN
========================================== */

if (adminLoginBtn) {

    adminLoginBtn.addEventListener(

        "click",

        adminLogin

    );

}

async function adminLogin() {

    try {

        const username =
            document
            .getElementById("adminUsername")
            .value
            .trim();

        const password =
            document
            .getElementById("adminPassword")
            .value;

        if (!username || !password) {

            alert("Enter Username and Password");

            return;

        }

        const result = await apiRequest(

            "/auth/login",

            "POST",

            {

                username,

                password

            }

        );

        saveUser({

            ...result.user,

            role: "ADMIN"

        });

        window.location.href =
            "admin.html";

    }

    catch (err) {

        alert(err.message);

    }

}

/* ==========================================
   GUEST REGISTER
========================================== */

if (guestRegisterBtn) {

    guestRegisterBtn.addEventListener(

        "click",

        guestRegister

    );

}

async function guestRegister() {

    try {

        const guest_name =
            document
            .getElementById("guestName")
            .value
            .trim();

        const mobile =
            document
            .getElementById("guestRegisterMobile")
            .value
            .trim();

        const password =
            document
            .getElementById("guestRegisterPassword")
            .value;

        if (

            !guest_name ||

            !mobile ||

            !password

        ) {

            alert(

                "Please fill all fields."

            );

            return;

        }

        const result =
            await apiRequest(

                "/guests/register",

                "POST",

                {

                    guest_name,

                    mobile,

                    password

                }

            );

        saveUser({

            ...result.guest,

            role: "GUEST"

        });

        alert(

            "Registration Successful"

        );

        window.location.href =
            "dashboard.html";

    }

    catch (err) {

        alert(err.message);

    }

}

/* ==========================================
   GUEST LOGIN
========================================== */

if (guestLoginBtn) {

    guestLoginBtn.addEventListener(

        "click",

        guestLogin

    );

}

async function guestLogin() {

    try {

        const mobile =
            document
            .getElementById("guestMobile")
            .value
            .trim();

        const password =
            document
            .getElementById("guestPassword")
            .value;

        if (

            !mobile ||

            !password

        ) {

            alert(

                "Enter Mobile and Password"

            );

            return;

        }

        const result =
            await apiRequest(

                "/guests/login",

                "POST",

                {

                    mobile,

                    password

                }

            );

        saveUser({

            ...result.guest,

            role: "GUEST"

        });

        window.location.href =
            "dashboard.html";

    }

    catch (err) {

        alert(

            err.message

        );

    }

}

/* ==========================================
   AUTO LOGIN
========================================== */

const currentUser = getUser();

if (

    currentUser &&

    window.location.pathname.endsWith(

        "index.html"

    )

) {

    if (

        currentUser.role === "ADMIN"

    ) {

        window.location.href =
            "admin.html";

    }

    else {

        window.location.href =
            "dashboard.html";

    }

}