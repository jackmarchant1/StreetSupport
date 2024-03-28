import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';



function AmbassadorDashboard() {
    const {organisationId, logout} = useAuth();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('/api/member/getMembersFromOrg', {
                    params: {
                        organisationId: organisationId,
                    }});
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
        fetchMembers();
    }, []);

    return (
        <>
            <div>Welcome</div>
            <button onClick={logout}>Log out</button>
            <ul>
                {members.map(member => (
                    <li key={member._id}>{member.name}</li>
                ))}
            </ul>
        </>

    );
}

export default AmbassadorDashboard;