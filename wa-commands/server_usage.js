const os = require('os'); // Import os module for system information

module.exports = {
    name: 'server_usage',
    description: 'Menampilkan usage bot',
    usage: '.server_usage',
    
    async execute(waClient, message) {
        try {
            // Check server usage
            // Ram Usage
            const UsedMemory = os.totalmem() - os.freemem(); // Get used memory 
            const UsedMemoryGB = (UsedMemory / (1024 * 1024 * 1024)).toFixed(2); // Convert to GB
            const memoryPercentage = ((UsedMemory / os.totalmem()) * 100).toFixed(2); // Calculate memory usage percentage
            // CPU Usage
            function getCPUUsageAsync() {
                return new Promise(resolve => {
                const startMeasure = process.cpuUsage();
                const startTime = Date.now();

                setTimeout(() => {
                    const endMeasure = process.cpuUsage(startMeasure);
                    const endTime = Date.now();
                
                    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
                    const totalCPUTime = (endMeasure.user + endMeasure.system) / 1000000; // Convert to seconds
                
                    // Calculate percentage (single core)
                    let cpuPercentage = (totalCPUTime / elapsedTime) * 100;
                
                    // Ensure the percentage doesn't exceed 100%
                    cpuPercentage = Math.min(cpuPercentage, 100);
                
                    resolve(cpuPercentage.toFixed(2));
                    }, 1000);
                });
            }
            const cpuUsage = await getCPUUsageAsync(); // Call CPU Usage Function
            const ramUsage = `*RAM Usage:* ${UsedMemoryGB} GB / ${memoryPercentage}%`; // Call RAM Usage Function
            const server_usageMessage = `📊 Server CPU and RAM Usage 
            
${ramUsage} (All memory usage in server. Include from OS) 
*CPU Usage:* ${cpuUsage}% (This bot CPU usage)`;
            await message.reply(server_usageMessage);
            console.log(server_usageMessage)
        } catch (error) {
            console.error('Error executing .server_usage command:', error);
            await message.reply('❌ Error executing .server_usage command');
        }
    }
}