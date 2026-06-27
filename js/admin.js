"use strict";

const user = getUser();

/* ===================================== */

if (

!user ||

user.role !== "ADMIN"

){

location.href="index.html";

}

/* ===================================== */

document
.getElementById("adminName")
.textContent=user.name;

document
.getElementById("profileCircle")
.textContent=
user.name
.charAt(0)
.toUpperCase();

/* ===================================== */

document
.getElementById("logoutBtn")
.addEventListener(

"click",

logout

);

/* ===================================== */

loadDashboard();

async function loadDashboard(){

try{

const result=
await apiRequest(
"/admin/dashboard"
);

const d=
result.dashboard;

document
.getElementById("totalRooms")
.textContent=
d.totalRooms;

document
.getElementById("totalBookings")
.textContent=
d.totalBookings;

document
.getElementById("totalGuests")
.textContent=
d.totalGuests;

document
.getElementById("totalRevenue")
.textContent=
d.totalRevenue;

renderBookings(
d.recentBookings
);

}

catch(err){

alert(
err.message
);

}

}

/* ===================================== */

function renderBookings(bookings){

const tbody=
document.getElementById(
"recentBookings"
);

tbody.innerHTML="";

bookings.forEach(b=>{

tbody.innerHTML+=`

<tr>

<td>

${b.room_id}

</td>

<td>

${b.from_date}

</td>

<td>

${b.to_date}

</td>

<td>

${b.mobile}

</td>

<td>

₹${b.total_amount}

</td>

</tr>

`;

});

}