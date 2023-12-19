module.exports = {
  run: async function ({
    sendmessage,
    args,
    event,
    api,
    prefix,
    config,
    approvedID,
  }) {
    const input = event.body.trim();

    handleCommandWithPrefix(fontbold);

    handleCommandWithoutPrefix(fontbold);

    function handleCommandWithPrefix(fontbold) {
      const parts = input.slice(prefix.length).split(" ");
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1);
      const user = event.senderID;

      const command = commands[commandName];
      if (event.body.startsWith(prefix)) {
        if (command) {
          if (
            config.maintenance.enable &&
            !config.botAdmin.includes(event.senderID)
          ) {
            api.sendMessage(
              "The BOT is Under Maintenance.\nTo Serve You Better\n Sorry for the inconvenience.",
              event.threadID
            );
            return false;
          }
          const userPermission = config.botAdmin.includes(user) ? 1 : 0;
          if (!command.config.usePrefix && event.body.startsWith(prefix)) {
            api.sendMessage(
              "This Command didn't need a prefix",
              event.threadID,
              event.messageID
            );
            return false;
          }
          if (userPermission >= command.config.permission) {
            command.run({
              sendmessage,
              api,
              event,
              args,
              commandModules: commands,
              config,
              approvedID,
              fontbold,
              prefix,
            });
          } else {
            api.sendMessage(
              "You do not have permission to use this command.",
              event.threadID
            );
          }
        } else {
          api.sendMessage("Invalid command.", event.threadID);
        }
      }
    }

    function handleCommandWithoutPrefix(fontbold) {
      const input = event.body.trim();
      if (
        config.maintenance.enable &&
        !config.botAdmin.includes(event.senderID)
      ) {
        api.sendMessage(
          "The BOT is Under Maintenance.\nTo Serve You Better\n Sorry for the inconvenience.",
          event.threadID
        );
        return;
      }

      const parts = input.split(" ");
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1);
      const user = event.senderID;

      const command = commands[commandName];

      if (command) {
        const userPermission = config.botAdmin.includes(user) ? 1 : 0;
        if (command.config.usePrefix) {
          api.sendMessage(
            "This Command need a prefix",
            event.threadID,
            event.messageID
          );
          return false;
        }
        if (userPermission >= command.config.permission) {
          command.run({ api, event, args, config, approvedID, fontbold });
        } else {
          api.sendMessage(
            "You do not have permission to use this command.",
            event.threadID
          );
        }
      }
    }
  },
};
