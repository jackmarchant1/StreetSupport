const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../index');
const Ambassador = require('../models/Ambassador');
const Organisation = require('../models/Organisation');
const Member = require('../models/Member')
const ambassadorController = require('../controllers/AmbassadorController')

//Mock both models that are used, so whenever calls are made to these we are actually calling the mocks
jest.mock('../models/Ambassador');
jest.mock('../models/Organisation');
jest.mock('../models/Member')

describe('AmbassadorController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAmbassador', () => {
        it('should create a new ambassador if credentials are valid', async () => {
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

        it('should fail if organisation is not valid', async () => {
            // Mock request body
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
                organisationId: 'non-existent-orgId',
                name: 'Test Ambassador'
            };

            // When organisation does not exist
            Organisation.findById.mockResolvedValue(null);

            // Send request
            const res = await request(app)
                .post('/api/ambassador/create')
                .send(reqBody)
                .expect(401);

            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('non-existent-orgId');
            expect(res.body).toEqual({ message: 'Organisation not found' });
        });

        it('should fail if required field are not present', async () => {
            // Mock request body
            const reqBody = {
                //Omitted required email field
                password: 'password123',
                organisationId: 'orgId',
                name: 'Test Ambassador'
            };

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
            Ambassador.mockReturnValue({
                save: jest.fn().mockRejectedValue(new Error('Validation failed: Email is required')) //this should just throw error
            });
            // Send request
            const res = await request(app)
                .post('/api/ambassador/create')
                .send(reqBody)
                .expect(500);

            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('orgId');
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'fake-salt');
            expect(Ambassador).toHaveBeenCalledWith({
                password: 'fake-hash',
                organisation: 'orgId',
                name: 'Test Ambassador'
            });
            expect(Ambassador().save).toHaveBeenCalled();
            expect(res.body).toEqual({message: "Error creating new ambassador"});
        });

    });

    describe('loginAmbassador', () => {
        it('should login ambassador when credentials are valid', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
            }

            const returnAmbassador = {
                _id: 'fake-ambassador-id',
                email: 'test@example.com',
                password: 'encryptedPassword',
                name: 'name',
                organisation: 'orgId',
                _doc: { //this is because of how the copying works in the function
                    _id: 'fake-ambassador-id',
                    ...reqBody,
                    name: 'name',
                    organisation: 'orgId',
                }
            }

            const ambassadorOrg = {
                _id: {
                    $oid: "orgId"
                },
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                },
                name: "test",
                website: "test.come"
            }

            const expectedAmbassador = {
                _id: 'fake-ambassador-id',
                email: 'test@example.com', //removes password
                name: 'name',
                organisation: ambassadorOrg,
            };

            //Mock setup
            Ambassador.findOne.mockResolvedValue(returnAmbassador);

            bcrypt.compare = jest.fn().mockResolvedValue(true);

            Organisation.findById.mockResolvedValue(ambassadorOrg);

            // Send request
            const res = await request(app)
                .post('/api/ambassador/login')
                .send(reqBody)
                .expect(200);

            // Assertions
            expect(Ambassador.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'encryptedPassword');
            expect(Organisation.findById).toHaveBeenCalledWith('orgId');
            expect(res.body).toEqual({isAuthenticated: true, ambassador: expectedAmbassador, message: "Log in success"});
        });

        it('should throw error when password does not match', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
            }

            const returnAmbassador = {
                _id: 'fake-ambassador-id',
                email: 'test@example.com',
                password: 'encryptedPassword',
                name: 'name',
                organisation: 'orgId',
                _doc: { //this is because of how the copying works in the function
                    _id: 'fake-ambassador-id',
                    email: 'test@example.com',
                    password: 'encryptedPassword',
                    name: 'name',
                    organisation: 'orgId',
                }
            }

            //Mock setup
            Ambassador.findOne.mockResolvedValue(returnAmbassador);

            bcrypt.compare = jest.fn().mockResolvedValue(false); //passwords dont match

            // Send request
            const res = await request(app)
                .post('/api/ambassador/login')
                .send(reqBody)
                .expect(401);

            // Assertions
            expect(Ambassador.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'encryptedPassword');
            expect(res.body).toEqual({isAuthenticated: false, message: "Password is incorrect"});
        });

        it('should throw error when ambassador does not exist', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
            }

            //Mock setup
            Ambassador.findOne.mockResolvedValue(null);

            // Send request
            const res = await request(app)
                .post('/api/ambassador/login')
                .send(reqBody)
                .expect(401);

            // Assertions
            expect(Ambassador.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
            expect(res.body).toEqual({isAuthenticated: false, message: "Ambassador with that email does not exist"});
        });

        it('should throw error when organisation does not exist', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
            }

            const returnAmbassador = {
                _id: 'fake-ambassador-id',
                email: 'test@example.com',
                password: 'encryptedPassword',
                name: 'name',
                organisation: 'orgId',
                _doc: { //this is because of how the copying works in the function
                    _id: 'fake-ambassador-id',
                    email: 'test@example.com',
                    password: 'encryptedPassword',
                    name: 'name',
                    organisation: 'orgId',
                }
            }

            //Mock setup
            Ambassador.findOne.mockResolvedValue(returnAmbassador);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            Organisation.findById.mockResolvedValue(null);

            // Send request
            const res = await request(app)
                .post('/api/ambassador/login')
                .send(reqBody)
                .expect(401);

            // Assertions
            expect(Ambassador.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'encryptedPassword');
            expect(Organisation.findById).toHaveBeenCalledWith('orgId');
            expect(res.body).toEqual({isAuthenticated: false, message: "Organisation does not exist"});
        });

        it('should throw error when there has been a server error', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
            }

            //Mock setup
            Ambassador.findOne.mockRejectedValue(new Error("Server error"));

            // Send request
            const res = await request(app)
                .post('/api/ambassador/login')
                .send(reqBody)
                .expect(500);

            // Assertions
            expect(Ambassador.findOne).toHaveBeenCalledWith({email: 'test@example.com'});
            expect(res.body).toEqual({ isAuthenticated: false, message: 'Server error during login.' });
        });
    });

    describe('logoutAmbassador', () => {
        it('should successfully log out the user', async () => {
            const response = await request(app)
                .post('/api/ambassador/logout')
                .expect(200);

            expect(response.body).toEqual({
                isAuthenticated: false,
                message: "Log out success"
            });
        });
    });

    describe('suspendMember', () => {

        it('should suspend a given member successfully', async () => {
            const mockSuspendedMember = { _id: 'mockedMemberId', is_suspended: true }
            Member.suspendMember.mockResolvedValueOnce(mockSuspendedMember);

            const mockRequestBody = {
                memberId: 'mockedMemberId',
            };

            const res = await request(app)
                .post('/api/ambassador/suspendMember')
                .send(mockRequestBody)
                .expect(200);

            expect(Member.suspendMember).toHaveBeenCalledWith('mockedMemberId');
            expect(res.body).toEqual({message:'Member suspended successfully', suspendedMember: mockSuspendedMember});
        });

        it('should handle errors when suspending a member', async () => {

            Member.suspendMember.mockRejectedValueOnce(new Error('Mocked error'));

            const mockRequestBody = {
                memberId: 'mockedMemberId',
            };

            const res = await request(app)
                .post('/api/ambassador/suspendMember')
                .send(mockRequestBody)
                .expect(500);

            expect(res.body).toEqual({error: 'Internal server error'});
            expect(Member.suspendMember).toHaveBeenCalledWith('mockedMemberId');
        });
    });


    describe('deleteMember', () => {
        it('should delete a given member successfully', async () => {
            const mockDeletedMember = { _id: 'mockedMemberId' }
            Member.deleteMember.mockResolvedValue(mockDeletedMember);
            const mockRequestBody = {
                memberId: 'mockedMemberId',
            };

            const res = await request(app)
                .post('/api/ambassador/deleteMember')
                .send(mockRequestBody)
                .expect(200)

            expect(res.body).toEqual({message: 'Member deleted successfully', deletedMember: mockDeletedMember});
        });

        it('should handle errors when deleting a member', async() => {
            Member.deleteMember.mockRejectedValueOnce(new Error('Mocked error'));
            const mockRequestBody = {
                memberId: 'mockedMemberId',
            };

            const res = await request(app)
                .post('/api/ambassador/deleteMember')
                .send(mockRequestBody)
                .expect(500)

            expect(res.body).toEqual({error: 'Internal server error'});
        });
    });

    describe('checkAuth', () => {
        it('should call next() if user is authenticated', () => {
            const req  = {session: {
                    userId: 'fake-ambassador-id',
                }};
            const next = jest.fn();
            const res = {};
            ambassadorController.checkAuth(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('should call return 401 if user is not authenticated', () => {
            const req  = {session: {}};
            const next = jest.fn();
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            ambassadorController.checkAuth(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });
    });
});
