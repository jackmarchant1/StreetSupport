const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../index');
const Ambassador = require('../models/Ambassador');
const Organisation = require('../models/Organisation');

//Mock both models that are used, so whenever calls are made to these we are actually calling the mocks
jest.mock('../models/Ambassador');
jest.mock('../models/Organisation');

describe('AmbassadorController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAmbassador', () => {
        it('should create a new ambassador', async () => {
            // Mock request body
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
                organisationId: 'orgId',
                name: 'Test Ambassador'
            };

            // When Organisation.findById is called, will return this
            Organisation.findById.mockResolvedValue({
                _id: {
                    $oid: "orgId"
                },
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                },
                name: "test",
                website: "test.come"
            });

            // Mock bcrypt functions
            bcrypt.genSalt = jest.fn().mockResolvedValue('fake-salt');
            bcrypt.hash = jest.fn().mockResolvedValue('fake-hash');

            // Mock Ambassador model and save function
            const mockSavedAmbassador = {
                _id: 'fake-ambassador-id',
                ...reqBody,
                organisation: 'orgId',
            };
            Ambassador.mockReturnValue({ save: jest.fn().mockResolvedValue(mockSavedAmbassador) });//when save is called

            // Send request
            const res = await request(app)
                .post('/api/ambassador/create')
                .send(reqBody)
                .expect(201);

            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('orgId');
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'fake-salt');
            expect(Ambassador).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'fake-hash',
                organisation: 'orgId',
                name: 'Test Ambassador'
            });
            expect(Ambassador().save).toHaveBeenCalled();
            expect(res.body).toEqual(mockSavedAmbassador);
        });
    });

    describe('loginAmbassador', () => {
        // TODO: Write tests for loginAmbassador function
    });

    describe('logoutAmbassador', () => {
        // TODO: Write tests for logoutAmbassador function
    });

    describe('checkAuth', () => {
        // TODO: Write tests for checkAuth middleware
    });
});
