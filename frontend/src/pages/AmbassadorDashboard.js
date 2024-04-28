import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../AuthContext';
import Navbar from "../partials/Navbar";
import '../styles/Dashboard.css'
import MemberView from "./MemberView";
import NewMemberPage from "./NewMemberPage";


function AmbassadorDashboard() {
    const {ambassador} = useAuth();
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(false);
    const [creatingNewMember, setCreatingNewMember] = useState(false)
    const [suspendedMembers, setSuspendedMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get('/api/member/getMembersFromOrg', {
                    params: {
                        orgId: ambassador.organisation,
                    }
                });
                setMembers(res.data);
            } catch (error) {
                console.error('Error fetching members: ', error);
            }
        };

        const fetchSuspendedMembers = async() => {
            try {
                const res = await axios.get('/api/member/getSuspendedMembersFromOrg', {
                    params: {
                        orgId: ambassador.organisation,
                    }
                });
                setSuspendedMembers(res.data)
            } catch (error) {
                console.error('Error fetching members: ', error);
            }
        };

        if (ambassador) {
            fetchMembers();
            fetchSuspendedMembers()
        }

    }, [ambassador]);

    const removeDeletedMember = (deletedMemberId) => {
        setMembers(members.filter(member => member._id !== deletedMemberId));
        setSuspendedMembers(suspendedMembers.filter(member => member._id !== deletedMemberId));
    };

    const moveSuspendedMember = (suspendedMember) => {
        setMembers(members.filter(member => member._id !== suspendedMember._id));
        setSuspendedMembers(prevSuspendedMembers => [...prevSuspendedMembers, suspendedMember]);
    }

    const moveUnsuspendedMember = (unsuspendedMember) => {
        setSuspendedMembers(suspendedMembers.filter(member => member._id !== unsuspendedMember._id));
        setMembers(prevMembers => [...prevMembers, unsuspendedMember]);
    }

    const handleRowClick = (member) => {
        setSelectedMember(member);
    };
    const changeModalMode = () => {
        setCreatingNewMember(prev => !prev);
    }
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
                <div className="d-flex flex-row w-100 justify-content-between px-2">
                    <h3>Members</h3>
                    <button type="button" className="btn btn-primary m-2" onClick={() => changeModalMode()}>Add Member</button>
                </div>
                <div className="table-responsive member-table">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">Last name</th>
                            <th scope="col">First name</th>
                            <th scope="col">Member since</th>
                            <th scope="col">Member id</th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.length > 0 ? (
                            members.map(member => (
                                <tr key={member._id} onClick={() => handleRowClick(member)}>
                                    <th scope="row">{member.last_name}</th>
                                    <td>{member.first_name}</td>
                                    <td>{formatDate(member.member_since)}</td>
                                    <td>{member._id}</td>
                                </tr>
                            ))
                        ) : (<p>Loading</p>)
                        }
                        </tbody>
                    </table>
                </div>

                {suspendedMembers.length > 0 ? (
                    <>
                    <br />
                    <h3>Suspended Members</h3>
                    <div className="table-responsive member-table">
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">Last name</th>
                                <th scope="col">First name</th>
                                <th scope="col">Member since</th>
                                <th scope="col">Member id</th>
                            </tr>
                            </thead>
                            <tbody>
                            {suspendedMembers.map(member => (
                                <tr key={member._id} onClick={() => handleRowClick(member)}>
                                    <th scope="row">{member.last_name}</th>
                                    <td>{member.first_name}</td>
                                    <td>{formatDate(member.member_since)}</td>
                                    <td>{member._id}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                ): null}
            </div>

            {/* Member detail modal */}
            {selectedMember &&
                <MemberView member={selectedMember} setMember={setSelectedMember} onClose={closeModal} removeDeletedMember={removeDeletedMember} moveSuspendedMember={moveSuspendedMember} moveUnsuspendedMember={moveUnsuspendedMember}/>}

            {creatingNewMember &&
                <NewMemberPage onClose={changeModalMode}/>
            }
        </>

    );
}

export default AmbassadorDashboard;



