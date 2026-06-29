/* ===========================================================
   BookMyRoom Enterprise
   Guest Dashboard
   Part 1 - Initialization
=========================================================== */

"use strict";

/* ===========================================================
   AUTHENTICATION
=========================================================== */

const currentUser = getUser();

const bookingMode =

    sessionStorage.getItem(

        "bookingMode"

    );

/* -------------------------
   VALIDATE USER
-------------------------- */

if (!currentUser) {

    window.location.replace(

        "index.html"

    );

}

/* -------------------------
   ALLOW
-------------------------- */

if (

    currentUser.role !== "GUEST" &&

    bookingMode !== "ADMIN"

) {

    window.location.replace(

        "index.html"

    );

}

/* ===========================================================
   GLOBAL DATA
=========================================================== */

let rooms = [];

let bookings = [];

let myBookings = [];

let selectedRoom = null;

/* ===========================================================
   PROFILE
=========================================================== */

const guestName =
    document.getElementById("guestName");

const guestMobile =
    document.getElementById("guestMobile");

const profileCircle =
    document.getElementById("profileCircle");

/* ===========================================================
   ROOMS
=========================================================== */

const roomContainer =
    document.getElementById("roomContainer");

/* ===========================================================
   ACTIVE BOOKING
=========================================================== */

const activeBookingCard =
    document.getElementById("activeBookingCard");

const activeBooking =
    document.getElementById("activeBooking");

/* ===========================================================
   BOOKING HISTORY
=========================================================== */

const historyTable =
    document.getElementById("historyTable");

/* ===========================================================
   BOOKING MODAL
=========================================================== */

const bookingModal =
    document.getElementById("bookingModal");

const selectedRoomName =
    document.getElementById("selectedRoomName");

const closeBooking =
    document.getElementById("closeBooking");

const cancelBooking =
    document.getElementById("cancelBooking");

const confirmBooking =
    document.getElementById("confirmBooking");

/* ===========================================================
   BOOKING FORM
=========================================================== */

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");

const people =
    document.getElementById("people");

const mobile =
    document.getElementById("mobile");

const idProof =
    document.getElementById("idProof");

const idProofNo =
    document.getElementById("idProofNo");

const idProofImage =
    document.getElementById("idProofImage");

const imagePreview =
    document.getElementById("imagePreview");

/* ===========================================================
   SUMMARY
=========================================================== */

const roomRate =
    document.getElementById("roomRate");

const stayDays =
    document.getElementById("stayDays");

const totalAmount =
    document.getElementById("totalAmount");

/* ===========================================================
   MENU
=========================================================== */

const historyMenu =
    document.getElementById("historyMenu");

const profileMenu =
    document.getElementById("profileMenu");

const logoutBtn =
    document.getElementById("logoutBtn");

/* ===========================================================
   RECEIPT MODAL
=========================================================== */

const receiptModal =
    document.getElementById("receiptModal");

const receiptContent =
    document.getElementById("receiptContent");

const closeReceiptBtn =
    document.getElementById("closeReceiptBtn");

const printReceiptBtn =
    document.getElementById("printReceiptBtn");

const downloadReceiptBtn =
    document.getElementById("downloadReceiptBtn");

/* ===========================================================
   PROFILE HEADER
=========================================================== */

guestName.textContent =
    currentUser.guest_name ||
    currentUser.name ||
    "Guest";

guestMobile.textContent =
    currentUser.mobile || "";

profileCircle.textContent =
    (
        currentUser.guest_name ||
        currentUser.name ||
        "G"
    )
        .charAt(0)
        .toUpperCase();

mobile.value =
    currentUser.mobile || "";

/* ===========================================================
   EVENTS
=========================================================== */
if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        logout
    );
}

closeBooking.addEventListener(
    "click",
    closeBookingDialog
);

cancelBooking.addEventListener(
    "click",
    closeBookingDialog
);

confirmBooking.addEventListener(
    "click",
    createBooking
);

if (historyMenu) {

    historyMenu.addEventListener(
        "click",
        scrollHistory
    );

    /* ===========================================================
   SCROLL TO BOOKING HISTORY
    =========================================================== */

    function scrollHistory() {

        document.getElementById("historyTable")
            ?.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

    }

}

if (profileMenu) {
    profileMenu.addEventListener(
        "click",
        showProfile
    );
    /* ===========================================================
         PROFILE
    =========================================================== */

    function showProfile() {

        alert(

            "Profile module\n\nComing Soon"

        );

    }
}

fromDate.addEventListener(
    "change",
    updateBookingSummary
);

toDate.addEventListener(
    "change",
    updateBookingSummary
);

people.addEventListener(
    "change",
    updateBookingSummary
);

idProofImage.addEventListener(
    "change",
    previewIDImage
);

closeReceiptBtn.addEventListener(
    "click",
    closeReceipt
);

printReceiptBtn.addEventListener(
    "click",
    printReceipt
);

downloadReceiptBtn.addEventListener(
    "click",
    downloadReceipt
);

/* ===========================================================
   START APPLICATION
=========================================================== */

initializeDashboard();

/* ===========================================================
   BookMyRoom Enterprise
   Guest Dashboard
   Part 2 - Load Guest & Rooms
=========================================================== */

/* ===========================================================
   INITIALIZE DASHBOARD
=========================================================== */

async function initializeDashboard() {

    try {

        showLoading(true);

        await Promise.all([

            loadRooms(),

            loadBookings()

        ]);

        prepareGuestBookings();

        renderRooms();

        renderActiveBooking();

        renderBookingHistory();

    }

    catch (err) {

        console.error(err);

        alert(

            err.message ||

            "Unable to load dashboard."

        );

    }

    finally {

        showLoading(false);

    }

}

/* ===========================================================
   LOAD ROOMS
=========================================================== */

async function loadRooms() {

    const result =

        await apiRequest(

            "/rooms"

        );

    rooms =

        result.rooms || [];

}

/* ===========================================================
   LOAD BOOKINGS
=========================================================== */

async function loadBookings() {

    const result =

        await apiRequest(

            "/bookings"

        );

    bookings =

        result.bookings || [];

}

/* ===========================================================
   MY BOOKINGS
=========================================================== */

function prepareGuestBookings() {

    myBookings = bookings.filter(

        booking =>

            booking.mobile ===

            currentUser.mobile

    );

}

/* ===========================================================
   ACTIVE BOOKING
=========================================================== */

function getActiveBooking() {

    return myBookings.find(

        booking =>

            (

                booking.status || ""

            ).toUpperCase() ===

            "CONFIRMED"

    );

}

/* ===========================================================
   RENDER ACTIVE BOOKING
=========================================================== */

function renderActiveBooking() {

    const booking =

        getActiveBooking();

    if (!booking) {

        activeBookingCard.classList.add(

            "hidden"

        );

        return;

    }

    activeBookingCard.classList.remove(

        "hidden"

    );

    activeBooking.innerHTML = `

        <div class="room-info">

            <strong>

                Room

            </strong>

            <span>

                ${booking.room_name}

            </span>

        </div>

        <div class="room-info">

            <strong>

                Check In

            </strong>

            <span>

                ${formatDate(

        booking.from_date

    )}

            </span>

        </div>

        <div class="room-info">

            <strong>

                Check Out

            </strong>

            <span>

                ${formatDate(

        booking.to_date

    )}

            </span>

        </div>

        <div class="room-info">

            <strong>

                Amount

            </strong>

            <span>

                ₹${Number(

        booking.total_amount || 0

    ).toLocaleString("en-IN")}

            </span>

        </div>

    `;

}

/* ===========================================================
   BOOKING HISTORY
=========================================================== */

function renderBookingHistory() {

    historyTable.innerHTML = "";

    if (myBookings.length === 0) {

        historyTable.innerHTML = `

            <tr>

                <td colspan="6">

                    No Bookings Found

                </td>

            </tr>

        `;

        return;

    }

    myBookings.forEach(booking => {

        historyTable.innerHTML += `

            <tr>

                <td>

                    ${booking.id}

                </td>

                <td>

                    ${booking.room_name}

                </td>

                <td>

                    ${formatDate(

            booking.from_date

        )}

                </td>

                <td>

                    ${formatDate(

            booking.to_date

        )}

                </td>

                <td>

                    ₹${Number(

            booking.total_amount

        ).toLocaleString(

            "en-IN"

        )}

                </td>

                <td>

                    ${booking.status}

                </td>

            </tr>

        `;

    });

}

/* ===========================================================
   LOADING
=========================================================== */

function showLoading(show) {

    document.body.style.cursor =

        show

            ? "wait"

            : "default";

}

/* ===========================================================
   BookMyRoom Enterprise
   Guest Dashboard
   Part 3 - Professional Room Cards
=========================================================== */

/* ===========================================================
   RENDER ROOMS
=========================================================== */

function renderRooms() {

    roomContainer.innerHTML = "";

    if (rooms.length === 0) {

        roomContainer.innerHTML = `

            <div class="card">

                <h3>No Rooms Available</h3>

            </div>

        `;

        return;

    }

    rooms.forEach(room => {

        const available = isRoomAvailable(room.id);

        const card = document.createElement("div");

        card.className = "room-card";

        card.innerHTML = `

            <div class="room-image">

                ${room.room_type === "AC" ? "❄️" : "🏨"}

            </div>

            <div class="room-body">

                <div class="room-name">

                    ${room.room_name}

                </div>

                <div class="room-info">

                    <span>

                        📍 ${room.floor}

                    </span>

                    <span>

                        ${room.room_type}

                    </span>

                </div>

                <div class="room-info">

                    <span>

                        👥 Capacity

                    </span>

                    <strong>

                        ${room.capacity}

                    </strong>

                </div>

                <div class="room-info">

                    <span>

                        Status

                    </span>

                    <span class="status ${available ? "available" : "booked"}">

                        ${available ? "Available" : "Occupied"}

                    </span>

                </div>

                <div class="room-price">

                    ₹${Number(room.price).toLocaleString("en-IN")}

                    <span>

                        / day

                    </span>

                </div>

                <button

                    class="primary-btn"

                    ${available ? "" : "disabled"}

                    onclick="openBookingDialog(${room.id})">

                    ${available ? "Book Now" : "Not Available"}

                </button>

            </div>

        `;

        roomContainer.appendChild(card);

    });

}

/* ===========================================================
   ROOM AVAILABILITY
=========================================================== */

function isRoomAvailable(roomId) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return !bookings.some(booking => {

        if (

            Number(booking.room_id) !== Number(roomId)

        ) {

            return false;

        }

        if (

            (booking.status || "").toUpperCase() !== "CONFIRMED"

        ) {

            return false;

        }

        const checkOut = new Date(booking.to_date);

        checkOut.setHours(0, 0, 0, 0);

        return checkOut >= today;

    });

}

/* ===========================================================
   OPEN BOOKING
=========================================================== */

function openBookingDialog(roomId) {

    selectedRoom = rooms.find(

        room =>

            Number(room.id) === Number(roomId)

    );

    if (!selectedRoom) {

        return;

    }

    selectedRoomName.textContent =

        selectedRoom.room_name +

        " (" +

        selectedRoom.room_type +

        ")";

    roomRate.textContent =

        formatCurrency(

            selectedRoom.price

        );

    bookingModal.classList.remove(

        "hidden"

    );

    setupDefaultDates();

    resetBookingForm();

    updateBookingSummary();

}

/* ===========================================================
   CLOSE BOOKING
=========================================================== */

function closeBookingDialog() {

    bookingModal.classList.add(

        "hidden"

    );

    selectedRoom = null;

    resetBookingForm();

}

/* ===========================================================
   DEFAULT DATES
=========================================================== */

function setupDefaultDates() {

    const today = new Date();

    const tomorrow = new Date();

    tomorrow.setDate(

        today.getDate() + 1

    );

    fromDate.value =

        today.toISOString()

            .split("T")[0];

    toDate.value =

        tomorrow.toISOString()

            .split("T")[0];

}

/* ===========================================================
   FORMAT CURRENCY
=========================================================== */

function formatCurrency(amount) {

    return new Intl.NumberFormat(

        "en-IN",

        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 0

        }

    ).format(Number(amount || 0));

}

/* ===========================================================
   BookMyRoom Enterprise
   Guest Dashboard
   Part 4 - Booking Modal & Date Validation
=========================================================== */

/* ===========================================================
   BOOKING SUMMARY
=========================================================== */

function updateBookingSummary() {

    if (!selectedRoom) {

        return;

    }

    if (!fromDate.value || !toDate.value) {

        return;

    }

    const checkIn = new Date(fromDate.value);

    const checkOut = new Date(toDate.value);

    checkIn.setHours(0, 0, 0, 0);

    checkOut.setHours(0, 0, 0, 0);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const bookingMessage = document.getElementById("bookingMessage");

    /* -----------------------------
       DATE VALIDATION
    ------------------------------ */

    if (checkIn < today) {

        bookingMessage.className =
            "booking-message booking-error";

        bookingMessage.textContent =
            "❌ Check-in date cannot be in the past.";

        confirmBooking.disabled = true;

        return;

    }

    if (checkOut <= checkIn) {

        bookingMessage.className =
            "booking-message booking-error";

        bookingMessage.textContent =
            "❌ Check-out must be after check-in.";

        confirmBooking.disabled = true;

        return;

    }

    /* Clear previous message */

    bookingMessage.className =
        "booking-message hidden";

    bookingMessage.textContent = "";

    /* -----------------------------
       STAY
    ------------------------------ */

    const nights = Math.ceil(

        (checkOut - checkIn) /

        (1000 * 60 * 60 * 24)

    );

    stayDays.textContent =

        nights +

        (nights === 1 ? " Night" : " Nights");

    const total =

        nights *

        Number(selectedRoom.price);

    totalAmount.textContent =

        formatCurrency(total);

    /* -----------------------------
       AVAILABILITY
    ------------------------------ */

    const available = checkRoomAvailability(

        selectedRoom.id,

        fromDate.value,

        toDate.value

    );

    if (!available) {

        bookingMessage.className =
            "booking-message booking-error";

        bookingMessage.textContent =
            "❌ Room is already booked for the selected dates.";

        totalAmount.textContent = "Unavailable";

        confirmBooking.disabled = true;

        confirmBooking.textContent =
            "Room Not Available";

        return;

    }

    bookingMessage.className =
        "booking-message booking-success";

    bookingMessage.textContent =
        "✅ Room is available.";

    confirmBooking.disabled = false;

    confirmBooking.textContent =
        "Confirm Booking";

}

/* ===========================================================
   ROOM AVAILABILITY
=========================================================== */

function checkRoomAvailability(

    roomId,

    selectedFrom,

    selectedTo

) {

    const from = new Date(selectedFrom);

    const to = new Date(selectedTo);

    return !bookings.some(booking => {

        if (

            Number(booking.room_id) !==

            Number(roomId)

        ) {

            return false;

        }

        if (

            (booking.status || "").toUpperCase()

            !==

            "CONFIRMED"

        ) {

            return false;

        }

        const existingFrom =

            new Date(booking.from_date);

        const existingTo =

            new Date(booking.to_date);

        return (

            from < existingTo &&

            to > existingFrom

        );

    });

}

/* ===========================================================
   RESET FORM
=========================================================== */

function resetBookingForm() {

    people.value = 1;

    idProof.selectedIndex = 0;

    idProofNo.value = "";

    idProofImage.value = "";

    imagePreview.src = "";

    imagePreview.classList.add("hidden");

}

/* ===========================================================
   BookMyRoom Enterprise
   Part 5 - ID Upload Preview
=========================================================== */

/* ===========================================================
   PREVIEW IMAGE
=========================================================== */

function previewIDImage(event) {

    const file = event.target.files[0];

    if (!file) {

        imagePreview.src = "";

        imagePreview.classList.add("hidden");

        return;

    }

    /* -------------------------
       FILE TYPE
    ------------------------- */

    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/jpg",

        "image/webp"

    ];

    if (!allowedTypes.includes(file.type)) {

        bookingMessage.className =
            "booking-message booking-error";

        bookingMessage.textContent =
            "❌ Only JPG, PNG and WEBP images are allowed.";

        idProofImage.value = "";

        imagePreview.src = "";

        imagePreview.classList.add("hidden");

        return;

    }

    /* -------------------------
       FILE SIZE
    ------------------------- */

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

        bookingMessage.className =
            "booking-message booking-error";

        bookingMessage.textContent =
            "❌ Image size must be less than 2 MB.";

        idProofImage.value = "";

        imagePreview.src = "";

        imagePreview.classList.add("hidden");

        return;

    }

    /* -------------------------
       PREVIEW
    ------------------------- */

    const reader = new FileReader();

    reader.onload = function (e) {

        imagePreview.src = e.target.result;

        imagePreview.classList.remove("hidden");

        bookingMessage.className =
            "booking-message booking-success";

        bookingMessage.textContent =
            "✅ ID Proof selected successfully.";

    };

    reader.readAsDataURL(file);

}

/* ===========================================================
   VALIDATE BOOKING
=========================================================== */

function validateBooking() {

    if (!selectedRoom) {

        showBookingError(

            "Please select a room."

        );

        return false;

    }

    if (!fromDate.value) {

        showBookingError(

            "Please select Check-in date."

        );

        fromDate.focus();

        return false;

    }

    if (!toDate.value) {

        showBookingError(

            "Please select Check-out date."

        );

        toDate.focus();

        return false;

    }

    const checkIn = new Date(fromDate.value);

    const checkOut = new Date(toDate.value);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    checkIn.setHours(0, 0, 0, 0);

    checkOut.setHours(0, 0, 0, 0);

    if (checkIn < today) {

        showBookingError(

            "Check-in date cannot be in the past."

        );

        return false;

    }

    if (checkOut <= checkIn) {

        showBookingError(

            "Check-out must be after Check-in."

        );

        return false;

    }

    if (

        !people.value ||

        Number(people.value) < 1

    ) {

        showBookingError(

            "Please enter number of guests."

        );

        people.focus();

        return false;

    }

    if (

        Number(people.value) >

        Number(selectedRoom.capacity)

    ) {

        showBookingError(

            `Maximum ${selectedRoom.capacity} guests allowed.`

        );

        people.focus();

        return false;

    }

    if (!mobile.value.trim()) {

        showBookingError(

            "Mobile number is required."

        );

        return false;

    }

    if (!idProof.value) {

        showBookingError(

            "Please select ID Proof."

        );

        idProof.focus();

        return false;

    }

    if (!idProofNo.value.trim()) {

        showBookingError(

            "Please enter ID Proof Number."

        );

        idProofNo.focus();

        return false;

    }

    if (

        idProofImage.files.length === 0

    ) {

        showBookingError(

            "Please upload ID Proof."

        );

        return false;

    }

    if (

        !checkRoomAvailability(

            selectedRoom.id,

            fromDate.value,

            toDate.value

        )

    ) {

        showBookingError(

            "Room is already booked for selected dates."

        );

        return false;

    }

    clearBookingMessage();

    return true;

}

/* ===========================================================
   UPLOAD BOOKING ID PROOF
=========================================================== */

async function uploadBookingIDProof() {

    try {

        const file = idProofImage.files[0];

        if (!file) {

            return "";

        }

        showBookingSuccess(

            "Uploading ID Proof..."

        );

        const imageUrl = await uploadIDProof(

            file,

            currentUser.mobile

        );

        if (!imageUrl) {

            throw new Error(

                "Unable to upload ID Proof."

            );

        }

        return imageUrl;

    }

    catch (err) {

        console.error(err);

        showBookingError(

            "ID Proof upload failed."

        );

        throw err;

    }

}

/* ===========================================================
   CREATE BOOKING
=========================================================== */

async function createBooking() {

    try {

        /* -----------------------------
           VALIDATE
        ----------------------------- */

        if (!validateBooking()) {

            return;

        }

        /* -----------------------------
           DISABLE BUTTON
        ----------------------------- */

        confirmBooking.disabled = true;

        confirmBooking.textContent =

            "Creating Booking...";

        /* -----------------------------
           UPLOAD ID
        ----------------------------- */

        const imageUrl =

            await uploadBookingIDProof();

        /* -----------------------------
           BOOKING OBJECT
        ----------------------------- */

        const booking = {

            room_id: selectedRoom.id,

            guest_id: currentUser.id,

            employee_id: null,

            mobile: currentUser.mobile,

            people: Number(people.value),

            from_date: fromDate.value,

            to_date: toDate.value,

            id_proof: idProof.value,

            id_proof_no: idProofNo.value,

            id_proof_image: imageUrl,

            booking_type: "Guest"

        };

        /* -----------------------------
           SAVE BOOKING
        ----------------------------- */

        const result =

            await apiRequest(

                "/bookings",

                "POST",

                booking

            );

        /* -----------------------------
           SUCCESS
        ----------------------------- */

        showBookingSuccess(

            "Booking confirmed successfully."

        );

        closeBookingDialog();

        await initializeDashboard();

        showBookingReceipt(

            result.booking

        );

        sessionStorage.removeItem(
            "bookingMode"
        );

    }

    catch (err) {

        console.error(err);

        showBookingError(

            err.message ||

            "Booking failed."

        );

    }

    finally {

        confirmBooking.disabled = false;

        confirmBooking.textContent =

            "Confirm Booking";

    }

}

/* ===========================================================
   BOOKING RECEIPT
=========================================================== */

showBookingReceipt(result.booking);

function showBookingReceipt(booking) {

    console.log("Booking Created", booking);

    alert("Booking created successfully.");

}

/* ===========================================================
   BOOKING MESSAGE
=========================================================== */

function showBookingError(message) {

    bookingMessage.className =

        "booking-message booking-error";

    bookingMessage.textContent =

        "❌ " + message;

}

function showBookingSuccess(message) {

    bookingMessage.className =

        "booking-message booking-success";

    bookingMessage.textContent =

        "✅ " + message;

}

function clearBookingMessage() {

    bookingMessage.className =

        "booking-message hidden";

    bookingMessage.textContent = "";

}

/* ===========================================================
   CLOSE RECEIPT
=========================================================== */

function closeReceipt() {

    receiptModal.classList.add(

        "hidden"

    );

}

/* ===========================================================
   PRINT RECEIPT
=========================================================== */

function printReceipt() {

    window.print();

}

/* ===========================================================
   DOWNLOAD RECEIPT
=========================================================== */

function downloadReceipt() {

    alert(

        "PDF download will be added in the next step."

    );

}

