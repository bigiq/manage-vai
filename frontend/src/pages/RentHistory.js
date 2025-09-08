import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RentHistory = () => {
  const [rentHistory, setRentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRentHistory();
  }, []);

  const fetchRentHistory = async () => {
    try {
      const response = await axios.get('/api/users/rent-history');
      setRentHistory(response.data);
    } catch (error) {
      setError('Error fetching rent history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading rent history...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Rent History</h1>
      </div>

      {error && <div className="error">{error}</div>}

      {rentHistory.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>No rental history found.</p>
          <p>Start renting properties to see your history here!</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
          <h3>Rental History ({rentHistory.length} rentals)</h3>
          <div style={{ marginTop: '20px' }}>
            {rentHistory.map((rental, index) => (
              <div 
                key={index}
                style={{
                  padding: '20px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{rental.title}</h4>
                    <p style={{ margin: '0', color: '#666' }}>📍 {rental.location}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#27ae60' }}>${rental.price}</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>Monthly Rent</p>
                  </div>
                  <div>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Rented on</p>
                    <strong>{new Date(rental.rentDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span 
                      style={{
                        background: '#27ae60',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px'
                      }}
                    >
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }}>
              <div>
                <p style={{ margin: '0', color: '#666' }}>Total Rentals</p>
                <strong style={{ fontSize: '24px', color: '#333' }}>{rentHistory.length}</strong>
              </div>
              <div>
                <p style={{ margin: '0', color: '#666' }}>Total Spent</p>
                <strong style={{ fontSize: '24px', color: '#27ae60' }}>
                  ${rentHistory.reduce((total, rental) => total + rental.price, 0)}
                </strong>
              </div>
              <div>
                <p style={{ margin: '0', color: '#666' }}>Average Rent</p>
                <strong style={{ fontSize: '24px', color: '#333' }}>
                  ${Math.round(rentHistory.reduce((total, rental) => total + rental.price, 0) / rentHistory.length)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentHistory;
