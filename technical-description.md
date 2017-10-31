# MedMeister App

## Description

MedMeister is an application that allows users to quickly find doctors near them.  Users can search for doctors by specialty and insurance taken - specifying a radius in miles from their location.  With MedMeister, the user has a breadth of information about doctors at their fingertips - from the doctor’s name, practice, specialty, the insurance the doctor accepts and more.

## Pages
### Home
	º user will be shown a form with three dropdown fields where the user can search for doctors by specialty, insurance 	       accepted, and the radius, respectively

### Results
	º Shows cards with brief information about doctors
		• doctor's name, title, image (if available), practice, synopsis of specialty details and distance from the 		      user
		• is shown on the front of the card.  Cards will flip to reveal their backs as the user hovers over them 
		• the back of the card reveals the state the doctor is licensed in and a synopsis of the doctor's bio

### Profile Modal
	º Shows detailed doctor profile information
		• left info pane of the modal shows the doctor's name, title, practice, practice address, and phone number
		º the top navigation inside the modal shows three tabs, Bio (default tab), insurance accepted, and map
			• the "Bio" tab shows the doctor's full bio
			• the "Insurance Taken" tab show logos of the insurance companies the doctor accepts
			• the "Map" tab shows a map with a marker for the user's current location and a marker for the
			  doctor's practice location

## Data
	º Since the user may be in different locations and use different options each time they use the app, there is 		  no data storage beyond DOM objects.
	
## API Request Functions
	º getDataFromApi
		• Arguments (callback)
		• Endpoint (/doctors)
		
	º getSpecialties
		• Arguments (callback)
		• Endpoint (/specialties)
		
	º getInsurances
		• Arguments (callback)
		• Endpoint (/insurances)
		

## Display Functions
	º $(document).ready  - starts app when document ready
	
	º watchSubmit - listens for user submission
	
	º displayResponseData - displays doctor results to user
		• Arguments: (response)
		
	º displayDoctorProfile  - renders doctor profile to user
		• Arguments: (image, firstname, lastname, title, practice,
            		     address, address2, contact, city, state, zip, 
			     profile_bio, profile_insurance)
			     
	º displaySpecialtyResponse - renders specialty dropdown
		Arguments: (response)
		
	º displayInsurancesResponse - renders insurances dropdown
		Arguments: (response)
		
	

## Data Manipulation Functions
	º initMap - initializes google maps
		• Arguments: (practice_location, practice_name)
		
	º getPracticesFromDoctorData - sanitizes practice information received from getDataFromApi function API request
		• Arguments: (data)
		
	º getPracticeVisitAddress - sanitizes practice visit address received from getDataFromApi function API request
		• Arguments: (practice)
		
	º getInsurancesFromDoctorData - sanitizes accepted insurance data received from API request
		• Arguments: (data)
		
	º getInsuranceAccepted - maps logos to sanitized accepted insurance data
		• Arguments: (data)
		
	º getSpecialtiesFromDoctorData - sanitizes specialty information received from API request
		• Arguments: (data)
		
	º getLicensesFromDoctorData - sanitizes licenses information received from API request
		• Arguments: (data)
		
	º normalizeResultData - normalizes API response data
		• Arguments: (data)
		
	º generateInsuranceOptionElement - creates insurance option element for insurances dropdown
		• Arguments: (result)
		
	º generateSpecialtyOptionElement - creates specialty option element for specialties dropdown
		• Arguments: (result)
		
	º generateDoctorProfile - generates doctor profile data to be displayed to the user
		• No arguments taken
		
	º openTab - controls modal tabs
		• Arguments: (tabName)
		
	º getProfileFromDoctorData - sanitizes doctor api response data
		• Arguments: (data)
		
	º formatPhoneNumber - formats the practice phone number received from getDataFromApi function API request
		• Arguments: (phone_numbers)
		
	

## Future features
	º User Accounts
	º Ratings
	º Response pagination or load more on scroll
	º User Comments
	º Doctor's education tab in profile
	º Directions from user's location to doctor's practice address
	º Allow user to make appointments with doctors
	º User Ratings
	º Show claims information for each doctor
	º Share Doctors with others via email or social media
	º Allow users to save searches
