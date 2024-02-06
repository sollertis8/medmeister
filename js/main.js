$(document).ready(function () {
  displaySpecialtyResponse();
  $(watchSubmit);
  $(mapResize);
  $(window);
  resizeWindow();
  $(generateDoctorProfile);
  $(".results-container").hide();
});

// adjusts ui for window widths less that 600px
$(window).resize(function () {
  console.log("windowresize ran");
  var width = $(window).width();
  if (width <= 600) {
    $("#submit")
      .removeClass("btn btn-info btn-lg")
      .addClass("btn btn-info btn-sm");
    $("#submit").removeClass("col-lg-12").addClass("col-lg-10");
    $(".container-fluid").removeClass("clearfix");
    $(".practice").hide();
    $("#Profile_mobile").show();
    $("#mobile-practice").show();
    $(".address").hide();
    $(".line").hide();
    $("ul").hide();
    $(".mobile-ul").show();
  } else {
    $("#submit")
      .removeClass("btn btn-info btn-sm")
      .addClass("btn btn-info btn-lg");
    $("#submit").removeClass("col-lg-10").addClass("col-lg-12");
    $(".container-fluid").addClass("clearfix");
    $(".practice").show();
    $("#mobile-practice").hide();
    $("#Profile_mobile").hide();
    $(".address").show();
    $(".line").show();
    $("ul").show();
    $(".mobile-ul").hide();
  }
});

function resizeWindow() {
  console.log("windowresize ran");
  var width = window.innerWidth;
  //Assuming X=600
  if (width <= 600) {
    $("#submit")
      .removeClass("btn btn-info btn-lg")
      .addClass("btn btn-info btn-sm");
    $(".container-fluid").removeClass("clearfix");
    $(".practice").hide();
    $("#Profile_mobile").show();
    $("#mobile-practice").show();
    $(".address").hide();
    $(".line").hide();
    $("ul").hide();
    $(".mobile-ul").show();
    $(".content").removeClass(".center_div");
  } else {
    $("#submit")
      .removeClass("btn btn-info btn-sm")
      .addClass("btn btn-info btn-lg");
    $(".container-fluid").addClass("clearfix");
    $(".practice").show();
    $("#mobile-practice").hide();
    $("#Profile_mobile").hide();
    $(".address").show();
    $(".line").show();
    $("ul").show();
    $(".mobile-ul").hide();
  }
}

var pos;
var map;

// initialize google maps
function initMap(practice_location, practice_name) {
  var mapCenter = new google.maps.LatLng(33.749, -84.388); //Google map Coordinates
  map = new google.maps.Map($("#map")[0], {
    center: mapCenter,
    zoom: 9,
  });

  if (practice_location && practice_name != null) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        infoWindow = new google.maps.InfoWindow({
          map: map,
          pixelOffset: new google.maps.Size(0, -35),
        });
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent(`Found your location`);

        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "Your location",
        });
        infoWindow2 = new google.maps.InfoWindow({
          map: map,
          pixelOffset: new google.maps.Size(0, -35),
        });
        infoWindow2.setPosition(practice_location);
        infoWindow2.setContent(practice_name);
        var marker2 = new google.maps.Marker({
          position: practice_location,
          map: map,
          title: name,
        });
        map.panTo(pos);
      });
    } else {
      // console.log("Browser doesn't support geolocation!");
    }
  } else {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "Your location",
        });
        map.panTo(pos);
      });
    } else {
      // console.log("Browser doesn't support geolocation!");
    }
  }
}

// resize map so its visible in the modal
function mapResize() {
  $("#map-button").on("click", function (event) {
    initMap(practice_location, practice_name);
  });
}

// get doctor data from API and limit results
function getDataFromApi(specialty, user_location, location, callback) {
  const settings = {
    data: {
      specialty_uid: `${specialty}`,
      user_location: `${user_location}`,
      location: `${location}`,
      skip: "0",
      limit: "50",
      user_key: "ca6c55cccdb1c2084039aeadd09f13b3",
    },
    url: "https://api.betterdoctor.com/2016-03-01/doctors",
    dataType: "json",
    type: "GET",
    CORS: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    },
    success: callback,
  };
  $.ajax(settings);
}

// get doctor data from api for profile
function getDoctor(uid, callback) {
  const settings = {
    data: {
      user_key: "ca6c55cccdb1c2084039aeadd09f13b3",
    },
    url: `https://api.betterdoctor.com/2016-03-01/doctors/${uid}`,
    dataType: "json",
    type: "GET",
    CORS: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    success: callback,
  };
  $.ajax(settings);
}

// render results to user
function getDoctorHtmlString(result) {
  $(".js-map").show();
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
                    <h3 class="name">${result.profile.first_name} ${
    result.profile.last_name
  }, ${result.profile.title}</h3>
                    <p class="profession">${result.practices[0].name}</p>

                    <p class="text-center"><div class="card-specialty">${
                      result.specialties[0].name
                    }</div></p>
                    <p class="text-center"><div class="distance">${Math.round(
                      result.practices[0].distance
                    )} miles from you</div></p> 
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
                <h5 class="motto">State Licensed In: ${
                  result.licenses[0].state
                }</h5>
            </div>
            <div class="content">
                <div class="main">
                    <h4 class="text-center">Bio</h4>
                    <p class="text-center"><div class="bio">${
                      result.profile.bio
                    }</div></p> 
                <div class="social-links text-center">
                    <a href="#" class="more js-more" data-toggle="modal" data-target="#profile-modal"
                    profile_image="${result.profile.image_url}" firstname="${
    result.profile.first_name
  }" 
                    lastname="${result.profile.last_name}" profile_title="${
    result.profile.title
  }" 
                    bio="${result.profile.bio}" license_state="${
    result.licenses[0].state
  }" 
                    specialties_description="${
                      result.specialties[0].description
                    }" practice="${result.practices[0].name}"
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
                    doctor_distance="Dr. ${
                      result.profile.last_name
                    } is ${Math.round(
    result.practices[0].distance
  )} miles from you"
                    >View More</a>
                </div>
            </div>
        </div> <!-- end back panel -->
    </div> <!-- end card -->
</div> <!-- end card-container -->
    `;
}

// generate specialty option element
function generateSpecialtyOptionElement() {
  // get specialty option elements dynamically - directly from api (rate limits apply)
  // console.log(``<option value="${result.uid}">${result.name}</option>`,`);

  // immutable retrieval of specialty option elements
  specialtyOptions = [
    `<option disabled selected>Select a Specialty</option>`,
    `<option value="sport-physical-therapist">Sports Physical Therapy</option>`,
    `<option value="sports-vision-optometrist">Sports Vision</option>`,
    `<option value="surgery-hospice-and-palliative-medicine">Surgery Hospice and Palliative Medicine</option>`,
    `<option value="sleep-medicine-doctor">Sleep Medicine</option>`,
    `<option value="therapeutic-radiologist">Therapeutic Radiology</option>`,
    `<option value="speech-therapist">Speech Therapy</option>`,
    `<option value="spinal-cord-injury-physiatrist">Spinal Cord Injury Medicine</option>`,
    `<option value="legal-medicine">Legal Medicine</option>`,
    `<option value="medical-examiner-chiropractor">Chiropractic Medical Examiner</option>`,
    `<option value="mental-health-nurse-practitioner">Psych/Mental Health Nurse Practitioner</option>`,
    `<option value="micrographic-surgeon">MOHS-Micrographic Surgery</option>`,
    `<option value="neuropathologist">Neuropathology</option>`,
    `<option value="nuclear-cardiologist">Nuclear Cardiology</option>`,
    `<option value="nuclear-imaging-doctor">Nuclear Imaging & Therapy</option>`,
    `<option value="occupational-medicine-doctor">Occupational Medicine</option>`,
    `<option value="body-imaging-radiologist">Body Imaging</option>`,
    `<option value="critical-care-obgyn">Critical Care Medicine OBGYN</option>`,
    `<option value="dental-laboratory-technician">Dental Laboratory Technician</option>`,
    `<option value="dental-therapist">Dental Therapist</option>`,
    `<option value="dentist">Dentistry</option>`,
    `<option value="clinical-pathologist">Clinical Pathology</option>`,
    `<option value="allergy-immunology-allergy">Allergy & Immunology Allergy</option>`,
    `<option value="group-psychotherapy-psychologist">Group Psychotherapy</option>`,
    `<option value="internal-medicine-clinical-laboratory-immunology">Internal Medicine Clinical & Laboratory Immunology</option>`,
    `<option value="immunodermatologist">Clinical & Laboratory Dermatological Immunology</option>`,
    `<option value="dermatologist">Dermatology</option>`,
    `<option value="dermatopathology-doctor">Dermatopathology</option>`,
    `<option value="occupational-therapy-assistant">Occupational Therapy Assistant</option>`,
    `<option value="occupational-therapy-assistant-feeding-eating-swallowing">Occupational Therapy Assistant Feeding, Eating & Swallowing</option>`,
    `<option value="occupational-therapy-assistant-low-vision">Occupational Therapy Assistant Low Vision</option>`,
    `<option value="occupational-therapy-assistant-driving-and-community-mobility">Occupational Therapy Assistant Driving and Community Mobility</option>`,
    `<option value="urologist">Urology</option>`,
    `<option value="vision-therapy-optometrist">Vision Therapy</option>`,
    `<option value="oral-pathologist">Oral and Maxillofacial Pathology</option>`,
    `<option value="oral-surgeon">Oral & Maxillofacial Surgery</option>`,
    `<option value="pain-management-doctor">Pain Medicine</option>`,
    `<option value="pediatric-chiropractor">Chiropractic Pediatrics</option>`,
    `<option value="pediatric-physical-therapist">Pediatric Physical Therapy</option>`,
    `<option value="pediatric-rheumatologist">Pediatric Rheumatology</option>`,
    `<option value="pediatric-pulmonologist">Pediatric Pulmonology</option>`,
    `<option value="pediatric-dermatologist">Pediatric Dermatology</option>`,
    `<option value="blood-banking-transfusion-doctor">Blood Banking & Transfusion Medicine</option>`,
    `<option value="ear-nose-throat-doctor">Otolaryngology</option>`,
    `<option value="facial-plastic-surgeon">Facial Plastic Surgery</option>`,
    `<option value="medical-microbiologist">Medical Microbiology</option>`,
    `<option value="family-medicine-hospice-and-palliative-medicine">Family Medicine Hospice and Palliative Medicine</option>`,
    `<option value="low-vision-rehabilitation-optometrist">Low Vision Rehabilitation</option>`,
    `<option value="family-medicine-sleep-medicine">Family Medicine Sleep Medicine</option>`,
    `<option value="pediatric-radiologist">Pediatric Radiology</option>`,
    `<option value="rehabilitation-chiropractor">Chiropractic Rehabilitation</option>`,
    `<option value="radiology-podiatrist">Radiology Podiatry</option>`,
    `<option value="psychiatry-neurology-forensic-psychiatry">Psychiatry & Neurology Forensic Psychiatry</option>`,
    `<option value="pulmonary-function-technologist">Pulmonary Function Technologist</option>`,
    `<option value="primary-care-nurse-practitioner">Primary Care Nurse Practitioner</option>`,
    `<option value="professional-counselor">Professional Counseling</option>`,
    `<option value="psychiatrist">Psychiatry</option>`,
    `<option value="psychiatry-neurology-addiction-medicine">Psychiatry & Neurology Addiction Medicine</option>`,
    `<option value="phlebology">Phlebology</option>`,
    `<option value="physiatrist">Physical Medicine & Rehabilitation</option>`,
    `<option value="pedorthist">Pedorthist</option>`,
    `<option value="plastic-surgery-plastic-surgery-within-the-head-and-neck">Plastic Surgery Plastic Surgery Within the Head and Neck</option>`,
    `<option value="plastic-surgery-specialist">Plastic Surgery</option>`,
    `<option value="physical-therapist">Physical Therapy</option>`,
    `<option value="podiatry-foot-surgeon">Foot Surgery</option>`,
    `<option value="rehabilitation-counselor">Rehabilitation Counselor</option>`,
    `<option value="respiratory-therapist-certified-pulmonary-diagnostics">Respiratory Therapist, Certified Pulmonary Diagnostics</option>`,
    `<option value="rehabilitation-psychologist">Rehabilitation Psychology</option>`,
    `<option value="respiratory-therapist-registered-pulmonary-diagnostics">Respiratory Therapist, Registered Pulmonary Diagnostics</option>`,
    `<option value="respiratory-therapist-registered-snfsubacute-care">Respiratory Therapist, Registered SNF/Subacute Care</option>`,
    `<option value="rheumatologist">Rheumatology</option>`,
    `<option value="radiology-chiropractor">Chiropractic Radiology</option>`,
    `<option value="reconstructive-orthopedist">Adult Reconstructive orthopedic Surgery</option>`,
    `<option value="respiratory-therapist-certified-general-care">Respiratory Therapist, Certified General Care</option>`,
    `<option value="respiratory-therapist-certified-educational">Respiratory Therapist, Certified Educational</option>`,
    `<option value="respiratory-therapist-certified-geriatric-care">Respiratory Therapist, Certified Geriatric Care</option>`,
    `<option value="respiratory-therapist-certified">Respiratory Therapist, Certified</option>`,
    `<option value="preventive-medical-toxicologist">Preventive Medical Toxicology</option>`,
    `<option value="primary-podiatry-doctor">Primary Podiatric Medicine</option>`,
    `<option value="procedural-dermatologist">Procedural Dermatology</option>`,
    `<option value="psychiatry-neurology-behavioral-neurology-neuropsychiatry">Psychiatry & Neurology Behavioral Neurology & Neuropsychiatry</option>`,
    `<option value="psychiatry-neurology-diagnostic-neuroimaging">Psychiatry & Neurology Diagnostic Neuroimaging</option>`,
    `<option value="psychiatry-neurology-psychosomatic-medicine">Psychiatry & Neurology Psychosomatic Medicine</option>`,
    `<option value="respiratory-therapist-certified-critical-care">Respiratory Therapist, Certified Critical Care</option>`,
    `<option value="sports-medicine-orthopedist">Orthopedic Sports Medicine</option>`,
    `<option value="respiratory-therapist-certified-snfsubacute-care">Respiratory Therapist, Certified SNF/Subacute Care</option>`,
    `<option value="respiratory-therapist-registered-critical-care">Respiratory Therapist, Registered Critical Care</option>`,
    `<option value="school-counselor">School Counseling</option>`,
    `<option value="techniciantechnologist-ocularist">Technician/Technologist Ocularist</option>`,
    `<option value="acupuncturist">Acupuncture</option>`,
    `<option value="acute-nurse-practitioner">Acute Care Nurse Practitioner</option>`,
    `<option value="addiction-psychiatrist">Addiction Psychiatry</option>`,
    `<option value="clinical-psychologist">Clinical Psychology</option>`,
    `<option value="anaplastologist">Anaplastologist</option>`,
    `<option value="aerospace-medicine-doctor">Aerospace Medicine</option>`,
    `<option value="anesthesiologist">Anesthesiology</option>`,
    `<option value="cardiopulmonary-physical-therapist">Cardiopulmonary Physical Therapy</option>`,
    `<option value="health-service-psychologist">Health Service Psychology</option>`,
    `<option value="developmental-therapist">Developmental Therapist</option>`,
    `<option value="developmental-behavioral-pediatrician">Developmental Behavioral Pediatrics</option>`,
    `<option value="forensic-psychologist">Forensic Psychology</option>`,
    `<option value="geriatric-psychiatrist">Geriatric Psychiatry</option>`,
    `<option value="clinical-pharmacology">Clinical Pharmacology</option>`,
    `<option value="critical-care-doctor">Critical Care Medicine</option>`,
    `<option value="hearing-aid-audiologist">Audiology & Hearing Aid Fitter</option>`,
    `<option value="hospice-care-palliative-doctor">Hospice and Palliative Medicine</option>`,
    `<option value="independent-medical-examiner">Independent Medical Examiner</option>`,
    `<option value="internal-medicine-adolescent-medicine">Internal Medicine Adolescent Medicine</option>`,
    `<option value="internal-medicine-bariatric-medicine">Internal Medicine Bariatric Medicine</option>`,
    `<option value="internal-medicine-sports-medicine">Internal Medicine Sports Medicine</option>`,
    `<option value="internist">Internal Medicine</option>`,
    `<option value="laboratory-medicine-doctor">Clinical Pathology/Laboratory Medicine</option>`,
    `<option value="interventional-cardiologist">Interventional Cardiology</option>`,
    `<option value="medical-genetics-molecular-genetic-pathology">Medical Genetics Molecular Genetic Pathology</option>`,
    `<option value="nutritionist">Nutrition Medicine</option>`,
    `<option value="obstetrics-gynecology-female-pelvic-medicine-and-reconstructive-surgery">Obstetrics & Gynecology Female Pelvic Medicine and Reconstructive Surgery</option>`,
    `<option value="obstetrics-gynecologist">Obstetrics & Gynecology</option>`,
    `<option value="occupational-therapist">Occupational Therapist</option>`,
    `<option value="music-therapist">Music Therapist</option>`,
    `<option value="neuromusculoskeletal-medicine-doctor">Neuromusculoskeletal Medicine & OMM</option>`,
    `<option value="neonatal-critical-care-nurse-practitioner">Neonatal, Critical Care Nurse Practitioner</option>`,
    `<option value="neurosurgeon">Neurological Surgery</option>`,
    `<option value="nuclear-medicine-doctor">Nuclear Medicine</option>`,
    `<option value="occupational-therapist-ergonomics">Occupational Therapist Ergonomics</option>`,
    `<option value="occupational-therapist-environmental-modification">Occupational Therapist Environmental Modification</option>`,
    `<option value="orthopedic-chiropractor">Chiropractic Orthopedics</option>`,
    `<option value="otology-neurotologist">Otology & Neurotology</option>`,
    `<option value="ophthalmologist">Ophthalmology</option>`,
    `<option value="oncologist">Hematology & Oncology</option>`,
    `<option value="diagnostic-ultrasound-radiologist">Diagnostic Ultrasound</option>`,
    `<option value="cardiothoracic-surgeon">Cardiothoracic Surgery</option>`,
    `<option value="emergency-medicine-hospice-and-palliative-medicine">Emergency Medicine Hospice and Palliative Medicine</option>`,
    `<option value="pediatric-cardiologist">Pediatric Cardiology</option>`,
    `<option value="environmental-preventive-medicine-doctor">Environmental Preventive Medicine</option>`,
    `<option value="dietitian">Dietitian, Registered</option>`,
    `<option value="mental-health-counselor">Mental Health Counseling</option>`,
    `<option value="nephrologist">Nephrology</option>`,
    `<option value="emergency-medicine-pediatrician">Pediatric Emergency Medicine</option>`,
    `<option value="preventive-medicine-doctor">Preventive Medicine</option>`,
    `<option value="podiatrist">Podiatry</option>`,
    `<option value="pediatric-gastroenterologist">Pediatric Gastroenterology</option>`,
    `<option value="pediatric-nurse-practitioner">Pediatric Nurse Practitioner</option>`,
    `<option value="otolaryngology-facial-plastic-surgeon">Otolaryngology/Facial Plastic Surgery</option>`,
    `<option value="orthotist">Orthotist</option>`,
    `<option value="pastoral-counselor">Pastoral Counseling</option>`,
    `<option value="pediatrician">Pediatrics</option>`,
    `<option value="pediatric-optometrist">Pediatric Optometry</option>`,
    `<option value="pediatric-medical-toxicologist">Medical Toxicology</option>`,
    `<option value="addiction-medicine-anesthesiologist">Addiction Medicine</option>`,
    `<option value="allergy-immunology-clinical-laboratory-immunology">Allergy & Immunology Clinical & Laboratory Immunology</option>`,
    `<option value="adolescent-medicine-pediatrician">Adolescent Medicine</option>`,
    `<option value="critical-care-pediatrician">Pediatric Critical Care Medicine</option>`,
    `<option value="cytopathologist">Cytopathology</option>`,
    `<option value="dental-assistant">Dental Assistant</option>`,
    `<option value="dentist-dental-public-health">Dentist Dental Public Health</option>`,
    `<option value="anatomic-pathologist">Anatomic Pathology</option>`,
    `<option value="art-therapist">Art Therapist</option>`,
    `<option value="counceling-pshychologist">Counseling Psychology</option>`,
    `<option value="denturist">Denturist</option>`,
    `<option value="cognitive-behavioral-psychologist">Cognitive & Behavioral Psychology</option>`,
    `<option value="child-psychiatrist">Child & Adolescent Psychiatry</option>`,
    `<option value="dentist-dentist-anesthesiologist">Dentist Dentist Anesthesiologist</option>`,
    `<option value="dermatopathologist">Dermatopathology</option>`,
    `<option value="diagnostic-neuroimaging-radiologist">Diagnostic Neuroimaging</option>`,
    `<option value="family-nurse-practitioner">Family Nurse Practitioner</option>`,
    `<option value="hospice-palliative-medicine-anesthesiologist">Hospice and Palliative Medicine</option>`,
    `<option value="hospice-palliative-physiatrist">Hospice and Palliative Medicine</option>`,
    `<option value="hospitalist">Hospitalist</option>`,
    `<option value="head-neck-plastic-surgeon">Plastic Surgery within the Head & Neck</option>`,
    `<option value="general-practitioner">General Practice</option>`,
    `<option value="general-surgeon">Surgery</option>`,
    `<option value="gynecologist">Gynecology</option>`,
    `<option value="internist-chiropractor">Chiropractic Internal Medicine</option>`,
    `<option value="massage-therapist">Massage Therapy</option>`,
    `<option value="neuroradiologist">Neuroradiology</option>`,
    `<option value="nuclear-radiologist">Nuclear Radiology</option>`,
    `<option value="occupational-therapist-human-factors">Occupational Therapist Human Factors</option>`,
    `<option value="internal-medicine-allergy-immunology">Internal Medicine Allergy & Immunology</option>`,
    `<option value="internal-medicine-magnetic-resonance-imaging-mri">Internal Medicine Magnetic Resonance Imaging (MRI)</option>`,
    `<option value="podiatrist-general-practice">Podiatrist General Practice</option>`,
    `<option value="occupational-therapist-physical-rehabilitation">Occupational Therapist Physical Rehabilitation</option>`,
    `<option value="occupational-therapy-assistant-environmental-modification">Occupational Therapy Assistant Environmental Modification</option>`,
    `<option value="medical-oncologist">Medical Oncology</option>`,
    `<option value="nurse-practitioner">Nurse Practitioner</option>`,
    `<option value="optometrist">Optometry</option>`,
    `<option value="urology-female-pelvic-medicine-and-reconstructive-surgery">Urology Female Pelvic Medicine and Reconstructive Surgery</option>`,
    `<option value="oral-radiologist">Oral and Maxillofacial Radiology</option>`,
    `<option value="orthodontist">Orthodontics</option>`,
    `<option value="diagnostic-radiologist">Diagnostic Radiology</option>`,
    `<option value="endocrinologist">Endocrinology, Diabetes & Metabolism</option>`,
    `<option value="endotontist">Endodontics</option>`,
    `<option value="family-medicine-geriatric-medicine">Family Medicine Geriatric Medicine</option>`,
    `<option value="family-medicine-bariatric-medicine">Family Medicine Bariatric Medicine</option>`,
    `<option value="vivo-vitro-nuclear-medicine-doctor">In Vivo & In Vitro Nuclear Medicine</option>`,
    `<option value="interventional-pain-management-doctor">Interventional Pain Medicine</option>`,
    `<option value="mastectomy-fitter">Mastectomy Fitter</option>`,
    `<option value="maternal-fetal-medicine-obgyn">Maternal & Fetal Medicine</option>`,
    `<option value="pediatric-oncologist">Pediatric Hematology & Oncology</option>`,
    `<option value="pediatric-pathologist">Pediatric Pathology</option>`,
    `<option value="pediatric-transplant-hepatologist">Pediatric Transplant Hepatology</option>`,
    `<option value="psychiatry-neurology-bariatric-medicine">Psychiatry & Neurology Bariatric Medicine</option>`,
    `<option value="psychiatry-neurology-hospice-and-palliative-medicine">Psychiatry & Neurology Hospice and Palliative Medicine</option>`,
    `<option value="podiatrist-public-medicine">Podiatrist Public Medicine</option>`,
    `<option value="preventive-sports-medicine-doctor">Preventive Sports Medicine</option>`,
    `<option value="neurologist">Neurology</option>`,
    `<option value="neurodevelopmental-disability-pediatrician">Neurodevelopmental Disability</option>`,
    `<option value="otolaryngic-allergist">Otolaryngic Allergy</option>`,
    `<option value="neurology-physical-therapist">Neurology Physical Therapy</option>`,
    `<option value="pediatric-nephrologist">Pediatric Nephrology</option>`,
    `<option value="pediatric-neurologist">Pediatric Neurology</option>`,
    `<option value="periodontist">Periodontics</option>`,
    `<option value="plastic-surgery-surgery-of-the-hand">Plastic Surgery Surgery of the Hand</option>`,
    `<option value="psychoanalyst">Psychoanalysis</option>`,
    `<option value="psychologist">Psychology</option>`,
    `<option value="respiratory-therapist-certified-patient-transport">Respiratory Therapist, Certified Patient Transport</option>`,
    `<option value="rehabilitation-practitioner">Rehabilitation Practitioner</option>`,
    `<option value="recreation-therapist">Recreation Therapist</option>`,
    `<option value="radiation-oncologist">Radiation Oncology</option>`,
    `<option value="rehabilitation-counselor-orientation-and-mobility-training-provider">Rehabilitation Counselor Orientation and Mobility Training Provider</option>`,
    `<option value="techniciantechnologist-contact-lens-fitter">Technician/Technologist Contact Lens Fitter</option>`,
    `<option value="techniciantechnologist-ophthalmic-assistant">Technician/Technologist Ophthalmic Assistant</option>`,
    `<option value="techniciantechnologist-optometric-assistant">Technician/Technologist Optometric Assistant</option>`,
    `<option value="school-psychologist">School Psychology</option>`,
    `<option value="specialisttechnologist-athletic-trainer">Specialist/Technologist Athletic Trainer</option>`,
    `<option value="respiratory-therapist-registered-pulmonary-rehabilitation">Respiratory Therapist, Registered Pulmonary Rehabilitation</option>`,
    `<option value="surgery-surgical-critical-care">Surgery Surgical Critical Care</option>`,
    `<option value="surgery-trauma-surgery">Surgery Trauma Surgery</option>`,
    `<option value="surgical-oncologist">Surgical Oncology</option>`,
    `<option value="techniciantechnologist-ophthalmic">Technician/Technologist Ophthalmic</option>`,
    `<option value="respiratory-therapist-registered-general-care">Respiratory Therapist, Registered General Care</option>`,
    `<option value="respiratory-therapist-registered-patient-transport">Respiratory Therapist, Registered Patient Transport</option>`,
    `<option value="respiratory-therapist-registered-palliativehospice">Respiratory Therapist, Registered Palliative/Hospice</option>`,
    `<option value="sports-chiropractor">Chiropractic Sports Medicine</option>`,
    `<option value="specialisttechnologist">Specialist/Technologist</option>`,
    `<option value="respiratory-therapist-registered-educational">Respiratory Therapist, Registered Educational</option>`,
    `<option value="respiratory-therapist-registered-emergency-care">Respiratory Therapist, Registered Emergency Care</option>`,
    `<option value="spine-orthopedist">Orthopedic Surgery of the Spine</option>`,
    `<option value="respiratory-therapist-registered-home-health">Respiratory Therapist, Registered Home Health</option>`,
    `<option value="techniciantechnologist-contact-lens">Technician/Technologist Contact Lens</option>`,
    `<option value="trauma-orthopedist">Orthopedic Trauma</option>`,
    `<option value="undersea-hyperbaric-medicine-doctor">Undersea and Hyperbaric Medicine</option>`,
    `<option value="techniciantechnologist-optician">Technician/Technologist Optician</option>`,
    `<option value="techniciantechnologist-optometric-technician">Technician/Technologist Optometric Technician</option>`,
    `<option value="transplant-surgery">Transplant Surgery</option>`,
    `<option value="addiction-psychologist">Addiction Psychology</option>`,
    `<option value="allergist">Allergy & Immunology</option>`,
    `<option value="corneal-contact-management-optometrist">Corneal and Contact Management</option>`,
    `<option value="colorectal-surgeon">Colon & Rectal Surgery</option>`,
    `<option value="critical-care-anesthesiologist">Critical Care Medicine</option>`,
    `<option value="counselor-specialist">Counseling</option>`,
    `<option value="dental-hygienist">Dental Hygienist</option>`,
    `<option value="health-psychologist">Health Psychology</option>`,
    `<option value="human-factor-physical-therapist">Human Factor Physical Therapy</option>`,
    `<option value="geneticist">Medical Genetics, Ph.D. Medical Genetics</option>`,
    `<option value="geriatric-physical-therapist">Geriatrics Physical Therapy</option>`,
    `<option value="hand-physical-therapist">Hand Physical Therapy</option>`,
    `<option value="foot-ankle-orthopedist">Foot and Ankle Surgery</option>`,
    `<option value="family-psychologist">Family Psychology</option>`,
    `<option value="gastroenterologist">Gastroenterology</option>`,
    `<option value="family-practitioner">Family Medicine</option>`,
    `<option value="occupational-therapist-feeding-eating-swallowing">Occupational Therapist Feeding, Eating & Swallowing</option>`,
    `<option value="occupational-therapist-gerontology">Occupational Therapist Gerontology</option>`,
    `<option value="neuromuscular-physiatrist">Neuromuscular Medicine</option>`,
    `<option value="occupational-therapist-hand">Occupational Therapist Hand</option>`,
    `<option value="hospice-palliative-medicine-radiologist">Hospice and Palliative Medicine</option>`,
    `<option value="immunopathologist">Immunopathology</option>`,
    `<option value="occupational-therapist-neurorehabilitation">Occupational Therapist Neurorehabilitation</option>`,
    `<option value="oral-medicinist">Oral Medicinist</option>`,
    `<option value="oral-maxillofacial-surgeon">Oral & Maxillofacial Surgery</option>`,
    `<option value="pathologist">Pathology</option>`,
    `<option value="psychiatry-neurology-sleep-medicine">Psychiatry & Neurology Sleep Medicine</option>`,
    `<option value="psychiatry-neurology-vascular-neurology">Psychiatry & Neurology Vascular Neurology</option>`,
    `<option value="family-medicine-adolescent-medicine">Family Medicine Adolescent Medicine</option>`,
    `<option value="cardiologist">Cardiovascular Disease</option>`,
    `<option value="clinical-cytogeneticist">Clinical Cytogenetic</option>`,
    `<option value="electrophysiology-physical-therapist">Clinical Electrophysiology</option>`,
    `<option value="clinical-molecular-geneticist">Clinical Molecular Genetics</option>`,
    `<option value="clinical-exercise-physiologist">Clinical Exercise Physiologist</option>`,
    `<option value="emergency-medicine-pediatric-emergency-medicine">Emergency Medicine Pediatric Emergency Medicine</option>`,
    `<option value="emergency-medicine-doctor">Emergency Medicine</option>`,
    `<option value="ergonomic-physical-therapist">Ergonomic Physical Therapy</option>`,
    `<option value="pain-medicine-physiatrist">Pain Medicine</option>`,
    `<option value="pediatric-allergist">Pediatric Allergy</option>`,
    `<option value="pediatric-orhopedic-surgeon">Pediatric Orthopedic Surgery</option>`,
    `<option value="neurology-chiropractor">Chiropractic Neurology</option>`,
    `<option value="pain-medicine-anesthesiologist">Pain Medicine</option>`,
    `<option value="pediatric-ear-nose-throat-doctor">Pediatric Otolaryngology</option>`,
    `<option value="pediatric-anesthesiologist">Pediatric Anesthesiology</option>`,
    `<option value="pathology-clinical-informatics">Pathology Clinical Informatics</option>`,
    `<option value="pediatric-endocrinologist">Pediatric Endocrinology</option>`,
    `<option value="pediatric-rehabilitation-physiatrist">Pediatric Rehabilitation Medicine</option>`,
    `<option value="pediatrics-clinical-laboratory-immunology">Pediatrics Clinical & Laboratory Immunology</option>`,
    `<option value="podiatry-surgeon">Foot & Ankle Surgery</option>`,
    `<option value="prosthodontist">Prosthodontics</option>`,
    `<option value="radiological-physicist">Radiological Physics</option>`,
    `<option value="rehabilitation-counselor-assistive-technology-supplier">Rehabilitation Counselor Assistive Technology Supplier</option>`,
    `<option value="psychiatry-neurology-neurodevelopmental-disabilities">Psychiatry & Neurology Neurodevelopmental Disabilities</option>`,
    `<option value="respiratory-therapist-certified-home-health">Respiratory Therapist, Certified Home Health</option>`,
    `<option value="respiratory-therapist-certified-neonatalpediatrics">Respiratory Therapist, Certified Neonatal/Pediatrics</option>`,
    `<option value="respiratory-therapist-certified-pulmonary-function-technologist">Respiratory Therapist, Certified Pulmonary Function Technologist</option>`,
    `<option value="preventive-medicine-clinical-informatics">Preventive Medicine Clinical Informatics</option>`,
    `<option value="prosthetist">Prosthetist</option>`,
    `<option value="psychiatry-neurology-neuromuscular-medicine">Psychiatry & Neurology Neuromuscular Medicine</option>`,
    `<option value="psychiatry-neurology-pain-medicine">Psychiatry & Neurology Pain Medicine</option>`,
    `<option value="orthopedic-surgeon">Orthopedic Surgery</option>`,
    `<option value="orthotic-fitter">Orthotic Fitter</option>`,
    `<option value="orthopedic-physical-therapist">Orthopedic Physical Therapy</option>`,
    `<option value="pediatric-dentist">Pediatric Dentistry</option>`,
    `<option value="pediatric-urologist">Pediatric Urology</option>`,
    `<option value="pediatric-surgeon">Pediatric Surgery</option>`,
    `<option value="pediatrics-hospice-and-palliative-medicine">Pediatrics Hospice and Palliative Medicine</option>`,
    `<option value="pediatrics-medical-toxicology">Pediatrics Medical Toxicology</option>`,
    `<option value="physical-therapy-assistant">Physical Therapy Assistant</option>`,
    `<option value="plastic-surgeon">Plastic and Reconstructive Surgery</option>`,
    `<option value="pulmonologist">Pulmonary Disease</option>`,
    `<option value="rehabilitation-counselor-assistive-technology-practitioner">Rehabilitation Counselor Assistive Technology Practitioner</option>`,
    `<option value="reproductive-erndocrinologist">Reproductive Endocrinology</option>`,
    `<option value="respiratory-therapist-registered-geriatric-care">Respiratory Therapist, Registered Geriatric Care</option>`,
    `<option value="respiratory-therapist-registered-neonatalpediatrics">Respiratory Therapist, Registered Neonatal/Pediatrics</option>`,
    `<option value="respiratory-therapist-registered-pulmonary-function-technologist">Respiratory Therapist, Registered Pulmonary Function Technologist</option>`,
    `<option value="respiratory-therapist-certified-palliativehospice">Respiratory Therapist, Certified Palliative/Hospice</option>`,
    `<option value="respiratory-therapist-certified-pulmonary-rehabilitation">Respiratory Therapist, Certified Pulmonary Rehabilitation</option>`,
    `<option value="respiratory-therapist-registered">Respiratory Therapist, Registered</option>`,
    `<option value="respiratory-therapist-certified-emergency-care">Respiratory Therapist, Certified Emergency Care</option>`,
    `<option value="sleep-medicine-otolaryngologist">Otolaryngologic Sleep Medicine</option>`,
    `<option value="techniciantechnologist-orthoptist">Technician/Technologist Orthoptist</option>`,
    `<option value="thermography-chiropractor">Chiropractic Thermography</option>`,
    `<option value="surgery-surgery-of-the-hand">Surgery of the Hand</option>`,
    `<option value="techniciantechnologist">Technician/Technologist</option>`,
    `<option value="specialisttechnologist-rehabilitation-blind">Specialist/Technologist Rehabilitation, Blind</option>`,
    `<option value="sport-medicine-pediatrician">Pediatric Sport Medicine</option>`,
    `<option value="sports-medicine-physiatrist">Physiastric Sports Medicine</option>`,
    `<option value="sports-podiatrist">Sports Medicine Podiatry</option>`,
    `<option value="sports-medicine-doctor">Sports Medicine</option>`,
    `<option value="sleep-medicine-pediatrician">Pediatric Sleep Medicine</option>`,
    `<option value="transplant-hepatologist">Transplant Hepatology</option>`,
    `<option value="addiction-counselor">Addiction Counseling</option>`,
    `<option value="addiction-specialist">Addiction Medicine</option>`,
    `<option value="adult-nurse-practitioner">Adult Health Nurse Practitioner</option>`,
    `<option value="advanced-practice-dental-therapist">Advanced Practice Dental Therapist</option>`,
    `<option value="adult-psychologist">Adult Development & Aging Psychology</option>`,
    `<option value="chemical-pathologist">Chemical Pathology</option>`,
    `<option value="clinical-child-psychologist">Clinical Child & Adolescent Psychology</option>`,
    `<option value="chiropractor">Chiropractics</option>`,
    `<option value="dance-therapist">Dance Therapist</option>`,
    `<option value="bariatric-medicine-obgyn">Bariatric Medicine OBGYN</option>`,
    `<option value="assistant-podiatric">Assistant, Podiatric</option>`,
    `<option value="audiologist">Audiology</option>`,
    `<option value="hospice-palliative-obgyn">Hospice & Palliative Medicine</option>`,
    `<option value="infectious-disease-doctor">Infectious Disease</option>`,
    `<option value="infectious-diseases-pediatrician">Pediatric Infectious Disease</option>`,
    `<option value="general-dentist">General Dentistry</option>`,
    `<option value="gerontology-nurse-practitioner">Gerontology Nurse Practitioner</option>`,
    `<option value="geriatric-medicine-doctor">Geriatric Medicine</option>`,
    `<option value="gynecologic-oncologist">Gynecologic Oncology</option>`,
    `<option value="electrodiagnostic-medicine">Electrodiagnostic Medicine</option>`,
    `<option value="forensic-pathologist">Forensic Pathology</option>`,
    `<option value="hematopathologist">Hematology</option>`,
    `<option value="hand-orthopedist">Hand Surgery</option>`,
    `<option value="hepatologist">Hepatology</option>`,
    `<option value="occupational-therapist-low-vision">Occupational Therapist Low Vision</option>`,
    `<option value="occupational-therapist-mental-health">Occupational Therapist Mental Health</option>`,
    `<option value="occupational-therapist-pediatrics">Occupational Therapist Pediatrics</option>`,
    `<option value="internal-medicine-clinical-cardiac-electrophysiology">Internal Medicine Clinical Cardiac Electrophysiology</option>`,
    `<option value="internal-medicine-hematology">Internal Medicine Hematology</option>`,
    `<option value="internal-medicine-hypertension-specialist">Internal Medicine Hypertension Specialist</option>`,
    `<option value="kinesiotherapist">Kinesiotherapist</option>`,
    `<option value="obgyn-nurse-practitioner">OBGYN Nurse Practitioner</option>`,
    `<option value="occupational-chiropractor">Chiropractic Occupational Health</option>`,
    `<option value="occupational-therapist-driving-and-community-mobility">Occupational Therapist Driving and Community Mobility</option>`,
    `<option value="molecular-genetic-pathologist">Molecular Genetic Pathology</option>`,
    `<option value="neonatal-perinatal-pediatrician">Neonatal & Perinatal Medicine</option>`,
    `<option value="neonatal-nurse-practitioner">Neonatology Nurse Practitioner</option>`,
    `<option value="neuromusculoskeletal-medicine-sports-medicine">Neuromusculoskeletal Medicine, Sports Medicine</option>`,
    `<option value="naturopathic-doctor">Naturopath</option>`,
    `<option value="mental-retardation-psychologists">Mental Retardation & Developmental Disabilities</option>`,
    `<option value="obstetrician">Obstetrics</option>`,
    `<option value="nutrition-chiropractor">Chiropractic Nutrition Medicine</option>`,
    `<option value="occupational-vision-optometrist">Occupational Vision</option>`,
    `<option value="psychiatry-neurology-sports-medicine">Psychiatry & Neurology Sports Medicine</option>`,
    `<option value="medical-geneticist">Ph.D. Medical Genetics</option>`,
    `<option value="medical-psychologist">Prescribing (Medical) Psychology</option>`,
    `<option value="vascular-interventional-radiologist">Vascular & Interventional Radiology</option>`,
    `<option value="vascular-surgeon">Vascular Surgery</option>`,
    `<option value="clinical-neurophysiologist">Clinical Neurophysiology</option>`,
    `<option value="women-health-nurse-practitioner">Women's Health Nurse Practitioner</option>`,
    `<option value="emergency-medicine-emergency-medical-services">Emergency Medicine Emergency Medical Services</option>`,
    `<option value="child-abuse-pediatrician">Child Abuse Pediatrics</option>`,
    `<option value="clinical-biochemical-geneticist">Clinical Biochemical Genetics</option>`,
    `<option value="emergency-medicine-sports-medicine">Emergency Medicine Sports Medicine</option>`,
    `<option value="clinical-geneticist">Clinical Genetics (M.D.)</option>`,
    `<option value="emergency-medicine-undersea-and-hyperbaric-medicine">Emergency Medicine Undersea and Hyperbaric Medicine</option>`,
    `<option value="family-medicine-addiction-medicine">Family Medicine Addiction Medicine</option>`,
    `<option value="family-medicine-adult-medicine">Family Medicine Adult Medicine</option>`,
  ];
  $(".js-specialty").html(specialtyOptions.sort());
}

// shorten bio info on cards
shorten_options = {
  namespace: "shorten",
  chars: 200,
  ellipses: "...",
  more: "",
  less: "less",
};

//shorten specialty info on cards
specialty_options = {
  namespace: "shorten",
  chars: 50,
  ellipses: "...",
  more: "",
  less: "less",
};

// parses doctors endpoint response data
function displayResponseData(response) {
  if (response.data.length == 0) {
    $(".js-search-results").html(
      `<div class="no-results">Sorry, there were no results.  Try expanding your search area.</div>`
    );
    getDataFromApi(specialty, user_location, range_clean, displayResponseData);
    return;
  }
  const results = response.data.map((item, index) => {
    return getDoctorHtmlString(normalizeResultData(item));
  });
  $(".js-search-results").html(results);
  $(".js-search-results").show();
  $.shorten.setDefaults();
  $(".bio").shorten(shorten_options);
  $(".card-specialty").shorten(specialty_options);
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
    insurance_accepted: getInsuranceAccepted(data),
  };
  return obj;
}

/**
 *
 * @param {object} data The data in the response from the api's /doctors endpoint.
 */
function getProfileFromDoctorData(data) {
  // assume each object has a .profile element
  let profileKeys = Object.keys(data.profile);
  let profile = {
    image_url: profileKeys.indexOf("image_url") ? data.profile.image_url : "",
    first_name: profileKeys.includes("first_name")
      ? data.profile.first_name
      : "",
    last_name: profileKeys.indexOf("last_name") ? data.profile.last_name : "",
    title: profileKeys.indexOf("title") ? data.profile.title : "",
    bio: data.profile.bio.length != 0 ? data.profile.bio : "No Bio Available",
  };
  return profile;
}

// format phone numbers
function formatPhoneNumber(phone_numbers) {
  phone_numbers.map((item) => {
    let practiceKeys = Object.keys(item);
    let numbers = {
      phone: item,
    };
    clean_number = ("" + numbers.phone.number).replace(/\D/g, "");
    var m = clean_number.match(/^(\d{3})(\d{3})(\d{4})$/);
    cleaned_number = !m ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
    phones.push({
      number: cleaned_number,
    });
    return practices;
  });
}

/**
 *
 * @param {object} data The data in the response from the api's /doctors endpoint.
 * @returns {array} Array of practices objects
 */
function getPracticesFromDoctorData(data) {
  // assume the response has a practices element and that it is an array
  practices = [];
  phones = [];
  data.practices.map((item) => {
    let practiceKeys = Object.keys(item);
    let practice = {
      name: practiceKeys.indexOf("name") ? item.name : "",
      visit_address: getPracticeVisitAddress(item),
      phones: getFormattedPhones(data),
      distance: practiceKeys.indexOf("distance") ? item.distance : 0,
      lat: practiceKeys.indexOf("lat") ? item.lat : "",
      lon: practiceKeys.indexOf("lon") ? item.lon : "",
    };
    practices.push(practice);
  });

  function getPracticeVisitAddress(practice) {
    // Again, assume, each practice has a 'visit_address' property
    let visitAddressKeys = Object.keys(practice.visit_address);
    return {
      street: visitAddressKeys.indexOf("street")
        ? practice.visit_address.street
        : "",
      street2: visitAddressKeys.includes("street2")
        ? practice.visit_address.street2
        : "",
      city: visitAddressKeys.includes("city")
        ? practice.visit_address.city
        : "",
      state: visitAddressKeys.indexOf("state")
        ? practice.visit_address.state
        : "",
      zip: visitAddressKeys.indexOf("zip") ? practice.visit_address.zip : "",
    };
  }
  return practices;
}

// get formatted phone numbers
function getFormattedPhones(data) {
  data.practices.map((item) => {
    let phoneKeys = Object.keys(item);
    let phone = {
      number: formatPhoneNumber(item.phones),
    };
  });
  return phones;
}

/**
 *
 * @param {object} data The data in the response from the api's /doctors endpoint.
 */
function getInsurancesFromDoctorData(data) {
  insurances = [];
  if (data.insurances == "undefined") {
    insurance_accepted.push("No insurance information available");
  } else {
    data.insurances.map((item) => {
      insuranceKeys = Object.keys(item);
      insurances.push({
        insurance_provider: insuranceKeys.indexOf("insurance_provider")
          ? item.insurance_provider
          : {
              name: "Unknown",
            },
      });
    });
  }
  return insurances;
}
/** @param {object} data The data in the response from the api's /doctors endpoint.
 * clean accepted insurance data response
 */
function getInsuranceAccepted(data) {
  insurance_accepted = [];
  for (var i = 0; i < data.insurances.length; i++) {
    insurance_accepted.push(data.insurances[i].insurance_provider.name);
    var unique_insurance_accepted = [];
    $.each(insurance_accepted, function (i, el) {
      if ($.inArray(el, unique_insurance_accepted) === -1)
        unique_insurance_accepted.push(el);
    });

    insurance_logos = [];
    logo = "";
  }
  insurance_logos = [];
  if (typeof unique_insurance_accepted == "undefined") {
    unique_insurance_accepted = [""];
  }
  // assign logos for elements in insurance reponse data array
  for (var i = 0; i < unique_insurance_accepted.length; i++) {
    switch (unique_insurance_accepted[i]) {
      case "Aetna":
        logo = "<img src='logos/aetna.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "Amerihealth":
        logo =
          "<img src='logos/amerihealth.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "BCBS":
        logo = "<img src='logos/bcbs.png' style='width: 25%; height: 25%;' />";
        break;
      case "Cigna":
        logo = "<img src='logos/cigna.png' style='width: 20%; height: 20%;' />";
        break;
      case "EmblemHealth":
        logo =
          "<img src='logos/emblemhealth.png' style='width: 25%; height: 25%;' />";
        break;
      case "Humana":
        logo =
          "<img src='logos/humana.png' style='width: 25%; height: 25%;' />";
        break;
      case "Medicaid":
        logo =
          "<img src='logos/medicaid.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "Medicare":
        logo =
          "<img src='logos/medicare.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "Multiplan":
        logo =
          "<img src='logos/multiplan.gif' style='width: 35%; height: 35%;' />";
        break;
      case "QualCare":
        logo =
          "<img src='logos/qualcare.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "United Healthcare":
        logo =
          "<img src='logos/united_healthcare.png' style='width: 25%; height: 25%;' />";
        break;
      case "Magnacare":
        logo =
          "<img src='logos/magnacare.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "VSP":
        logo = "<img src='logos/vsp.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "LA Care Health":
        logo =
          "<img src='logos/la_care.png' style='width: 15%; height: 15%;' />";
        break;
      case "HealthNet":
        logo =
          "<img src='logos/health_net.png' style='width: 25%; height: 25%;' />";
        break;
      case "Health Net":
        logo =
          "<img src='logos/health_net.png' style='width: 25%; height: 25%;' />";
        break;
      case "Western Health":
        logo =
          "<img src='logos/western_healt.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "Western Health Advantage":
        logo =
          "<img src='logos/western-health-advantage.png' style='width: 50%; height: 50%;' />";
        break;
      case "First Choice Health":
        logo =
          "<img src='logos/first-choice-health.jpg' style='width: 50%; height: 50%;' />";
        break;
      case "Providence Health  Services":
        logo =
          "<img src='logos/providence_health_services.jpeg' style='width: 50%; height: 50%;' />";
        break;
      case "Delta Dental":
        logo =
          "<img src='logos/delta_dental.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "Cambia Health Solutions":
        logo =
          "<img src='logos/cambia_health_solutions.png' style='width: 25%; height: 25%;' />";
        break;
      case "PacificSource Health Plans":
        logo =
          "<img src='logos/pacificsource_health.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "ODS Health Plan":
        logo =
          "<img src='logos/ODS_health.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "Kaiser Permanente":
        logo =
          "<img src='logos/kaiser_permanente.jpg' style='width: 25%; height: 25%;' />";
        break;
      case "":
        logo = "No insurance information available";
        break;
      default:
        logo = unique_insurance_accepted[i];
    }
    insurance_logos.push(logo);
  }
  return insurance_logos;
}

/**
 *
 * @param {object} data
 */
function getSpecialtiesFromDoctorData(data) {
  specialties = [];
  data.specialties.map((item) => {
    speacialtyKeys = Object.keys(item);
    specialties.push({
      name: speacialtyKeys.indexOf("name") ? item.description : "",
      description: speacialtyKeys.indexOf("description")
        ? item.description
        : "",
    });
  });
  return specialties;
}

/**
 *
 * @param {object} data
 */
function getLicensesFromDoctorData(data) {
  licenses = [];
  if (data.licenses.length != 0) {
    data.licenses.map((item) => {
      licenseKeys = Object.keys(item);
      licenses.push({
        state: licenseKeys.indexOf("state")
          ? item.state
          : "No License Info Available",
      });
    });
  } else {
    licenses.push({
      state: "No License Info Available",
    });
  }
  return licenses;
}

// display specialty response
function displaySpecialtyResponse(response) {
  generateSpecialtyOptionElement();
}

// compile doctor profile
function generateDoctorProfile() {
  practice_location = {};
  practice_name = "";

  $(".js-search-results").on("click", ".js-more", function (event) {
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
    openTab("Bio");
    // document.getElementById('Bio').focus();
    event.preventDefault();
    $(".js-profile").show();
    $("navbar-header").show();
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
    const doctor_distance = $(this).attr("doctor_distance");
    practice_lat = $(this).attr("practice_lat");
    practice_long = $(this).attr("practice_long");
    practice_location = {
      lat: parseFloat(practice_lat),
      lng: parseFloat(practice_long),
    };
    practice_name = $(this).attr("practice");
    displayDoctorProfile(
      image,
      firstname,
      lastname,
      title,
      practice,
      address,
      address2,
      contact,
      city,
      state,
      zip,
      profile_bio,
      profile_insurance,
      doctor_distance
    );
  });
}

// display doctor profile
function displayDoctorProfile(
  image,
  firstname,
  lastname,
  title,
  practice,
  address,
  address2,
  contact,
  city,
  state,
  zip,
  profile_bio,
  profile_insurance,
  doctor_distance
) {
  $(".js-profile-image").html(`<img class="img-circle" src="${image}"/>`);
  $(".js-profile-name").html(`${firstname} ${lastname}`);
  $(".js-profile-title").html(`${title}`);
  $(".js-profile-practice").html(`${practice}`);
  $(".js-practice-address").html(`${address}`);
  $(".js-practice-address2").html(`${address2}`);
  $(".js-practice-city").html(`${city}, `);
  $(".js-practice-state").html(`${state} `);
  $(".js-practice-zip").html(`${zip}`);
  $(".js-profile-contact").html(`${contact}`);
  $(".js-profile-bio").html(`${profile_bio}`);
  $(".js-profile-insurance").html(`${profile_insurance}`);
  $(".js-doctor-distance").html(`${doctor_distance}`);
}

// open modal tab
function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("profile-tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

// listen for form submission
function watchSubmit() {
  $(".js-search-form").submit((event) => {
    event.preventDefault();
    const specialty_target = $(event.currentTarget).find(".js-specialty");
    const specialty = specialty_target.val();
    const user_location = JSON.stringify(pos).replace(/[^0-9\-,.]/g, "");
    const range_target = $(event.currentTarget).find(".js-range");
    const range_target_value = range_target.val();
    const range = {
      user_location,
      range_target_value,
    };
    const range_clean = JSON.stringify(range).replace(/[^0-9\-,.]/g, "");
    $(".js-results-container").show();
    getDataFromApi(specialty, user_location, range_clean, displayResponseData);
    setTimeout($loading, 3000);
    var $loading = $(".loading").show();
    $("html,body").animate(
      {
        scrollTop: $(".js-results-container").offset().top,
      },
      "slow"
    );
  });
}
