# MedMeister App

## Description

MedMeister is an application that allows users to quickly find doctors near them.  Users can search for doctors by specialty or insurance taken.  With MedMeister, the user has a breadth of information about doctors at their fingertips - from the doctor’s name, practice, specialty, the insurance companies the doctor works with and more.

## Pages
## Home
	User will be shown a map with the user’s location marked with a pin
	User will be shown a form with two dropdown fields where the user can search for doctors by specialty and/or 		insurance taken
	User’s searches will be stored with session keys

## Results
	Shows a map of doctors found given the user’s query
	Shows cards with brief information about doctors

## Profile
	Shows detailed doctor profile information

## Data
	Data will be stored in user sessions.   Will use SHA-2 + SALT to create a unique key for each session.

## Display Functions
	documentReady  - starts app
	watchSubmit - listens for user submission
	renderResult - displays results to user

## Data Manipulation Functions
	specialtySort - sorts results by specialty
	insuranceSort - sorts results by insurance
	initMap - initializes google maps
	displayResponseData - parses user response data
	getUserLocation - gets the user’s location
	getDataFromApi - gets data from the Better Docs api

## Future features
	User Accounts
	User Comments
	User Ratings
	Show claims information for each doctor
	Share Doctors with others via email or social media
	Allow users to save searches

