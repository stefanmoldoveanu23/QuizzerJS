import fs from 'fs';
import prisma from '../../client.js';
import logger from './logger.js';

const deleteImages = async () => {
    fs.readdir('./public/images/questions', async (err, files) => {
        if (err) {
            logger.error(err);
        } else {
            const ids = files.map(file => parseInt(file.split('.')[0]));

            const exist = (await prisma.question.findMany()).map(question => question.id);

            ids.filter(id => !exist.includes(id)).forEach(id => {
                fs.rm(`./public/images/questions/${id}.webp`, (_err) => { });
            });

        }
    });
}

export default deleteImages;