import React from 'react';
import axios from "axios";

function MemberView({ member, onClose, removeDeletedMember}) {
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const deleteMember = (memberId) => async () => {
        try {
            await axios.post('/api/ambassador/deleteMember', {
                    memberId: memberId
                }
            );
            alert('Member deleted');
            removeDeletedMember(memberId);
        } catch (error) {
            alert('Could not delete member');
        }
    };
    const suspendMember = (memberId) => () => {
        alert('suspending member');
    };

    return (
        <>
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Member Details</h5>
                            <button type="button" className="close" onClick={onClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>ID: {member._id}</p>
                            <p>First Name: {member.first_name}</p>
                            <p>Last Name: {member.last_name}</p>
                            <p>Member Since: {formatDate(member.member_since)}</p>
                            {/* Add more details as needed */}
                        </div>
                        <div className="modal-footer d-flex flex-row">
                            <button type="button" className="btn btn-warning" onClick={suspendMember(member._id)}>Suspend member</button>
                            <button type="button" className="btn btn-danger" onClick={deleteMember(member._id)}>Delete member</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MemberView;