Michael Seltzer
Assignment 3
MMAP Server

Worked with Jackson Clawson and Dan Callahan 
Time spent: 5hrs

Implemented Features
- A POST /sendLocation API
	returns a JSON of all data entries (login, lat, lng, date)
	returns message on failure of sent params
	updates if username already exists
- A GET /location.json API
	returns data for user name specified
- / Home, the root, the index in HTML.
	shows list (most recent first) of all checkins	
