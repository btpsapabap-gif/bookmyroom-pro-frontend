/* =====================================================
   BookMyRoom Pro
   Dashboard
===================================================== */

"use strict";

let currentUser = getUser();

let selectedRoom = null;

let rooms = [];

/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);

async function initializeDashboard() {

    if (!currentUser) {

        window.location.href = "index.html";

        return;

    }

    loadUser();

    attachEvents();

    await loadRooms();

}

/* =====================================================
   USER
===================================================== */

function loadUser() {

    document
        .getElementById("welcomeUser")
        .textContent =
        currentUser.guest_name ||
        currentUser.name ||
        "User";

    document
        .getElementById("profileCircle")
        .textContent =
        (
            currentUser.guest_name ||
            currentUser.name ||
            "U"
        )
            .charAt(0)
            .toUpperCase();

}

/* =====================================================
   EVENTS
===================================================== */

function attachEvents() {

    document
        .getElementById("logoutBtn")
        .addEventListener(

            "click",

            logout

        );

    document
        .getElementById("closeModal")
        .addEventListener(

            "click",

            closeBookingModal

        );

}

/* =====================================================
   LOAD ROOMS
===================================================== */

async function loadRooms() {

    try {

        const result =

            await apiRequest(

                "/rooms"

            );

        rooms = result.rooms;

        renderRooms();

    }

    catch (err) {

        alert(

            err.message

        );

    }

}

/* =====================================================
   RENDER ROOMS
===================================================== */

function renderRooms() {

    const container =

        document.getElementById(

            "roomsContainer"

        );

    container.innerHTML = "";

    rooms.forEach(room => {

        const card =

            document.createElement(

                "div"

            );

        card.className =

            "room-card";

        card.innerHTML = `

            <h2>

                ${room.room_name}

            </h2>

            <p>

                ${room.room_type}

            </p>

            <p>

                ${room.floor}

            </p>

            <p>

                Capacity :
                ${room.capacity}

            </p>

            <h3>

                ₹${room.price}

                / Day

            </h3>

            <button
                class="primary-btn">

                Book Now

            </button>

        `;

        card
            .querySelector("button")
            .addEventListener(

                "click",

                () => {

                    openBookingModal(

                        room

                    );

                }

            );

        container.appendChild(

            card

        );

    });

}

/* =====================================================
   OPEN MODAL
===================================================== */

function openBookingModal(room) {

    selectedRoom = room;

    document
        .getElementById("bookingModal")
        .classList
        .remove("hidden");

    document
        .getElementById("selectedRoom")
        .value =
        room.room_name;

    document
        .getElementById("mobile")
        .value =
        currentUser.mobile || "";

}

/* =====================================================
   CLOSE MODAL
===================================================== */

function closeBookingModal() {

    document
        .getElementById("bookingModal")
        .classList
        .add("hidden");

}

/* =====================================================
   DATE CALCULATION
===================================================== */

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");

if (fromDate && toDate) {

    fromDate.addEventListener(
        "change",
        calculateAmount
    );

    toDate.addEventListener(
        "change",
        calculateAmount
    );

}

function calculateAmount() {

    if (!selectedRoom) return;

    const from =
        new Date(fromDate.value);

    const to =
        new Date(toDate.value);

    if (

        !fromDate.value ||

        !toDate.value ||

        to <= from

    ) {

        document
            .getElementById("totalAmount")
            .textContent = "0";

        return;

    }

    const days = Math.ceil(

        (to - from) /

        (1000 * 60 * 60 * 24)

    );

    const amount =

        days *

        Number(selectedRoom.price);

    document
        .getElementById("totalAmount")
        .textContent = amount;

}

/* =====================================================
   CONFIRM BOOKING
===================================================== */

document
    .getElementById("confirmBookingBtn")
    .addEventListener(

        "click",

        createBooking

    );

async function createBooking() {

    try {

        if (!selectedRoom) {

            alert("Please select a room.");

            return;

        }

        const booking = {

            room_id:
                selectedRoom.id,

            guest_id:
                currentUser.role === "GUEST"
                    ? currentUser.id
                    : null,

            employee_id:
                currentUser.role === "ADMIN"
                    ? currentUser.id
                    : null,

            booking_type:

                currentUser.role === "ADMIN"

                    ? "INTERNAL"

                    : "EXTERNAL",

            from_date:
                fromDate.value,

            to_date:
                toDate.value,

            mobile:
                document
                    .getElementById("mobile")
                    .value,

            people:
                Number(

                    document
                        .getElementById("people")
                        .value

                ),

            id_proof:
                document
                    .getElementById("idProof")
                    .value,

            id_proof_no:
                document
                    .getElementById("idProofNo")
                    .value

        };

        if (

            !booking.from_date ||

            !booking.to_date

        ) {

            alert(

                "Select booking dates."

            );

            return;

        }

        const result =
            await apiRequest(

                "/bookings",

                "POST",

                booking

            );

        alert(

            "Booking Confirmed!"

        );

        closeBookingModal();

        await loadRooms();

    }

    catch (err) {

        alert(

            err.message

        );

    }

}

/* =====================================================
   CLOSE ON OUTSIDE CLICK
===================================================== */

window.onclick = function (event) {

    const modal =

        document.getElementById(

            "bookingModal"

        );

    if (event.target === modal) {

        closeBookingModal();

    }

};

/* =====================================================
   MINIMUM DATE
===================================================== */

const today =

    new Date()

        .toISOString()

        .split("T")[0];

fromDate.min = today;

toDate.min = today;