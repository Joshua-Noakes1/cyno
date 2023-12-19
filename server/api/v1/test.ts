import gcAPI from '~/assets/gigaclear/apiHandle';

export default defineEventHandler(async (event) => {
    return await gcAPI('a');
});