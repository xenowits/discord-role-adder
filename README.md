Steps:
1. Create a `config.json` file with the contents below:
```json
{
	"clientId": "123456789012345678",
	"guildId": "876543210987654321",
	"token": "your-token-goes-here"
}
```
2. clientId is present in the specific application in https://discord.com/developers/applications.
3. guildId can be copied by right clicking on the server icon.
4. token is generated on the discord developer portal for the bot.
5. Permissions are generated on developer portal, OAuth2 inside Settings. Mark `bot` and `applications.commands`.
6. Bot should have both Privileged Gateway Intents turned ON, namely, `Presence Intent` and `Server Members Intent`.
7. Replace `roleId` in `index.js` with your roleId copied from discord.

Data:
1. Add a file named `discord_handles.txt` which MUST consist of discord IDs (format: `794727464177096110`) each on a separate new line.

Considerations:
1. The program fetches all the members of a guild and caches it.
2. To add the bot to your server, `https://discordapp.com/api/oauth2/authorize?client_id=<CLIENT_ID>&permissions=8&scope=bot`