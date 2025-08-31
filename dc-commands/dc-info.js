const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Check Bot Information'),
  async execute(interaction) {
    try {
      // Try different path approaches
      const imagePath = path.join(__dirname, '//Thumbnail.png'); // Same directory as command file
      // Alternative: path.join(__dirname, '../assets/Thumbnail.png'); // Assets folder
      // Alternative: path.join(process.cwd(), 'Thumbnail.png'); // Root directory
      
      const embed = new EmbedBuilder()
          .setColor(0x51ff00)
          .setTitle('Bot Information')
          .addFields(
            {
              name: "*Codename: MFWB*",
              value: `*Version: 1620dp (Developer Preview)*

**Changes:**
• Optimizing Bot Response
• Changes All Bot Triggers
• Rewrite Bot Code`,
              inline: false
            }
          )
          .setImage('attachment://Thumbnail.png')
          .setFooter({ text: '© Copyright InfoGAG. All rights reserved.' });

      // Create attachment for the thumbnail
      const attachment = new AttachmentBuilder('./Thumbnail.png', { name: 'Thumbnail.png' });

      await interaction.reply({
        embeds: [embed],
        files: [attachment]
      });
    } catch (error) {
      console.error('Error with image attachment:', error);
      
      // Fallback embed without image
      const embed = new EmbedBuilder()
          .setColor(0x51ff00)
          .setTitle('Bot Information')
          .addFields(
            {
              name: "*Codename: MFWB*",
              value: `*Version: 1620dp (Developer Preview)*

**Changes:**
• Optimizing Bot Response
• Changes All Bot Triggers
• Rewrite Bot Code`,
              inline: false
            }
          )
          .setFooter({ text: '© Copyright InfoGAG. All rights reserved.' });
      
      await interaction.reply({embeds: [embed]});
    }
  },
};