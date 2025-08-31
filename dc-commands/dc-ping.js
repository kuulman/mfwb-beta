const { Client: dcClient, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cek ping bot'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Menghitung ping...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong!\n🔁 Roundtrip latency: ${roundtrip}ms`);
    console.log(`Ping command executed: ${roundtrip}ms`);
  },
};
