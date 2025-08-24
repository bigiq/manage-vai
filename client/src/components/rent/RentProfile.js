import React from 'react';
import { Link } from 'react-router-dom';

const RentProfile = () => {
  // Dummy data for demonstration
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+8801712345678',
    address: 'House 123, Road 4, Section 10, Mirpur, Dhaka',
    rentAmount: 25000,
    paymentStatus: 'Paid',
    nextDueDate: 'October 1, 2025',
    paymentHistory: [
      { month: 'August 2025', amount: 25000, status: 'Paid', date: 'Aug 5, 2025' },
      { month: 'July 2025', amount: 25000, status: 'Paid', date: 'July 3, 2025' },
      { month: 'June 2025', amount: 25000, status: 'Paid', date: 'June 4, 2025' },
    ],
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Rent Profile</h2>
        <Link to="/rent-update" className="btn-update">Update Profile</Link>
      </div>

      <div className="profile-card">
        <h4>Personal Information</h4>
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Phone:</strong> {profileData.phone}</p>
      </div>

      <div className="profile-card">
        <h4>Current Tenancy</h4>
        <p><strong>Address:</strong> {profileData.address}</p>
        <p><strong>Monthly Rent:</strong> BDT {profileData.rentAmount.toLocaleString()}</p>
        <p><strong>Payment Status:</strong> <span className={`status-${profileData.paymentStatus.toLowerCase()}`}>{profileData.paymentStatus}</span></p>
        <p><strong>Next Due Date:</strong> {profileData.nextDueDate}</p>
      </div>

      <div className="profile-card">
        <h4>Payment History</h4>
        <table className="history-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount (BDT)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {profileData.paymentHistory.map((payment, index) => (
              <tr key={index}>
                <td>{payment.month}</td>
                <td>{payment.amount.toLocaleString()}</td>
                <td><span className={`status-${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentProfile;
