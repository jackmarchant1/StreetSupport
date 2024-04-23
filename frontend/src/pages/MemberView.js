import React from 'react';
import axios from "axios";

function MemberView({ member, setMember, onClose, removeDeletedMember, moveSuspendedMember, moveUnsuspendedMember}) {
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const deleteMember = (member) => async () => {
        try {
            await axios.post('/api/ambassador/deleteMember', {
                    memberId: member._id
                });
            alert('Member deleted');
            removeDeletedMember(member._id);
            onClose();
        } catch (error) {
            alert('Could not delete member, try again');
        }
    };
    const suspendMember = (member) => async () => {
        try {
            const res = await axios.post('/api/ambassador/suspendMember', {
                memberId: member._id
            });
            member = res.data.suspendedMember
            alert('Member suspended');
            moveSuspendedMember(member);
            onClose();
        } catch(error) {
            alert('Member could not be suspended, try again');
        }
    };

    const unsuspendMember = (member) => async () => {
        try {
            const res = await axios.post('/api/ambassador/unsuspendMember', {
                memberId: member._id
            });
            member = res.data.unsuspendedMember;
            setMember(res.data.unsuspendedMember);
            alert('Member unsuspended');
            moveUnsuspendedMember(member);
            onClose();
        } catch(error) {
            alert('Member could not be suspended, try again');
        }
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
                            <img src={`http://localhost:8080/uploads/${member.image_url}`} alt="Member's image" className="profile-image"/> {/* TODO: update root */}
                            <p>ID: {member._id}</p>
                            <p>First Name: {member.first_name}</p>
                            <p>Last Name: {member.last_name}</p>
                            <p>Bio: {member.bio}</p>
                            <p>Member Since: {formatDate(member.member_since)}</p>
                        </div>
                        <div className="modal-footer d-flex flex-row">
                            {member.is_suspended ? (
                                <button type="button" className="btn btn-warning" onClick={unsuspendMember(member)}>Unsuspend member</button>
                            ) : (
                                <button type="button" className="btn btn-warning"
                                        onClick={suspendMember(member)}>Suspend member</button>
                            )}

                            <button type="button" className="btn btn-danger" onClick={deleteMember(member)}>Delete member</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MemberView;