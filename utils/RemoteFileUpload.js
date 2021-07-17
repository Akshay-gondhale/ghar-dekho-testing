const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp")
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
    await bucket.file(filePath).delete();
    console.log("deleted");
}

// function to upload files to cloud
async function uploadFile(localFilePath, DestinationFilePath, filename) {
    sharp(localFilePath)
        .resize({ width: 500 })
        .rotate()
        .toFile('LocalStorage/sharp/' + filename, (err, info) => {
            if (!err) {
                const ModifiedLocalPath = path.join(__dirname , `../LocalStorage/sharp/${filename}`)
                
                bucket
                    .upload(ModifiedLocalPath, { destination: DestinationFilePath })
                    .then(async (res) => {
                        console.log("file uploaded")
                        // deleting files after successfull upload
                        try {
                            await fs.unlinkSync(localFilePath);
                            await fs.unlinkSync(ModifiedLocalPath);
                        } catch (e) {
                            console.log(e);
                        }
                    })
                    .catch(async (err) => {
                        console.log("some error occured while file upload")
                        try {
                            await fs.unlinkSync(localFilePath);
                            await fs.unlinkSync(ModifiedLocalPath);
                        } catch (e) {
                            console.log(e);
                        }
                        console.log("err", err);
                    });
            }
            else {
                console.log(err)
            }
        });

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