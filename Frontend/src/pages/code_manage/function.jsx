const handleSave = () => {
    console.log('저장 클릭')
    let body = {
      data: addedData, // 추가된 데이터만 전송
      menu: selectedMenu,
      code: selectedCode
    };
    axios.post("http://localhost:5000/api/add/code", body)
      .then((response) => {
        if (response.data.success) {
          alert("저장되었습니다.");
          setAddedData([]); // 저장 후 추가된 데이터 초기화
        }
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  };

  const handleDelete = () => {
    console.log('삭제 클릭');
    let body = {
      data: selectedRows, 
      menu: selectedMenu,
      code: selectedCode
    };
    console.log('삭제 데이터',body)
    axios.delete("http://localhost:5000/api/delete/code", { data: body })
      .then((response) => {
        if (response.data.success) {
          alert("삭제되었습니다.");
          setSelectedRows([]); // 행 초기화
        }
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  };
