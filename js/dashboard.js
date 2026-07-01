"use strict";

/* ===========================================================
   BookMyRoom Enterprise
   Authentication & Session Manager
=========================================================== */

const Auth = {

    /* =======================================================
       SAVE USER SESSION
    ======================================================= */

    save(user) {

        if (!user) {

            console.error("Invalid user.");

            return;

        }

        localStorage.setItem(

            "bookmyroom_user",

            JSON.stringify(user)

        );

    },

    /* =======================================================
       GET CURRENT USER
    ======================================================= */

    current() {

        try {

            return JSON.parse(

                localStorage.getItem(

                    "bookmyroom_user"

                )

            );

        }

        catch {

            return null;

        }

    },

    /* =======================================================
       IS LOGGED IN
    ======================================================= */

    isLoggedIn() {

        return !!this.current();

    },

    /* =======================================================
       USER ROLE
    ======================================================= */

    role() {

        return this.current()?.role || "";

    },

    /* =======================================================
       IS ADMIN
    ======================================================= */

    isAdmin() {

        return this.role() === "ADMIN";

    },

    /* =======================================================
       IS GUEST
    ======================================================= */

    isGuest() {

        return this.role() === "GUEST";

    },

    /* =======================================================
       REQUIRE LOGIN
    ======================================================= */

    requireLogin() {

        if (!this.isLoggedIn()) {

            window.location.replace(

                "index.html"

            );

        }

    },

    /* =======================================================
       REQUIRE ADMIN
    ======================================================= */

    requireAdmin() {

        this.requireLogin();

        if (!this.isAdmin()) {

            window.location.replace(

                "index.html"

            );

        }

    },

    /* =======================================================
       REQUIRE GUEST
    ======================================================= */

    requireGuest() {

        this.requireLogin();

        if (!this.isGuest()) {

            window.location.replace(

                "index.html"

            );

        }

    },

    /* =======================================================
       LOGOUT
    ======================================================= */

    logout() {

        localStorage.removeItem(

            "bookmyroom_user"

        );

        sessionStorage.removeItem(

            "bookingMode"

        );

        window.location.replace(
            "index.html"

        );

    }

};

/* ===========================================================
   BACKWARD COMPATIBILITY
=========================================================== */

/*
   These wrappers ensure that your existing
   code continues to work while we migrate
   to Auth.current(), Auth.logout(), etc.
*/

function saveUser(user) {

    Auth.save(user);

}

function getUser() {

    return Auth.current();

}

function logout() {

    Auth.logout();

}