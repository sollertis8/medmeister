
$(document).ready(function () {
    getSpecialties(displaySpecialtyResponse);
    $(watchSubmit);
    $(mapResize);
    $(generateDoctorProfile);
});

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
    getInsurances(displayInsurancesResponse);
});

var pos;

function initMap(practice_location, practice_name) {
    var mapCenter = new google.maps.LatLng(33.7490, -84.3880); //Google map Coordinates
    var map = new google.maps.Map($("#map")[0], {
        center: mapCenter,
        zoom: 9
    });

    if (practice_location && practice_name != null) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                infoWindow = new google.maps.InfoWindow({
                    map: map
                });
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent(`Found your location`);
                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Your location"
                });
                infoWindow2 = new google.maps.InfoWindow({
                    map: map
                });
                infoWindow2.setPosition(practice_location);
                infoWindow2.setContent(practice_name);
                var marker2 = new google.maps.Marker({
                    position: practice_location,
                    map: map,
                    title: name
                });

                map.panTo(pos);
                console.log(pos);

                // marker.setMap(map);
            });
        } else {
            console.log("Browser doesn't support geolocation!");
        }

    } else {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Your location"
                });
                map.panTo(pos);
                console.log(pos);
                // marker.setMap(map);
            });
        } else {
            console.log("Browser doesn't support geolocation!");
        }
    }
}

function mapResize() {
    $("#map-button").on('click', function (event) {
        initMap(practice_location, practice_name);
    });
}

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

function getDoctor(uid, callback) {
    const settings = {
        data: {
            user_key: 'ca6c55cccdb1c2084039aeadd09f13b3',
        },
        url: `https://api.betterdoctor.com/2016-03-01/doctors/${uid}`,
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings)
}

// renders results to user
function getDoctorHtmlString(result) {
    $('.js-map').show();
    return `
        <div class="col-lg-4 col-md-6">
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
                    <a href="#" class="more js-more" data-toggle="modal" data-target=".bd-example-modal-lg"
                    profile_image="${result.profile.image_url}" firstname="${result.profile.first_name}" 
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
                    profile_insurance="${result.insurance_accepted}"
                    practice_lat="${result.practices[0].lat}"
                    practice_long="${result.practices[0].lon}"
                    >View More</a>
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

// parses doctors endpoint response data
function displayResponseData(response) {
    if (response.data.length == 0) {
        $('.js-search-results').html("No results, search again...");
        return
    }

    const results = response.data.map((item, index) => {
        return getDoctorHtmlString(normalizeResultData(item))
    })

    $('.js-search-results').html(results);

    $('.js-search-results').show();
    $('.bio').shorten();
}

/**
 * Populates each from API response for doctor data:
 * profile
 * practices
 * insurances
 * specialties
 * licenses
 * 
 * @param {object} data 
 */
function normalizeResultData(data) {
    let obj = {
        profile: getProfileFromDoctorData(data),
        practices: getPracticesFromDoctorData(data),
        insurances: getInsurancesFromDoctorData(data),
        specialties: getSpecialtiesFromDoctorData(data),
        licenses: getLicensesFromDoctorData(data),
        insurance_accepted: getInsuranceAccepted(data)
    }
    console.log(obj)
    return obj
}

/**
 * 
 * @param {object} data The data in the response from the api's /doctors endpoint.
 */
function getProfileFromDoctorData(data) {
    // assume each object has a .profile element
    let profileKeys = Object.keys(data.profile)
    let profile = {
        image_url: (profileKeys.includes('image_url') ? data.profile.image_url : ""),
        first_name: (profileKeys.includes('first_name') ? data.profile.first_name : ""),
        last_name: (profileKeys.includes('last_name') ? data.profile.last_name : ""),
        title: (profileKeys.includes('title') ? data.profile.title : ""),
        bio: (profileKeys.includes('bio') ? data.profile.bio : "No Bio Available")
    }

    return profile
}

/**
 * 
 * @param {object} data The data in the response from the api's /doctors endpoint.
 * @returns {array} Array of practices objects
 */
function getPracticesFromDoctorData(data) {
    // assume the response has a practices element and that it is an array
    practices = []
    data.practices.map(item => {
        let practiceKeys = Object.keys(item)
        let practice = {
            name: (practiceKeys.includes('name') ? item.name : ""),
            visit_address: getPracticeVisitAddress(item),
            phones: item.phones,
            distance: (practiceKeys.includes('distance') ? item.distance : 0),
            lat: (practiceKeys.includes('lat') ? item.lat : ""),
            lon: (practiceKeys.includes('lon') ? item.lon : "")
        }
        practices.push(practice)
    })

    function getPracticeVisitAddress(practice) {
        // Again, assume, each practice has a 'visit_address' property
        let visitAddressKeys = Object.keys(practice.visit_address)
        return {
            street: (visitAddressKeys.includes('street') ? practice.visit_address.street : ""),
            street2: (visitAddressKeys.includes('street2') ? practice.visit_address.street2 : ""),
            city: (visitAddressKeys.includes('city') ? practice.visit_address.city : ""),
            state: (visitAddressKeys.includes('state') ? practice.visit_address.state : ""),
            zip: (visitAddressKeys.includes('zip') ? practice.visit_address.zip : "")
        }
    }

    return practices
}

/**
 * 
 * @param {object} data The data in the response from the api's /doctors endpoint.
 */
function getInsurancesFromDoctorData(data) {
    insurances = []
    data.insurances.map(item => {
        insuranceKeys = Object.keys(item)
        insurances.push({
            insurance_provider: (insuranceKeys.includes('insurance_provider') ? item.insurance_provider : {
                name: "Unknown"
            })
        })
    })
    return insurances
}

function getInsuranceAccepted(data) {
insurance_accepted=[];
    for (var i = 0; i < data.insurances.length; i++) {
        insurance_accepted.push(data.insurances[i].insurance_provider.name);
        var unique_insurance_accepted=[];
        $.each(insurance_accepted, function(i, el){
           if($.inArray(el, unique_insurance_accepted) === -1) unique_insurance_accepted.push(el);
        })
        insurance_logos = [];
        logo="";
        
        // console.log(insurance_accepted);
    }
    for (var i = 0; i < unique_insurance_accepted.length; i++) {
        switch(unique_insurance_accepted[i])
        {
           case 'Aetna': logo = "<img src='logos/aetna.jpg' style='width: 25%; height: 25%;' />";
           break;
           case 'Amerihealth': logo = "<img src='logos/amerihealth.jpg' style='width: 25%; height: 25%;' />";
           break;
           case 'BCBS': logo = "<img src='logos/bcbs.png' style='width: 25%; height: 25%;' />";
           break;
           case 'Cigna': logo= "<img src='logos/cigna.png' style='width: 25%; height: 25%;' />";
           break;
           case 'EmblemHealth': logo = "<img src='logos/emblemhealth.png' style='width: 25%; height: 25%;' />";
           break;
           case 'Humana': logo = "<img src='logos/humana.png' style='width: 25%; height: 25%;' />";
           break;
           case 'Medicaid': logo = "<img src='logos/medicaid.jpg' style='width: 25%; height: 25%;' />";
           break;
           case 'Medicare': logo = "<img src='logos/medicare.jpg' style='width: 25%; height: 25%;' />";
           break;
           case 'Multiplan': logo = "<img src='logos/multiplan.gif' style='width: 25%; height: 25%;' />";
           break;
           case 'QualCare': logo = "<img src='logos/qualcare.jpg' style='width: 25%; height: 25%;' />";
           break;
           case 'United Healthcare': logo = "<img src='logos/united_healthcare.png' style='width: 25%; height: 25%;' />";
           break;
           default: image=i;
        }
        insurance_logos.push(logo);
        // console.log(logo);
        console.log(insurance_logos);
        
        }
    return insurance_logos;
}
/**
 * 
 * @param {object} data 
 */
function getSpecialtiesFromDoctorData(data) {
    specialties = []
    data.specialties.map(item => {
        speacialtyKeys = Object.keys(item)
        specialties.push({
            name: (speacialtyKeys.includes('name') ? item.description : ""),
            description: (speacialtyKeys.includes('description') ? item.description : "")
        })
    })
    return specialties
}

/**
 *
 * @param {object} data
 */
function getLicensesFromDoctorData(data) {
    licenses = []
    data.licenses.map(item => {
        licenseKeys = Object.keys(item)
        licenses.push({
            state: (licenseKeys.includes('state') ? item.state : "Unknown")
        })
    })
    return licenses
}

function displaySpecialtyResponse(response) {
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
    practice_location = {};
    practice_name = "";
    console.log("generateDoctorProfile ran");
    $('.js-search-results').on('click', '.js-more', function (event) {
        document.getElementById('Bio').focus();
        event.preventDefault();
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
        const profile_insurance = $(this).attr("profile_insurance");
        practice_lat = $(this).attr("practice_lat");
        practice_long = $(this).attr("practice_long");
        practice_location = {
            lat: parseFloat(practice_lat),
            lng: parseFloat(practice_long)
        }
        practice_name = $(this).attr("practice");
        displayDoctorProfile(image, firstname, lastname, title, practice, 
            address, address2, contact, city, state, zip, profile_bio, 
            profile_insurance);
    });
}

function displayDoctorProfile(image, firstname, lastname, title, 
    practice, address, address2, contact, city, state, zip, profile_bio, 
    profile_insurance) {
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
    $('.js-profile-insurance').html(`${profile_insurance}`);
}

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("profile-tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

// listens for form submission
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
        getDataFromApi(specialty, insurance, user_location, range_clean, displayResponseData);
        console.log("watchSubmit ran", range_clean);
    });
}