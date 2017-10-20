//const BETTER_DOCTOR_API = 'https://api.betterdoctor.com/2016-03-01/doctors';
// var map;
$(document).ready(function () {
    // new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'));
    console.log("ready!");
    // $('navbar-header').hide();
    // initMap(47.6145, -122.3418);
    // getUserLocation();
    getSpecialties(cleanSpecialtiesData);
    // setTimeout(getInsurances(displayInsurancesResponse), 5000);
    // getInsurances(displayInsurancesResponse);
    $(watchSubmit);
    // setTimeout(getInsurances(callback), 600)
    $(generateDoctorProfile);
});



// const crypto = require('crypto');

// const generate_key = function() {
//     const sha = crypto.createHash('sha256');
//     sha.update(Math.random().toString());
//     return sha.digest('hex');
// };
// initialize google maps

var map;
// var pos;

function initMap() {
    var mapCenter = new google.maps.LatLng(47.6145, -122.3418); //Google map Coordinates
    map = new google.maps.Map($("#map")[0], {
        center: mapCenter,
        zoom: 8
    });
}



if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
        // infoWindow = new google.maps.InfoWindow({map: map});
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // infoWindow.setPosition(pos);
        // infoWindow.setContent("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
        // map.panTo(pos);
        console.log(pos);
    });
} else {
    console.log("Browser doesn't support geolocation!");
}


// function initMap(latitude, longitude) {
//     var uluru = {
//         lat: parseInt(latitude),
//         lng: parseInt(longitude)
//     };
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: uluru
//     });
//     var marker = new google.maps.Marker({
//         position: uluru,
//         map: map
//     });

//     // ${initMap(result.practices[0].lat, result.practices[0].lon)}

// }


// get data from API and limit results
function getDataFromApi(specialty, insurance, user_location, location, callback) {
    const settings = {
        data: {
            specialty_uid: `${specialty}`,
            insurance_uid: `${insurance}`,
            user_location: `${user_location}`,
            location: `${location}`,
            skip: '2',
            limit: '12',
            user_key: 'ca6c55cccdb1c2084039aeadd09f13b3',
        },
        url: 'https://api.betterdoctor.com/2016-03-01/doctors',
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings)
}


$(this).delay(1000).queue(function () {
    function getInsurances(callback) {
        const settings = {
            data: {
                skip: '0',
                limit: '',
                user_key: 'ca6c55cccdb1c2084039aeadd09f13b3',
            },
            url: 'https://api.betterdoctor.com/2016-03-01/insurances',
            dataType: 'json',
            type: 'GET',
            success: callback
        };
        $.ajax(settings)
    }
    $(this).dequeue();
    getInsurances(cleanInsurancesData);
});

function cleanInsurancesData(data) {
    const clean_data = [];
    for (i = 0; i < data.length; i++) {
        if (data[i] != null) {
            clean_data.push(data[i]);
        }
    }
    console.log(data);
    console.log(clean_data);
    displayInsurancesResponse(clean_data);
}

function getSpecialties(callback) {
    const settings = {
        data: {
            skip: '0',
            limit: '',
            fields: 'uid,name',
            user_key: 'ca6c55cccdb1c2084039aeadd09f13b3',
        },
        url: 'https://api.betterdoctor.com/2016-03-01/specialties',
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings)
}

function cleanSpecialtiesData(data) {
    const clean_data = [];
    json_data = JSON.stringify(data);
    for (i = 0; i < json_data.length; i++) {
        if (json_data[i] != null) {
            clean_data.push(json_data);
        }
    }
    // console.log(data);
    // console.log(clean_data);
    console.log(json_data);
    displaySpecialtyResponse(clean_data);
}

// function getDoctor(uid, callback) {
//     const settings = {
//         data: {
//             user_key: 'ca6c55cccdb1c2084039aeadd09f13b3',
//         },
//         url: `https://api.betterdoctor.com/2016-03-01/doctors/${uid}`,
//         dataType: 'json',
//         type: 'GET',
//         success: callback
//     };
//     $.ajax(settings)
// }

// renders results to user
function renderResult(result) {
    $('.js-search-results').show();
    $('.bio').shorten();
    // data = [];
    // first_name = result.profile.first_name;
    // last_name = result.profile.last_name;
    // title = result.profile.title;
    // bio =  result.profile.bio;
    // data = [first_name,last_name,title,bio];

    return `
        <div class="col-sm-4">
    <div class="card-container">
    <div class="card">
        <div class="front">
            <div class="cover">
                <img src="images/rotating_card_thumb5.jpg"/>
            </div>
            <div class="user">
                <img class="img-circle" src="${result.profile.image_url}"/>
            </div>
            <div class="content">
                <div class="main">
                    <h3 class="name">${result.profile.first_name} ${result.profile.last_name}, ${result.profile.title}</h3>
                    <p class="profession">${result.practices[0].name}</p>

                    <p class="text-center">${result.specialties[0].name}</p>
                    <p class="text-center"><div class="distance">${Math.round(result.practices[0].distance)} miles from you</div></p> 
                </div>
                <div class="footer">
                    <div class="rating">
                        <i class="fa fa-mail-forward"></i> Auto Rotation
                    </div>
                </div>
            </div>
        </div> <!-- end front panel -->
        <div class="back">
            <div class="header">
                <h5 class="motto">State Licensed In: ${result.licenses[0].state}</h5>
            </div>
            <div class="content">
                <div class="main">
                    <h4 class="text-center">Bio</h4>
                    <p class="text-center"><div class="bio">${result.profile.bio}</div></p> 
            <div class="footer">
                <div class="social-links text-center">
                    <a href="javascript:void(0)" class="more js-more" data-toggle="modal" data-target=".bd-example-modal-lg"
                    profile_image="${result.profile.image_url} "firstname="${result.profile.first_name}" 
                    lastname="${result.profile.last_name}" profile_title="${result.profile.title}" 
                    bio="${result.profile.bio}" license_state="${result.licenses[0].state}" 
                    specialties_description="${result.specialties[0].description}" practice="${result.practices[0].name}"
                    address="${result.practices[0].visit_address.street}" 
                    address2="${result.practices[0].visit_address.street2}"
                    city="${result.practices[0].visit_address.city}"
                    state="${result.practices[0].visit_address.state}"
                    zip="${result.practices[0].visit_address.zip}"
                    contact="${result.practices[0].phones[0].number}" 
                    profile_bio="${result.profile.bio}"
                    profile_insurance="${result.insurances[0].insurance_provider.name}
                    ">View More</a>
                </div>
            </div>
        </div> <!-- end back panel -->
    </div> <!-- end card -->
</div> <!-- end card-container -->
    `;
}

function generateSpecialtyOptionElement(result) {
    return `
    <option value="${result.uid}">${result.name}</option>
    `;
}

function generateInsuranceOptionElement(result) {
    return `
    <option value="${result.plans[0].uid}">${result.plans[0].name}</option>
    `;
}

function cleanApiResults(data) {
    const clean_data = [];
    for (i = 0; i < data.length; i++) {
        if (data[i] != null) {
            clean_data.push(data[i]);
        }
    }
    displayResponseData(clean_data);
}

// parses doctors endpoint response data
function displayResponseData(response) {
    const results = response.data.map((item, index) => renderResult(item));
    $('.js-search-results').html(results);
    renderResult(results);
    console.log('displayResponseData ran');
}

function displaySpecialtyResponse(response) {
    console.log(response);
    const results = response.data.map((item, index) => generateSpecialtyOptionElement(item));
    $('.js-specialty').html(results.sort());
    generateSpecialtyOptionElement(results);
    console.log('displaySpecialtyResponse ran');
}

function displayInsurancesResponse(response) {
    const results = response.data.map((item, index) => generateInsuranceOptionElement(item));
    $('.js-insurance').html(results.sort());
    console.log('displayInsurancesResponse ran');
}


function generateDoctorProfile() {
    console.log("generateDoctorProfile ran");
    $('.js-search-results').on('click', '.js-more', function (event) {
        event.preventDefault();
        // $('.js-search-results').hide();
        $('.js-profile').show();
        $('navbar-header').show();
        const firstname = $(this).attr("firstname");
        const lastname = $(this).attr("lastname");
        const image = $(this).attr("profile_image");
        const title = $(this).attr("profile_title");
        const practice = $(this).attr("practice");
        const address = $(this).attr("address");
        const address2 = $(this).attr("address2");
        const city = $(this).attr("city");
        const state = $(this).attr("state");
        const zip = $(this).attr("zip");
        const contact = $(this).attr("contact");
        const profile_bio = $(this).attr("profile_bio");
        const profile_insurance = $(this).attr("profile_insurance")
        // const data = [firstname,lastname,image];
        // getDoctor(uid, displayDoctorProfile);
        displayDoctorProfile(image, firstname, lastname, title, practice, address, address2, contact, city, state, zip, profile_bio, profile_insurance);
        // console.log(data);
    });
}

function displayDoctorProfile(image, firstname, lastname, title, practice, address, address2, contact, city, state, zip, profile_bio, profile_insurance) {
    $('.js-profile-image').html(`<img class="img-circle" src="${image}"/>`);
    $('.js-profile-name').html(`${firstname} ${lastname}`);
    $('.js-profile-title').html(`${title}`);
    $('.js-profile-practice').html(`${practice}`);
    $('.js-practice-address').html(`${address}`);
    $('.js-practice-address2').html(`${address2}`);
    $('.js-practice-city').html(`${city}, `);
    $('.js-practice-state').html(`${state} `);
    $('.js-practice-zip').html(`${zip}`);
    $('.js-profile-contact').html(`${contact}`);
    $('.js-profile-bio').html(`${profile_bio}`);
    $('.js-profile-insurance').html(`${profile_insurance}`)


    // $('.js-name').html(response);
    //renderDoctorProfile(response);
}

function renderDoctorProfile(result) {
    // console.log(result);

    return `

`;
}

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("profile-tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}


// listen's for form submission
function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const specialty_target = $(event.currentTarget).find('.js-specialty');
        const specialty = (specialty_target.val());
        const insurance_target = $(event.currentTarget).find('.js-insurance');
        const insurance = (insurance_target.val());
        const user_location = JSON.stringify(pos).replace(/[^0-9\-,.]/g, '');
        const range_target = $(event.currentTarget).find('.js-range');
        const range_target_value = range_target.val();
        const range = {
            user_location,
            range_target_value
        };
        const range_clean = JSON.stringify(range).replace(/[^0-9\-,.]/g, '');
        // target.val("");
        getDataFromApi(specialty, insurance, user_location, range_clean, cleanApiResults);
        console.log("watchSubmit ran", range_clean);
    });
}