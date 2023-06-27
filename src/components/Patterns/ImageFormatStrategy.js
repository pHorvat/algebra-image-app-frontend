import * as imageConversion from "image-conversion";

export class ImageFormatStrategy {
    constructor(format) {
        this.format = format;
    }

    async execute(file) {
        const formattedImage = await this.changeImageFormat(file);
        return formattedImage;
    }

    async changeImageFormat(file) {
        console.log("Using default format")

        return await imageConversion.compress(file, {
            quality: 0.8,
        });
    }
}

export class JPEGImageFormatStrategy extends ImageFormatStrategy {
    constructor() {
        super('jpeg');
    }

    async changeImageFormat(file) {
        console.log("Using JPEG format")

        return await imageConversion.compress(file, {
            quality: 0.8,
            type: "image/jpeg",
        });
    }
}

export class PNGImageFormatStrategy extends ImageFormatStrategy {
    constructor() {
        super('png');
    }

    async changeImageFormat(file) {
        console.log("Using PNG format")
         async function convertImageToBlob(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const image = new Image();
                    image.onload = function () {
                        const canvas = document.createElement("canvas");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        const context = canvas.getContext("2d");
                        context.drawImage(image, 0, 0, image.width, image.height);
                        canvas.toBlob(function (blob) {
                            resolve(blob);
                        }, "image/png");
                    };
                    image.onerror = function (error) {
                        reject(error);
                    };
                    image.src = event.target.result;
                };
                reader.onerror = function (error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }

        const image = await convertImageToBlob(file)
            .then(function (blob) {
                // Use the resulting blob here
                console.log(blob);
                return blob;
            })
            .catch(function (error) {
                // Handle any errors that occur during the conversion process
                console.error(error);
            });

        return image;



    }
}