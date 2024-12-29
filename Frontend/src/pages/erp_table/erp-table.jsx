import React, { useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import CardTemplate from "../template/card-template";
import Cookies from 'js-cookie';

function ERP_Table() {
  const [rows, setRows] = useState([{ id: '', pw: '', auth: '', checked: false }]);

  const Idhandler = (event, index) => {
    const newRows = [...rows];
    newRows[index].id = event.target.value;
    setRows(newRows);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault(); 

    let token = Cookies.get('x_auth');

    rows.forEach((row, index) => {
      let body = {
          id: row.id,
          token: token
      }

      axios.post('http://localhost:5000/api/erp/data', body)
          .then((response) => {
              if (response.data.success) {
                console.log(response.data.data)
                  const newRows = [...rows];
                  newRows[index].pw = response.data.data[0];
                  newRows[index].auth = response.data.data[1];
                  setRows(newRows);
              }
          }).catch((error) => {
              console.error('서버 요청 실패:', error);
          });
    });
  }

  const addRow = () => {
    setRows([...rows, { id: '', pw: '', auth: '', checked: false }]);
  }

  const deleteRow = () => {
    const newRows = rows.filter(row => !row.checked);
    setRows(newRows);
  }

  const handleCheck = (index) => {
    const newRows = [...rows];
    newRows[index].checked = !newRows[index].checked;
    setRows(newRows);
  }

  return (
    <CardTemplate
      CardBody={
        <form onSubmit={onSubmitHandler}>
          <Table striped bordered hover>
              <thead>
                  <tr>
                  <th>#</th>
                  <th>사번</th>
                  <th>성명</th>
                  <th>부서명</th>
                  <th>확인</th>
                  </tr>
              </thead>
              <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><input type="text" value={row.id} onChange={(e) => Idhandler(e, index)} /></td>
                      <td>{row.pw}</td>
                      <td>{row.auth}</td>
                      <td><input type="checkbox" checked={row.checked} onChange={() => handleCheck(index)} /></td>
                    </tr>
                  ))}
              </tbody>
          </Table>
          <button type="submit">조회</button>
          <button type="button" onClick={addRow}>행 추가</button>
          <button type="button" onClick={deleteRow}>선택 행 삭제</button>
        </form>
      }
    />  
  );
}

export default ERP_Table;
