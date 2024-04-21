import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from '../AuthContext';

function CreateMember({onClose}) {
    const {ambassador} = useAuth();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
    });
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Only the first file if multiple files were selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        data.append('image', file);
        data.append('orgId', ambassador.organisation._id);

        try {
            const response = await axios.post('/api/member/create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Member created successfully!');
            onClose();
        } catch (error) {
            console.error('Error creating member:', error);
            alert('Failed to create member.');
        }
    };

    return (
        <div className="modal show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Member</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>First Name:</label>
                                <input type="text" className="form-control" name="first_name"
                                       value={formData.first_name} onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input type="text" className="form-control" name="last_name" value={formData.last_name}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Bio:</label>
                                <textarea className="form-control" name="bio" value={formData.bio}
                                          onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>Upload Image:</label>
                                <input type="file" className="form-control-file" onChange={handleFileChange}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Create Member</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateMember;
