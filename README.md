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
1. Add a file named `discord_handles.txt` which MUST consist of discord tags (format: `name#4355`) each on a separate new line.

Considerations:
1. The program fetches all the members of a guild and caches it.
2. This cache is later used to get the `discord ID` from the `discord tags`.
3. If we only have `discord ID`s as input, this could have a huge performance boost. Though, not much for smaller guild sizes