import React, { useState } from 'react';
import axios from 'axios';

function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('excelFile', file);

      const response = await axios.post('http://localhost:5000/api/excel/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(response.data.message);
      setFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tw-p-4">
      <div className="tw-flex tw-items-center tw-gap-4">
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileChange}
          className="tw-file-input tw-file-input-bordered tw-file-input-sm"
          disabled={isLoading}
        />
        <button 
          onClick={handleUpload}
          className="tw-btn tw-btn-primary tw-btn-sm"
          disabled={isLoading || !file}
        >
          {isLoading ? '업로드 중...' : '업로드'}
        </button>
      </div>
      {isLoading && (
        <div className="tw-mt-2 tw-text-sm tw-text-gray-500">
          데이터를 처리중입니다...
        </div>
      )}
    </div>
  );
}

export default ExcelUpload;