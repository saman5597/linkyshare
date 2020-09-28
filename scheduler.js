const fs = require('fs');
const File = require('./models/fileModel');
const connectDB = require('./config/db');

connectDB();

async function fetchData() {
    // Fetch 24hrs old files from DB
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = await File.find({ createdAt: { $lt: pastDate } });
    if (files.length) {
        for (const file of files) {
            try {
                // Delete all those files ony by one from Storage and DB
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Successfully deleted ${file.fileName}`);
            } catch (err) {
                console.log(`Error while deleting ${file.fileName} : ${err}`);
            }
        }
        console.log('Job Done!');
    }
}

fetchData().then(process.exit);