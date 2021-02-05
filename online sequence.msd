#//# --------------------------------------------------------------------------------------
#//# Created using Sequence Diagram for Mac
#//# https://www.macsequencediagram.com
#//# https://itunes.apple.com/gb/app/sequence-diagram/id1195426709?mt=12
#//# --------------------------------------------------------------------------------------
participant User
participant Application
participant Server

activate user
activate Application

user -> Application: start impBot online version
Application -> User: returns individual generated URL (ending with Unix Timestamp)

note left of User
"option to copy URL in Clipbord and send to other participants" 
end note

user -> application: click on "weiter" buton and get to generated URL

activate server

application -> server: loadJSONFromServer()
server -> application: JSON

deactivate server

application -> application: impData = JSON.parse(result)

loop
alt [URL_ID = impData[i]ID]
	Application->application: show Array Data on screen
	alt [Data is already shufled]
	Application -> User: Show display with all Participants and ask for Name and Passwort
	else [Data is not shuffled]
	Application->user: Option to add more participants or option to shuffle
	end
else [URL_ID != impData[i]ID]
	Application->Application: add ID to impData Array
	Application->User: option to add Participant
end
end

deactivate user
deactivate application
activate user
activate application

note left of User
"Adding a new Participant"
end note

user->application: enter name and passwort and click on "hinzufügen"

loop
alt [name = impData[i]name]
Application -> User: Shows Message: Name already used, prease change
else [name != impData[i]name]
Application -> Application: Adding name to Array

activate server
Application -> server: saveJSONToServer()
server -> application: resolve: responseText
deactivate server

alt [array.length > 3]
application -> user: Message: Option to ad another participant or option to shuffle Array
else [arraylength < 3]
application -> user: Message: Option to ad another participant
end
end
end

deactivate user
deactivate application
activate user
activate application

note left of user
"start to shuffle"
end note

user -> application: shuffle()
application -> user: are you shure?
alt [confirmation]
user -> Application: confirm: yes
application -> application: shuffle Array positon impData[ID]shuffled
activate server
application -> server: saveJSONToServer()
server -> application: resolve: responseText
deactivate server

else [confirmation denined]
user -> application: comfirm: no
application -> user: shows previous Display
end

deactivate user
deactivate application
activate user
activate application

note left of user
"get individual Participant Data, when you come back to personal URL after shuffeling"
end note

user -> application: entered username and password

loop [check if user enterd correct passwort]
alt [password correct]
application->user: shows individual result
else [password incorrect]
application->user: shows message: wrong password
end
end

deactivate user
deactivate application
activate user
activate application

note left of user
"after you get your personal result, you have the option to go back to start"
end note

user->application: go back to start
application -> application: splice impData and remove array positions with IDs (unix timestamp) older than x days (30 days)

activate server
application -> server: saveJSONToServer()
server->application: resolve: responseText
deactivate server
application->user: shows start display