const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const yup = require('yup');

const appRequest = request(app);

const bodySchema = yup.object({
    data: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        birthday: yup.date(),
        email: yup.string().email().required(),
        passwordHash: yup.string().required()
    }),
    tokens: yup.object({
        accessToken: yup.string().required(),
        refreshToken: yup.string().required()
    })
});

const getUser = () => (
    {
        firstName: 'Locki',
        lastName: 'Pot',
        birthday: '1990-02-02',
        email: `locki${Date.now()}@gmail.com`,
        password: 'super--secret-password123'
    }
)

const user = getUser();

describe('create new user', () => {
    test('user create successfully expect 201 created', async  () => {
        const response = await appRequest.post('/api/users/sign-up').send(user);
        expect(response.statusCode).toBe(201); // умова 1
        expect(bodySchema.isValidSync(response.body)).toBe(true); // умова 2
    });

    test('create empty user expect 400 bad request', async  () => {
        const response = await appRequest.post('/api/users/sign-up').send();
        expect(response.statusCode).toBe(400); // умова 1
        expect(bodySchema.isValidSync(response.body)).toBe(false); // умова 2
    });
});

afterAll(async () => {
    await mongoose.connection.close();
})