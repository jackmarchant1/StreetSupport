import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../AuthContext';
import Navbar from "../partials/Navbar";


function AmbassadorDashboard() {
    const {ambassador, logout} = useAuth();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            console.log("ambassador object on load: ", JSON.stringify(ambassador));
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
            <div className="container">
                <h1>Dashboard</h1>
                <table className="table">
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
                        <tr key={member._id}>
                            <th scope="row">{member._id}</th>
                            <td>{member.first_name}</td>
                            <td>{member.last_name}</td>
                            <td>{formatDate(member.member_since)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
        </>

    );
}

export default AmbassadorDashboard;



