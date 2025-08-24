import React, 'react';
import { useNavigate } from 'react-router-dom';

const RentUpdate = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to the backend.
        // For now, we just show an alert and navigate back.
        console.log('Form submitted (dummy function)');
        alert('Profile information updated successfully!');
        navigate('/rent-profile');
    };

    return (
        <div className="form-container" style={{maxWidth: '600px'}}>
            <h2>Update Rent Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Monthly Rent (BDT)</label>
                    <input type="number" name="rent" defaultValue="25000" />
                </div>
                <div className="form-group">
                    <label>Next Payment Due Date</label>
                    <input type="date" name="dueDate" />
                </div>
                <div className="form-group">
                    <label>Upload New Payment Receipt (Optional)</label>
                    <input type="file" name="receipt" />
                </div>
                 <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" defaultValue="+8801712345678" />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default RentUpdate;
