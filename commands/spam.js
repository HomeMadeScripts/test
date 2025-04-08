module.exports = {
    name: 'spam',
    description: 'Sends a message now and once more after a delay',
    /**
     * @param {Channel} channel 
     * @param {Message} message 
     * @param {Client} client 
     * @param {String[]} args 
     */
    execute(channel, message, client, args) {
        // Delete command message
        message.delete().catch(console.error);

        // Show help if no args
        if (args.length < 2) {
            const help = `**Usage:** \`${client.prefix}spam #channel delay_seconds message\`\n` +
                        `**Example:** \`!spam #general 30 hello\`\n` +
                        `Sends "hello" now and again after 30 seconds`;
            return message.channel.send(help).catch(console.error);
        }

        // Get target channel
        const targetChannel = message.mentions.channels.first();
        if (!targetChannel) {
            return message.channel.send("Please tag a valid channel first!").catch(console.error);
        }

        // Get delay
        const delay = parseInt(args[1]);
        if (isNaN(delay) || delay < 1 || delay > 300) {
            return message.channel.send("Delay must be between 1-300 seconds").catch(console.error);
        }

        // Get message
        const spamMessage = args.slice(2).join(' ') || "Spam!";

        // Send first message immediately
        targetChannel.send(spamMessage).catch(console.error);

        // Send confirmation
        message.channel.send(`✅ Will send to ${targetChannel} again in ${delay} seconds`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        }).catch(console.error);

        // Schedule single repeat
        setTimeout(() => {
            targetChannel.send(spamMessage).catch(console.error);
        }, delay * 1000);
    }
};