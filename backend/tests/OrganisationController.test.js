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
