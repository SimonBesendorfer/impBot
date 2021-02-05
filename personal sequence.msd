#//# --------------------------------------------------------------------------------------
#//# Created using Sequence Diagram for Mac
#//# https://www.macsequencediagram.com
#//# https://itunes.apple.com/gb/app/sequence-diagram/id1195426709?mt=12
#//# --------------------------------------------------------------------------------------
title "imp Bot personal version"

participant "User"
participant "Application"

activate user
	activate Application

user->Application: addParticipant(name)

loop	
		Application->Application: check if nameconflict = true
end
 
alt [nameconclict = true]
		Application->User: error Meggage
else [nameconflict = flase]
	alt [array > 3]
		Application->User: show Participants and Option for shuffle
	else [array < 3]
		Application->user: show Participants
	end
end

note left of User
	"Option to add more Participants or to go on with shuffle() if array.length > 3"
end note

user->Application: shuffle()

Application->Application: randomize shuffled, set conflict = false
alt [nameconflict = true]
		Application->Application: shuffle()
else [nameconflict = false]
		Application->User: getImp(i) - shows result
end

user->Application: next(i)
alt [i < Array.length]
Application->user: shows next Array position
else [i = Array.length]
Application->user: shows finished message
end

deactivate Application
deactivate user

