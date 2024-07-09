Handlers.add(
    "SAM.CRON",
    Handlers.utils.hasMatchingTag("Action","Cron"),
    function(msg)
        print(msg)
    end       
)
-- user handler to fetch data
Handlers.add(
    "getUserData",
    Handlers.utils.hasMatchingTag("Action","GetUserData"),
    function(msg)
        
    end
)
-- spawn cron process
