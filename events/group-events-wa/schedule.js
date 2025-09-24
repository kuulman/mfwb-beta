const fs = require('fs') // File system module

const now = new Date();
const day = (now.getDay() +1) % 7; // Get current day (0-6)
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const todayName = days[day] // Convert number to name (e.g. 1 => "Monday")
const hour = now.getHours(); // Get current hour (0-23)
const timerhour = 20; // Get current hour (0-23)

try {
    const data = JSON.parse(fs.readFileSync('./japel.json', 'utf-8')) // Read japel.json
    const today = data.japel8c[0][todayName]
    
    if (today && hour == 20) {
        const japelKey = Object.keys(today).find(k => k.includes('Japel'))
        console.log(`📅 Hari: ${todayName}`)
        console.log(`📚 Jadwal Pelajaran:\n${today[japelKey]}`)
    } else {
        console.log(`📅 Hari Ini: Pesan dijadwalkan dikirim pada ${timerhour}`)
        return
    }
} catch (err) {
    console.error('❌ Error reading japel.json:', err)
}
