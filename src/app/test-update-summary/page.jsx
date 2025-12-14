"use client";

import { useState } from 'react';

export default function TestUpdateSummaryPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('9');

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call API directly with user_id
      const response = await fetch('/api/tracking/update-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: parseInt(userId, 10) })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to update summary');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Update Summary API</h1>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          User ID:
        </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '200px'
          }}
        />
      </div>

      <button 
        onClick={handleUpdate}
        disabled={loading || !userId}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading || !userId ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading || !userId ? 'not-allowed' : 'pointer',
          marginTop: '20px'
        }}
      >
        {loading ? '⏳ Updating...' : '🔄 Update Summary'}
      </button>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#c00'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#efe',
          border: '1px solid #cfc',
          borderRadius: '6px'
        }}>
          <h2>✅ Summary Updated Successfully!</h2>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
        <h3>📊 Expected Results:</h3>
        <ul>
          <li><strong>total_tutorial_accessed:</strong> 8 (unique tutorials)</li>
          <li><strong>total_tutorial_completed:</strong> 8 (unique completed)</li>
          <li><strong>completion_rate:</strong> 100% (8/8)</li>
          <li><strong>total_journeys_completed:</strong> 4</li>
        </ul>
      </div>
    </div>
  );
}
