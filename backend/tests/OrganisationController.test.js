const request = require('supertest');
const app = require('../index');
const Organisation = require('../models/Organisation');
const Member = require('../models/Member');

//Mock both models that are used, so whenever calls are made to these we are actually calling the mocks
jest.mock('../models/Ambassador');
jest.mock('../models/Organisation');
jest.mock('../models/Member');

describe('OrganisationController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createMember', () => {
        it('should create a new member if all credentials are valid', async () => {
            const reqBody = {
                first_name: 'test fn',
                last_name: 'test ln',
                orgId: 'orgId',
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                }
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

            const mockSavedMember = {
                _id: 'fake-member-id',
                first_name: 'test fn',
                last_name: 'test ln',
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                },
                organisation: 'fake-org-id'
            };
            Member.mockReturnValue({ save: jest.fn().mockResolvedValue(mockSavedMember) });
            const res = await request(app)
                .post('/api/member/create')
                .send(reqBody)
                .expect(201);
            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('orgId');

            expect(Member).toHaveBeenCalledWith({
                first_name: 'test fn',
                last_name: 'test ln',
                organisation: 'orgId',
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                }
            });
            expect(Member().save).toHaveBeenCalled();
            expect(res.body).toEqual(mockSavedMember);
        });
        it('should throw error if organisation does not exist', async () => {
            const reqBody = {
                first_name: 'test fn',
                last_name: 'test ln',
                orgId: 'nonexistent-orgId',
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                }
            };

            Organisation.findById.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/member/create')
                .send(reqBody)
                .expect(401);
            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('nonexistent-orgId');
            expect(res.body).toEqual({ message: 'Organisation not found' });
        });
    });

    describe('getMembersFromOrg', () => {
        it ('should return all members belonging to org when passed valid orgId', async () => {
            const orgId = "orgId";
            const mockMembers = [{ name: 'Alfie May' }, { name: 'Chuks Aneke' }];
            Member.find.mockResolvedValue(mockMembers);

            const res = await request(app)
                .get('/api/member/getMembersFromOrg')
                .query({ orgId })
                .expect(200);

            // Assertions
            expect(res.body).toEqual(mockMembers);

        });

        it('should return 500 if there is a server error', async () => {
            const orgId = 'orgId';

            Member.find.mockRejectedValue(new Error('Database error'));

            // Make the request
            const response = await request(app)
                .get('/api/member/getMembersFromOrg')
                .query({ orgId })
                .expect(500);

            // Assertion
            expect(response.text).toBe('Server Error');
        });

    });
});
