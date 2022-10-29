import { Events } from 'discord.js';
import { debug, verbose } from '../config/out.js';
import Event from '../Event.js';

/**
 * Handler for interactionCreate event
 */
class InteractionCreate extends Event {
    /**
     * @param {Client} client The Discord Client that will handle this interaction
     * @param {String} name The name of this interaction
     */
    constructor(client, name = Events.InteractionCreate) {
        super(client, name);
    }

    /**
     * Looks up the interaction from the interaction's client and runs it.
     * @param {Interaction} interaction The interaction whose creation triggered this event
     */
    async run(interaction) {
        if (interaction.isChatInputCommand()) { // slash commands
            const { commandName } = interaction;
            const command = interaction.client.getSlashCommand(commandName);

            verbose(`${interaction.user.tag} ran slash command: ${commandName}`);
            debug(`Slash command '${commandName}' options:`);
            debug(interaction.options.data);

            await command.run(interaction);
        } else if (interaction.isContextMenuCommand()) { // context menu commands
            const { commandName } = interaction;
            const command = interaction.client.getContextMenuCommand(commandName);

            verbose(`${interaction.user.tag} ran context menu command: ${commandName}`);
            debug(`Context menu '${commandName}' member:`);
            debug(interaction.member);
            debug(`Context menu '${commandName}' target:`);
            debug(interaction.targetMember ?? interaction.targetMessage);

            await command.run(interaction);
        } else if (interaction.isButton()) { // buttons
            const { customId } = interaction;
            const button = interaction.client.getButton(customId);

            verbose(`${interaction.user.tag} ran button: ${customId}`);

            await button.run(interaction);
        } else if (interaction.isSelectMenu()) { // select menus
            const { customId } = interaction;
            const selectMenu = interaction.client.getSelectMenu(customId);

            verbose(`${interaction.user.tag} ran select menu: ${customId}`);
            debug(`Select menu '${customId}' values:`);
            debug(interaction.values);

            await selectMenu.run(interaction);
        } else if (interaction.isModalSubmit()) { // modals
            const { customId } = interaction;
            const modal = interaction.client.getModal(customId);

            verbose(`${interaction.user.tag} ran modal submit: ${customId}`);
            debug(`Modal '${customId}' values:`);
            debug(interaction.fields.fields);

            await modal.run(interaction);
        } else if (interaction.isAutocomplete()) { // autocomplete
            const { commandName } = interaction;
            const command = interaction.client.getSlashCommand(commandName);

            verbose(`${interaction.user.tag} ran autocomplete for command ${commandName}: ${interaction.options.getFocused()}`);

            command.autocomplete(interaction);
        }
    }
}

export default InteractionCreate;
