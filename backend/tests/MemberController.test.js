const request = require('supertest');
const app = require('../index');
const Organisation = require('../models/Organisation');
const Member = require('../models/Member');

//Mock both models that are used, so whenever calls are made to these we are actually calling the mocks
jest.mock('../models/Ambassador');
jest.mock('../models/Organisation');
jest.mock('../models/Member');

describe('MemberController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createMember', () => {
        it('should create a new member if all credentials are valid', async () => {
            const reqBody = {
                first_name: 'test fn',
                last_name: 'test ln',
                bio: 'bio',
                orgId: 'orgId',
            };
            const createdTime = new Date();

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
                bio: 'test bio',
                is_suspended: false,
                member_since: createdTime,
                image_url: 'img_url',
                organisation: 'fake-org-id'
            };
            Member.mockReturnValue({ save: jest.fn().mockResolvedValue(mockSavedMember) });
            const res = await request(app)
                .post('/api/member/create')
                .send(reqBody)
                .expect(201);
            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('orgId');
            expect(Member).toHaveBeenCalled();
            expect(Member().save).toHaveBeenCalled();
            expect(res.body._id).toEqual('fake-member-id');
        });

        it('should throw error if organisation does not exist', async () => {
            const reqBody = {
                first_name: 'test fn',
                last_name: 'test ln',
                bio: 'bio',
                orgId: 'nonexistent-orgId',
            };

            Organisation.findById.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/member/create')
                .send(reqBody)
                .expect(404);
            // Assertions
            expect(Organisation.findById).toHaveBeenCalledWith('nonexistent-orgId');
            expect(res.body).toEqual({ message: 'Organisation not found' });
        });

        it('should throw errors if server errors', async () => {
            const reqBody = {
                first_name: 'test fn',
                last_name: 'test ln',
                orgId: 'nonexistent-orgId',
                member_since: {
                    $date: "2024-01-01T00:00:00.000Z"
                }
            };

            Organisation.findById.mockRejectedValue(new Error('Server error'));

            await request(app)
                .post('/api/member/create')
                .send(reqBody)
                .expect(500)
        })
    });

    describe('getMembersFromOrg', () => {
        it ('should return all unsuspended members belonging to org when passed valid orgId', async () => {
            const orgId = "orgId";
            const mockMembers = [{ name: 'Alfie May', is_suspended: false }, { name: 'Chuks Aneke', is_suspended: false }];
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

    describe('getSuspendedMembersFromOrg', () => {
        it ('should return all suspended members belonging to org when passed valid orgId', async () => {
            const orgId = "orgId";
            const mockMembers = [{ name: 'Alfie May', is_suspended: true }, { name: 'Chuks Aneke', is_suspended: true }];
            Member.find.mockResolvedValue(mockMembers);

            const res = await request(app)
                .get('/api/member/getSuspendedMembersFromOrg')
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
                .get('/api/member/getSuspendedMembersFromOrg')
                .query({ orgId })
                .expect(500);

            // Assertion
            expect(response.text).toBe('Server Error');
        });
    });

    describe('getMember', () => {
        it('should successfully get member given id' , async() => {
            const memberId = 'memberId';
            const mockReturnedMember = {
                _id: 'fake-member-id',
                first_name: 'test fn',
                last_name: 'test ln',
                bio: 'test bio',
                is_suspended: false,
                member_since: new Date(),
                image_url: 'img_url',
                organisation: 'fake-org-id'
            };
            Member.findById.mockResolvedValue(mockReturnedMember);
            const res = await request(app)
                .get('/api/member/get')
                .query({memberId})
                .expect(200)
            expect(Member.findById).toHaveBeenCalledWith(memberId);
            expect(res.body._id).toEqual(mockReturnedMember._id); //Cannot compare whole thing because of date object
        });

        it('should return 404 error if member does not exist', async () => {
            const memberId = 'memberId';
            Member.findById.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/member/get')
                .query({memberId})
                .expect(404)

            expect(Member.findById).toHaveBeenCalledWith(memberId);
        });

        it('should return 500 error if server error', async() => {
            const memberId = 'memberId';
            Member.findById.mockRejectedValue(new Error('Server error'));

            const res = await request(app)
                .get('/api/member/get')
                .query({memberId})
                .expect(500)

            expect(Member.findById).toHaveBeenCalledWith(memberId);
        })
    })


});
