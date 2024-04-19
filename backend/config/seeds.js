const { generateRandomMembers } = require('../controllers/MemberController');


const amount = parseInt(process.argv[2]) || 1;
generateRandomMembers(amount)
    .then(() => {
        console.log('Random members generated successfully');
        process.exit(0); // Exit with success status code
    })
    .catch((error) => {
        console.error('Error generating random members:', error);
        process.exit(1); // Exit with error status code
    });
