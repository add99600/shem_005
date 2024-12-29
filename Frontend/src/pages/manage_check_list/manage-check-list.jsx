import React, { useState, useEffect } from 'react';
import { ListBoxComponent, Inject, CheckBoxSelection } from '@syncfusion/ej2-react-dropdowns';
import CardTemplate from "../template/card-template";
import axios from "axios";
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Sort,
    Toolbar,
    Filter,
    Edit,
  } from "@syncfusion/ej2-react-grids";
import { RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

function Manage_Check_List() {

    const [dataA, setDataA] = useState([]);
    const [data, setData] = useState([]);
    const [partData, setpartData] = useState([]);
    const [allPart, setallPart] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [uncheckedItems, setUncheckedItems] = useState([]);
    const [prevData, setPrevData] = useState([]);

    // 목록 리스트 불러오기
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACK_HOST + '/api/manage/checklist')
        .then((response) => {
            if (response.data.success) {
                const part_list = response.data.list;

                const transformedData = part_list.map((item, index) => {
                    return { text: item, id: `list-${index + 1}` };
                });
                setDataA(transformedData);
            }
        }).catch((error) => {
            console.error('서버 요청 실패:', error);
        });
    }, []);

    // Grid 툴바, 컬럼 설정
    const toolbar = ["Add", "Edit", "Delete", "Update", "Cancel"];
    const editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };

    const gcm = [
        { field: "DATA3", headerText: "내용" },
        { field: "ID", headerText: "ID" },
    ]

    const [selectedValue, setSelectedValue] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const handleRadioChange = (event) => {
        setIsInitialized(false);

        // 0.1초 후 true로 변경
        setTimeout(() => {
            setIsInitialized(true);
        }, 100);

        setCheckedItems([]);  // 새 항목 선택 시 체크박스 초기화
        setUncheckedItems([]);
        const selectedValue = event.value;
        setSelectedValue(selectedValue);
        sendSelectedValueToServer(selectedValue);
    };


    // 체크 데이터 불러오기
    const sendSelectedValueToServer = (selectedValue) => {
        axios.post(process.env.REACT_APP_BACK_HOST + '/api/manage/selected', { selectedValue })
        .then((response) => {
            console.log('서버 응답:', response.data);

            setData(response.data.detail);
            setpartData(response.data.part);
            setallPart(response.data.all_part);
        }).catch((error) => {
            console.error('서버 전송 실패:', error);
        });
    };


    // 데이터 추가 함수
    async function sendData(data) {
        const selectedValueString = selectedValue.toString();
        const updatedData = {
            ...data,
            top_menu: '코드카테고리분류',
            data1: '관리감독자 점검 체크리스트',
            data2: selectedValueString
        };

        let send_body = {
            data: JSON.stringify(updatedData)
        };

        await axios.post(`http://localhost:5000/api/gcm/GCM_CODE_DATA`, send_body)
          .then((response) => {
            if(response.data.success){
              console.log(response.data)
            }
          })
        .catch((error) => {
            console.error('요청실패:', error);
          });
    }

    // 데이터 삭제 함수
    async function deleteData(data) {
        console.log(JSON.stringify(data[0]))
        let delete_body = {
        data: JSON.stringify(data[0])
        }
        await axios.delete(`http://localhost:5000/api/gcm/GCM_CODE_DATA`, { params: delete_body})
        .then((response) => {
            if(response.data.success){
            console.log(response.data)
            }
        })
        .catch((error) => {
            console.error('요청실패:', error);
        });
    }  

    function getChangedData(newData, oldData = {}) {
        let changedData = {};
        for (let key in newData) {
            if (newData[key] !== oldData[key]) {
                changedData[key] = newData[key];
            }
        }
        return changedData;
    }
    
    // 데이터 업데이트 함수
    async function updateData(data) {
        const oldData = prevData.find(item => item.id === data.id) || {};
        getChangedData(data, oldData);
        let update_body = {
            data: JSON.stringify(data),
            id: data.ID
        };
        await axios.put(`http://localhost:5000/api/gcm/GCM_CODE_DATA`, update_body)
        .then((response) => {
            if(response.data.success){
                console.log(response.data);
            }
        }).catch((error) => {
            console.error('업데이트 실패:', error);
        });
    }

    // 버튼 클릭 이벤트 처리 함수
    async function handleActionComplete(args) {
        if (args.requestType === 'save') {
            if (args.action === 'add') {
                sendData(args.data).catch(console.error);
            } else if (args.action === 'edit') {
                updateData(args.data).catch(console.error);
            }
        } else if (args.requestType === 'delete') {
        deleteData(args.data).catch(console.error);
        }
    }

    const isChecked = (item) => {
        return partData.some(part => part.DATA2 === item[0]);
    };

    // 체크되거나 체크해제된 요소가 있다면 리스트에서 제거 및 추가
    useEffect(() => {
        const partDataValues = partData.map(part => part.DATA2);
        console.log('최초 체크 데이터', partDataValues);
        setCheckedItems(partDataValues);
    
        const newUncheckedItems = allPart.flat().filter(item => !partDataValues.includes(item));
    
        console.log('최초 비체크 데이터', newUncheckedItems);
        setUncheckedItems(newUncheckedItems);
    }, [partData, allPart]);
    

    // 체크박스의 체크 상태
    const handleCheckBoxChange = (event, item) => {
        const isChecked = event.checked; // 체크 상태 확인
        console.log(`체크박스 ${item}가 ${isChecked ? '체크됨' : '체크 해제됨'}`);
    
        setCheckedItems(prevState => {
            if (isChecked) {
                // item이 배열인지 확인하고, 배열인 경우 개별 요소를 추가
                if (Array.isArray(item)) {
                    return [...prevState, ...item];
                } else {
                    return [...prevState, item];
                }
            } else {
                // item이 배열인지 확인하고, 배열인 경우 개별 요소를 제거
                if (Array.isArray(item)) {
                    return prevState.filter(checkedItem => !item.includes(checkedItem));
                } else {
                    return prevState.filter(checkedItem => checkedItem !== item);
                }
            }
        });
    
        setUncheckedItems(prevState => {
            if (isChecked) {
                if (Array.isArray(item)) {
                    return prevState.filter(uncheckedItem => !item.includes(uncheckedItem));
                } else {
                    return prevState.filter(uncheckedItem => uncheckedItem !== item);
                }
            } else {
                if (Array.isArray(item)) {
                    return [...prevState, ...item];
                } else {
                    return [...prevState, item];
                }
            }
        });
    };

    const handleSave = () => {
        console.log('Checked Items:', checkedItems);
        console.log('Unchecked Items:', uncheckedItems);
        axios.post(process.env.REACT_APP_BACK_HOST + '/api/manage/checked', {
            checkedItems: JSON.stringify(checkedItems),
            uncheckedItems: JSON.stringify(uncheckedItems),
            detail: JSON.stringify(selectedValue)
        })
        .then(response => {
            console.log('서버로 데이터 전송 성공:', response.data);
            alert('저장되었습니다.');
        })
        .catch(error => {
            console.error('서버로 데이터 전송 중 오류 발생:', error);
        });
    };

    return (
        <CardTemplate
            CardBody={
                <div className='control-pane'>
                    <h2>목록</h2>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div className='control-section' style={{ width: '20%' }}>
                            <div id='listbox-selection'>
                                {dataA.map((item, index) => (
                                    <li key={index}>
                                        <RadioButtonComponent 
                                            name="payment" 
                                            value={item.text} 
                                            label={item.text} 
                                            change={handleRadioChange}
                                        />
                                    </li>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                            <div style={{ border: '1px solid #ccc', padding: '10px', width: '70%' }}>
                                {isInitialized && allPart.map((item, index) => (
                                    <CheckBoxComponent 
                                        key={index}
                                        label={item} 
                                        checked={isChecked(item)}
                                        change={(event) => handleCheckBoxChange(event, item)}
                                    />
                                ))}
                            </div>
                            <ButtonComponent style={{ marginLeft: '20px' }} onClick={handleSave}>저장</ButtonComponent>
                        </div>
                    </div>
                    <GridComponent
                        dataSource={data}
                        height="350"
                        allowSorting={true}
                        toolbar={toolbar}
                        editSettings={editSettings}
                        actionComplete={handleActionComplete}
                    >
                    <ColumnsDirective>
                        {gcm.map((col, index) => {
                          return (
                              <ColumnDirective
                              key={index}
                              field={col.field}
                              headerText={col.headerText}
                              type="string"
                              />
                          );
                        })}
                    </ColumnsDirective>
                        <Inject services={[Sort, Toolbar, Filter, Edit]} />
                    </GridComponent>
                </div>
            }
        />
    );
    
}

export default Manage_Check_List;
