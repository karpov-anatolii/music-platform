const uuid = require("uuid"); //для генерации уникальных id
const path = require("path");
const sharp = require("sharp");
const fs = require("fs/promises");

function imageSaver(
  img,
  folderBig,
  sizeBig = 600,
  folderSmall,
  sizeSmall = 250
) {
  let tmpPathName = img.tempFilePath;
  let fileName = uuid.v4() + ".jpg";
  let filePathName = path.resolve(
    __dirname,
    "..",
    "static",
    folderBig,
    fileName
  );

  img.mv(tmpPathName, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    sharp(tmpPathName)
      .metadata()
      .then((metadata) => {
        sharp(tmpPathName)
          .resize({
            width: parseInt((sizeBig * metadata.width) / metadata.height),
            height: sizeBig,
          })
          .toFile(filePathName)
          .then(() => {
            if (folderSmall) {
              let thumbFilePathName = path.resolve(
                __dirname,
                "..",
                "static",
                folderBig,
                folderSmall,
                fileName
              );
              sharp(tmpPathName)
                .resize({
                  width: parseInt(
                    (sizeSmall * metadata.width) / metadata.height
                  ),
                  height: sizeSmall,
                })
                .toFile(thumbFilePathName)
                .then(() =>
                  fs.unlink(tmpPathName).catch((er) => console.log(er))
                );
            } else {
              fs.unlink(tmpPathName).catch((er) => console.log(er));
            }
          });
      });
  });
  return fileName;
}

module.exports = { imageSaver };
