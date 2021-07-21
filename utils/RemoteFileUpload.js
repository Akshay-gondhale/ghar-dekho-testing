const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const fs = require("fs");

const path = require("path");


// init google cloud storage
const GC_Storage = new Storage({
    keyFilename: path.join(__dirname + "/SERVICE_KEY.json")
});

const bucket = GC_Storage.bucket("ghardekho-c3029.appspot.com");

// function to delete cloud files
async function deleteFile(filePath) {
    try {
        await bucket.file(filePath).delete();
        console.log("deleted");
    }
    catch (e) {
        console.log("error occured while deleting")
        console.log(e)

    }
}

// function to upload files to cloud
async function uploadFile(localFilePath, DestinationFilePath) {
    try {
        await bucket.upload(localFilePath, { destination: DestinationFilePath })
        await fs.unlinkSync(localFilePath);
        console.log("file uploaded")

    }
    catch (e) {
        console.log("got error")
        console.log(e)

    }
}

// function to delete local files
async function deleteLocalFile(filePath) {
    try {
        await fs.unlinkSync(filePath);
        console.log("deleted")
    } catch (e) {
        console.log(e);
    }
}

module.exports = { deleteFile, uploadFile, deleteLocalFile };