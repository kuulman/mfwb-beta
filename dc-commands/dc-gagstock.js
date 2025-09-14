const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const {getEggOutput, getGearOutput, getSeedOutput} = require('../api/GAGapi.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gagstock')
    .setDescription('Check Bot Information'),
  async execute(interaction) {
    try {
        const embed = new EmbedBuilder()
        .setColor(0x51ff00)
        .setTitle('Grow a Garden Stock')
        .addFields(
          {
            name: "Seeds Stock",
            value: `${await getSeedOutput()}`,
            inline: false
          },
          {
            name: "Eggs Stock",
            value: `${await getEggOutput()}`,
            inline: false
          },
          {
            name: "Gear Stock",
            value: `${await getGearOutput()}`,
            inline: false
          }
        )
        .setFooter({ text: '© Copyright InfoGAG. All rights reserved.' });
      await interaction.reply({embeds: [embed]});
    } catch (error) {
      console.error('Error fetching stock information:', error);
      await interaction.reply('An error occurred while fetching the stock information. Error code: ' + error);
    }
  },
};