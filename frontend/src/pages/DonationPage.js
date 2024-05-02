import React, {useState, useEffect} from 'react';
import '../styles/Donation.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function DonationPage() {
    let { memberId } = useParams();
    const [member, setMember] = useState(null);
    const navigate = useNavigate();

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
            console.log("Could not load the member, " + error);
            navigate('/404');
        }
    }
    const handlePaymentButtonClick = () => async() => {
        try {
            console.log('requesting payment link');
            const res = await axios.post('/api/member/acceptPayment', {memberId}, {withCredentials: true});
            console.log(res.data);
            window.location.href = res.data.url;
        } catch(error) {
            console.log('Could not handle payment');
        }
    };
    const alertButtonClicked = () => {
        alert(`Find out more about Street Support by emailing jmarchant1@sheffield.ac.uk.`);
    };

    const getYearFromDate = (dateString) => {
        const date = new Date(member.member_since);
        return date.getFullYear();
    }

    useEffect(() => {
        fetchMember();
    }, [memberId])

    if (!member) {
        return (<></>);
    }
    return (
            <div className="back-layer d-flex justify-content-end">
                <div className="exclaim d-flex justify-content-center align-items-center m-2" onClick={alertButtonClicked}>
                    <h5><i className="bi bi-patch-question-fill"></i></h5>
                </div>
                <div className="donation d-flex flex-column justify-content-between">
                        <div className="profile d-flex flex-column">
                            <div className="profile-image-container">
                                <img src={`http://localhost:8080/uploads/${member.image_url}`} alt="Member's Profile" className="profile-image"/>
                            </div>
                            <div className="member-info d-flex flex-column">
                                <h2>{member.first_name} {member.last_name}</h2>
                                <p className="purple-text">Member since {getYearFromDate(member.member_since)}</p>
                                <p>{member.bio}</p>
                            </div>
                            <div className="charity-info">
                                This member is associated with {member.organisation.name} organisation, you can contact their representative at {member.organisation.website}.
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