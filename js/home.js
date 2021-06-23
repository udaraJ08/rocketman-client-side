let allVehicleArr = []
let holdBookingArr = []
let driver = ""

let vehicleIndex = 0;

$(document).ready(() => {
    checkValidUser()
    getAllVehicle()
    getBookingHoldsByUser()
})
///////API calling////////////////
function registerCustomer(tempData) {

    (async () => {
        const actualData = {
            "customer_NIC": tempData.NIC,
            "nic_img": "buddini.jpeg",
            "lic_no": tempData.lic,
            "lic_img": "",
            "customerName": tempData.name,
            "contact": tempData.contact,
            "address": tempData.address,
            "customerStatus": "open"
        }
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/customer/add", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(actualData)
        })
        await rawResponse.json().then(data => {
            alert(data.body)
        })
    })().then(() => {
        cleanRegistration()
        alert("success !!!")
    });
}

function signupUser(data) {
    (async () => {
        console.log("my Data" + data);
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/user-customer/signup", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        await rawResponse.json().then(data => {

            alert(data.data)
        })
    })().then(() => {
        cleanSignUp()
    });
}

function loginUser(data) {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/user-customer/check", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        await rawResponse.json().then(data => {
            if (null !== data.data)
                setValidCookie(data);
            else
                alert("no user found")
        })
    })().then(() => {
        cleanLogIn()
    });
}

function getAllVehicle() {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle/?status=open", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            }
        })

        await rawResponse.json().then(data => {
            allVehicleArr = data.data
        })
    })().then(() => {
        renderAllVehicles()
    })
}

function getBookingHoldsByUser() {

    (async () => {
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/bookingHold/search/user?nic=${getCookieData()}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            }
        })

        await rawResponse.json().then(data => {
            holdBookingArr = data.data
            renderAllUserHolds(data.data)
        })
    })()
}

function placeBooking(data) {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/bookingHold/hold", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        await rawResponse.json().then((data) => {
            if (data.data)
                alert("Success")
            else alert("Failed")
        })
    })().then(() => {
        getBookingHoldsByUser()
    })
}

function deleteHoldBooking(index) {
    (async () => {
        const id = holdBookingArr[index].bookingID
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/bookingHold/delete?id=${id}`, {
            method: "DELETE",
            headers: {
                "accept": "application/json",
            },
        })
        await rawResponse.json().then((data) => {
            alert(data.data)
        })
    })().then(() => {
        cleanHoldBookingTable()
        getBookingHoldsByUser()
    })
}
////////rendering//////////////////
function renderAllVehicles() {

    let i = 0;
    allVehicleArr.map(element => {
        const row = `
        <div class="fleet-tab">
          <section class="fleet-tab-upper">
            <img src="https://www.newswire.lk/wp-content/uploads/2020/08/Car-sales.jpg" width="" class="img-thumbnail" alt="">
          </section>
          <section class="fleet-tab-lower d-flex flex-column">
            <section class="center">
              <h5 class="text-light">${element.brandName}</h5>
            </section>
            <section class="p-3 center d-flex centre justify-content-between">
              <section class="">
                <p class="small tab-topic">Monthly</p>
                <p class="lead tab-body">${element.monthlyRental}</p>
              </section>
              <section class="">
                <p class="small tab-topic">Daily Rental</p>
                <p class="lead tab-body text-warning">${element.dailyRental}</p>
              </section>
              <section class="">
                <p class="small tab-topic">Excess</p>
                <p class="lead tab-body">${element.excessForMonth}</p>
              </section>
            </section>
            <br>
            <section class="p-3 center d-flex centre justify-content-between">
              <section class="">
                <p class="small tab-topic">Transmission</p>
                <p class="lead tab-body">${element.transmission}</p>
              </section>
              <section class="">
                <p class="small tab-topic">Vehicle Type</p>
                <p class="lead tab-body text-warning">${element.type}</p>
              </section>
              <section class="">
                <p class="small tab-topic">Fuel Type</p>
                <p class="lead tab-body">${element.fuelType}</p>
              </section>
            </section>
            <section class="p-3 center d-flex justify-content-evenly">
              <section><button class="btn btn-danger" id="btnWithDriver" value=${i} 
              data-toggle="modal"
              data-target="#mdlBooking"
              >with driver</button></section>
              <section><button class="btn btn-success" id="btnSelfDrive" value=${i}>Self Drive</button></section>
            </section>
          </section>
        </div>
        `
        i++;
        $(".fleet-mid-container").append(row)
    })
    $(document).on("click", "#btnWithDriver", function () {
        driver = "set"
        vehicleIndex = $(this).val()
        $('#mdlBooking').modal('show')
    })

    $(document).on("click", "#btnSelfDrive", function () {
        driver = "none"
        vehicleIndex = $(this).val()
        $('#mdlBooking').modal('show')
    })
}

function renderAllUserHolds(data) {

    data.map(element => {
        const row = `
            <tr>
                <td>${element.departureDate}</td>
                <td>${element.departureDate}</td>
                <td>${element.departureDate}</td>
                <td>${element.departureDate}</td>
                <td class="center">
                    <button id="btnTrDelete" class="btn btn-danger"><i class="fas fa-minus-circle"></i>DELETE</button>
                </td>
            </tr>
        `
        $("#user-tbl-tbody").append(row)
    })
    $(document).on("click", "#btnTrDelete", function () {
        deleteHoldBooking($(this).closest("tr").index())
    })
}

/////////Event handeling//////////
$("#btnLogin").on('click', () => {
    logIn()
})

$("#btnLogOut").on('click', () => {
    logOut();
})

$("#frmCustomerRegistration").on('submit', e => {
    e.preventDefault()
    fetchDetailsFromRegistration()
})

$('#lblSignup').on('click', function () {
    $('#mdlLogin').modal('hide')
    $('#mdlSignup').modal('show')
})

$("#frmCustomerSignup").on('submit', function (e) {
    e.preventDefault()
    fetchDetailsSignup()
})

$("#frmCustomerLogin").on("submit", e => {
    e.preventDefault()
    const username = $("#inptUsername").val()
    const password = $("#pwPassword").val()

    const data = {
        "username": username,
        "password": password
    }

    loginUser(data)
})

$("#chkDurationMonth").on("click", () => {
    $("#chkDurationDay").prop("checked", false)
})

$("#chkDurationDay").on("click", () => {
    $("#chkDurationMonth").prop("checked", false)
})

$("#btnBookingSubmit").on('click', () => {

    if (!cookieChecker()) {
        alert("You have to login to make a booking")
        return;
    }

    let duration = ""

    if ($("#chkDurationMonth").is(":checked"))
        duration = "month"
    else duration = "day"

    let depDate = $("#dtDepDate").val()
    let arrDate = $("#dtArrDate").val()
    let time = $("#tmDepTime").val()

    const data = {
        "duration": duration,
        "deprature": depDate,
        "arrival": arrDate,
        "time": time
    }

    bookingDataMaker(data)
})
/////////lead functions///////////
function bookingDataMaker(data) {

    const dataArr = allVehicleArr[vehicleIndex]

    const bookingData = {
        "bookingID": 1,
        "driver_NIC": driver,
        "customer_NIC": getCookieData(),
        "vehicleNumber": dataArr.vehicleNumber,
        "duration": data.duration,
        "startMileage": 0,
        "endMileage": 0,
        "departureDate": data.deprature,
        "time": data.time,
        "arrivalDate": data.arrival,
        "releaseDate": "",
        "releaseStatus": false,
        "bookingStatus": "request",
        "bookingType": dataArr.type,
        "bookingDate": ""
    }

    placeBooking(bookingData)

}


function fetchDetailsFromRegistration() {
    const customerNIC = $("#inptCustomerNIC").val()
    const customerName = $("#inptCustomerName").val()
    const customerAddress = $("#inptAddress").val()

    const customerContact = $("#inptContact").val()
    const customerLicNo = $("#inptLicNo").val()

    const data = {
        "NIC": customerNIC,
        "name": customerName,
        "address": customerAddress,
        "contact": customerContact,
        "lic": customerLicNo
    }
    registerCustomer(data)
}

function fetchDetailsSignup() {
    const nic = $("#inptSgnNIC").val()
    const username = $("#inptSgnUsername").val()
    const password = $("#inptSgnPassword").val()

    const data = {
        "customerNIC": nic,
        "customerUsername": username,
        "customerPassword": password
    }

    signupUser(data)
}

function userButtonSet(number) {

    switch (number) {
        case 0: {
            $("#btnUserProfile").css("display", "none")
            $("#btnLogin").css("display", "flex")
            $("#btnLogOut").css("display", "none")
            break;
        }
        case 1: {
            $("#btnLogin").css("display", "none")
            $("#btnUserProfile").css("display", "flex")
            break;
        }
    }
}

//////validations(cookie based)////
function checkValidUser() {
    const user = Cookies.get("or_user")
    if (user === undefined)
        userButtonSet(0)
    else
        userButtonSet(1)
}

function setValidCookie(data) {
    Cookies.set("or_user", data.data)
    window.location.reload()
}

function logOut() {
    Cookies.remove("or_user")
    window.location.reload()

}

function cookieChecker() {

    const user = Cookies.get("or_user")
    if (user === undefined)
        return false
    else
        return true
}

function getCookieData() {
    return Cookies.get("or_user")
}

///////cleaners and loaders///////
function cleanHoldBookingTable() {
    $("#user-tbl-tbody").empty()
}

function cleanRegistration() {
    $("#inptCustomerNIC").val("")
    $("#inptCustomerName").val("")
    $("#inptAddress").val("")

    $("#inptContact").val("")
    $("#inptLicNo").val("")
}

function cleanSignUp() {
    $("#inptSgnNIC").val("")
    $("#inptSgnUsername").val("")
    $("#inptSgnPassword").val("")
}

function cleanLogIn() {
    $("#inptUsername").val("")
    $("#pwPassword").val("")
}