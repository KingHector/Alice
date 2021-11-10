# Welcome

## Message On Join

The **Message On Join** plugin allows the bot to send a message on a specified channel when a user joins your server. It's config should look like this. If it's missing any lines be sure to add them.

```
"Message-On-Join":
{
    "Enabled": true,
    "Channel": "welcome",
    "Message": "Hey {user}, welcome to the server!"
}
```

**Channel** is the channel in which the bot will send the welcome message.
**Message** is the message the bot will send in the specified channel. 

## Private Message On Join 

The **Private Message On Join** plugin allows the bot to send a private message to every user that joins your server. It's config should look like this. If it's missing any lines be sure to add them.

```
"Private-Message-On-Join":
{
    "Enabled": true,
    "Message": "Hello {user}, we hope you have a great time on our server!"
}
```

**Message** is the message the bot will send to the user. 

## Give Role To New User

The **Give Role To New User** plugin allows the bot to give specified roles to every user that joins your server. It's config should look like this. If it's missing any lines be sure to add them.

```
"Give-Role-To-New-User": 
{
    "Enabled": true,
    "Roles": []
}
```

**Roles** is a list of roles that the bot will give the new users.

## Message On Leave

The **Message On Leave** plugin allows the bot to send a message on a specified channel when a user leaves your server. It's config should look like this. If it's missing any lines be sure to add them.

```
"Message-On-Leave": 
{
    "Enabled": true,
    "Channel": "goodbye",
    "Message": "**{user}** just left the server."
}
```

**Channel** is the channel in which the bot will send the leave message.
**Message** is the message the bot will send in the specified channel.