<span>Hi Home</span>
<div>
    you create a new user, said user has no guilds, 
    and is unable to do shit user either has to be added 
    to an existing guild via 
    POST /guilds/guild_id/members 
    or a new guild must be created via 
    POST /guilds 
    (the member is added to the created guild as owner)
    then, in the guild, you have to have at least one channel,
    create it by 
    POST guilds/guild_id/channels 
    then you can send a message by doing 
    POST /channels/channel_id/messages
</div>