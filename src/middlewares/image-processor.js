import sharp from 'sharp'
import httpError from '../utils/httpError.js';

const imageProcessor = async (req, res, next) => {
    if (req.header('Content-Type') === undefined) {
        next();
    } else {
        const token = req.header('Content-Type').split("/")[0];
        if (token === "image") {
            try {
                let imageBuffer = Buffer.from([]);

                req.on("data", (chunk) => {
                    imageBuffer = Buffer.concat([imageBuffer, chunk]);
                });

                req.on("end", () => {
                    sharp(imageBuffer)
                        .toFormat('webp')
                        .toBuffer()
                        .then(outputBuffer => {
                            req.image = outputBuffer;
                            req.body = { image: true };
                            next();
                        })
                        .catch(err => {
                            next(new httpError(415, err.message));
                        });
                });
            } catch (err) {
                next(new httpError(500, err.message));
            }
        } else {
            next();
        }
    }
}

export default imageProcessor;