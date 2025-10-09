const { YoutubeTranscript } = require('youtube-transcript')
const OpenAI = require("openai")

 module.exports = {
    name: 'rks',
    description: 'Meringkas YT',
    usage: '.rks [link]',

    async execute(waClient, message, MessageMedia, dcClient) {
        const link = message.body.slice(9).trim();

        const openai = new OpenAI({
          apiKey: process.env.OPEN_API_KEY
        })

        async function summarizeYouTube(url) {
          try {
            const transcript = await YoutubeTranscript.fetchTranscript(url)
        
            // gabungkan jadi 1 string
            const text = transcript.map(t => t.text).join(" ")
        
            console.log("Transcript diambil, panjang:", text.length)
        
            const summary = await openai.chat.completions.create({
              model: "gpt-4o-mini", 
              messages: [
                { role: "system", content: "Ringkas video ini menjadi poin-poin penting." },
                { role: "user", content: text }
              ],
              max_tokens: 500
            })
        
            return summary.choices[0].message.content
          } catch (err) {
            console.error("Error:", err)
          }
        }

        summarizeYouTube(link)
          .then(res => console.log("Ringkasan:\n", res))
    }
}