import React, { useState } from 'react';
import axios from 'axios';

const ApiManage = () => {
    const [chemId, setChemId] = useState('');
    const [msdsData, setMsdsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`http://localhost:5000/api/search-chemical/${chemId}`);
            
            if (response.data.success) {
                setMsdsData(response.data.data);
            }

        } catch (error) {
            setError('데이터 조회 중 오류가 발생했습니다.');
            console.error('API 호출 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>MSDS 검색</h2>
            <div>
                <input 
                    type="text"
                    value={chemId}
                    onChange={(e) => setChemId(e.target.value)}
                    placeholder="화학물질 ID 입력"
                />
                <button 
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? '검색 중...' : '검색'}
                </button>
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}
            
            {msdsData && (
                <div>
                    <h3>검색 결과</h3>
                    <pre>{JSON.stringify(msdsData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ApiManage;