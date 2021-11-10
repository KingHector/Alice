# Moderation

## Discord Moderation

The **Discrod Moderation** plugin enables the moderation commands that can be found below. It's config should look like this. If it's missing any lines be sure to add them.

```
"Discord-Moderation":
{
    "enabled": true
}
```

### Commands 

- !help `Shows a list of all commands and their description.`
- !ping `Show the latency in milliseconds.`
- !ban &lt;user&gt; &lt;reason&gt; `Bans any user from your server. Reason is optional.`
- !kick &lt;user&gt; &lt;reason&gt; `Kicks any user from your server. Reason is optional.`
- !mute &lt;user&gt; &lt;reason&gt; `Mutes any user in your server. Reason is optional.`
- !unmute &lt;user&gt; `Unmutes any muted user from your server.`
- !warn &lt;user&gt; &lt;reason&gt; `Warns any user in your server.`
- !inquire &lt;user&gt; `Shows all the punishments a user has received.`
- !case &lt;caseNumber&gt; `Shows the punishment case specified.`
- !clear &lt;amount&gt; `Clear up to 100 messages.`