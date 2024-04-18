import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../AuthContext';
import Navbar from "../partials/Navbar";
import '../styles/Dashboard.css'
import MemberView from "./MemberView";


function AmbassadorDashboard() {
    const {ambassador} = useAuth();
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('/api/member/getMembersFromOrg', {
                    params: {
                        orgId: ambassador.organisation,
                    }
                });
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
        console.log("Trying");
        if (ambassador) {
            fetchMembers();
        } else {
            console.log("tried but no harrah");
        }

    }, [ambassador]);

    const removeDeletedMember = (deletedMemberId) => {
        setMembers(members.filter(member => member._id !== deletedMemberId));
    };

    const handleRowClick = (member) => {
        setSelectedMember(member);
    };
    const closeModal = () => {
        setSelectedMember(null);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    return (
        <>
            <Navbar/>
            <div className="d-flex p-3">
                <h1>Dashboard</h1>
            </div>
            <div className="container d-flex flex-column align-items-start">
                <h3>Members</h3>
                <div className="table-responsive member-table">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">Member id</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Member Since</th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.map(member => (
                            <tr key={member._id} onClick={() => handleRowClick(member)}>
                                <th scope="row">{member._id}</th>
                                <td>{member.first_name}</td>
                                <td>{member.last_name}</td>
                                <td>{formatDate(member.member_since)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Member detail modal */}
            {selectedMember && <MemberView member={selectedMember} onClose={closeModal} removeDeletedMember={removeDeletedMember}/>}
        </>

    );
}

export default AmbassadorDashboard;



