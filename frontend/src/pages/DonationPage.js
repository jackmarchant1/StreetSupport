import React, {useState, useEffect} from 'react';
import '../styles/Donation.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DonationPage() {
    let { memberId } = useParams();
    const [member, setMember] = useState(null);

    const fetchMember = async () => {
        try {
            console.log('getting member with member id: ' + memberId)
            const res = await axios.get('/api/member/get', {
                params: {
                    memberId
                }
            });
            setMember(res.data);
        } catch(error) {
            console.log(console.log("Could not load the member"));
            //TODO: add proper error handling if there is no member of that id (probably a 404 page)
        }

    }
    const handlePaymentButtonClick = (paymentType) => () => {
        alert(`This will process a ${paymentType} payment.`);
    };
    const alertButtonClicked = () => {
        alert(`Alert pressed.`);
    };

    useEffect(() => {
        fetchMember();
    }, [memberId])

    if (!member) {
        return (<></>);
    }
    return (
            <div className="back-layer d-flex justify-content-end">
                    <div className="exclaim d-flex justify-content-center align-items-center m-2" onClick={alertButtonClicked}>
                        !
                    </div>
                    <div className="donation d-flex flex-column justify-content-between">
                        <div className="profile d-flex flex-column">
                            <div className="profile-image-container">
                                <img src={`http://localhost:8080/uploads/${member.image_url}`} alt="Member's Profile" className="profile-image"/>
                            </div>
                            <div className="member-info d-flex flex-column">
                                <h2>{member.first_name} {member.last_name}</h2>
                                <p className="purple-text">Member since 2023</p>
                                <p>This will be a little profile about the member. Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Vivamus vulputate tellus nec arcu scelerisque pharetra. Proin sodales
                                    accumsan
                                    sollicitudin. Suspendisse porttitor hendrerit varius. Nam diam ipsum, mollis vitae diam vel,
                                    rhoncus semper ligula. Fusce non est erat. Nam eu massa erat. Praesent sed venenatis risus,
                                    et
                                    aliquet metus. Nulla eu mi non lectus sodales ullamcorper sed a ligula.</p>
                            </div>
                            <div className="charity-info">
                                This member is associated with XYZ charity, you can contact their representative here.
                            </div>
                        </div>

                        <div className="payment-buttons d-flex flex-column">
                            <button onClick={handlePaymentButtonClick('Apple Pay')} className="apple-pay-button">
                                Donate with Apple Pay
                            </button>
                            <button onClick={handlePaymentButtonClick('Google Pay')} className="google-pay-button">
                                Donate with Google Pay
                            </button>
                            <button onClick={handlePaymentButtonClick('PayPal')} className="paypal-button">
                                Donate with PayPal
                            </button>
                        </div>
                    </div>
                </div>
    );
}

export default DonationPage;