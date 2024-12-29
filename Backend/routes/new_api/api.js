const express = require('express');
const router = express.Router();
const axios = require('axios');
const oracledb = require('oracledb');

router.get('/api/weather', async (req, res) => {
  try {
    const serviceKey = decodeURIComponent(process.env.WEATHER_API_KEY);

    // 현재 시간 기준으로 가장 최근 예보 시간 계산
    const now = new Date();
    const today = now.toISOString().slice(0, 10).replace(/-/g, '');
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 기상청 API는 매 3시간마다 발표 (02:00, 05:00, 08:00, 11:00, 14:00, 17:00, 20:00, 23:00)
    let baseTime;
    if (hours < 2) {
      // 전날 23시 데이터 사용
      const yesterday = new Date(now.setDate(now.getDate() - 1));
      baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
      baseTime = '2300';
    } else {
      baseDate = today;
      baseTime =
        String(Math.floor((hours - 2) / 3) * 3 + 2).padStart(2, '0') + '00';
    }

    console.log('Base Date:', baseDate);
    console.log('Base Time:', baseTime);

    const url =
      'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    const queryParams = new URLSearchParams({
      serviceKey,
      pageNo: '1',
      numOfRows: '1000',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: '55',
      ny: '127',
    });

    console.log('Requesting weather data...', `${url}?${queryParams}`);

    const response = await axios.get(`${url}?${queryParams}`);
    console.log('Weather API response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Server Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      details: error.response?.data || error.message,
    });
  }
});

const puppeteer = require('puppeteer');
const xml2js = require('xml2js');

router.get('/api/search-chemical/:id', async (req, res) => {
  let browser;
  try {
    const keyword = req.params.id;

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // 화학물질 정보처리 시스템 조회
    await page.goto(
      `https://kreach.me.go.kr/repwrt/mttr/kr/mttrList.do?searchKeyword=${keyword}`,
      {
        waitUntil: 'networkidle0',
        timeout: 30000,
      },
    );

    // 테이블 데이터 추출
    const tableData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table.mb-table-to-mttr tbody tr');
      const data = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const rowData = {
          // 기본 정보
          casNo: cells[0]?.textContent.trim() || '',
          engName: cells[1]?.textContent.trim() || '',
          korName: cells[2]?.textContent.trim() || '',

          // 규제 정보
          existing: cells[3]?.textContent.trim() || '',
          toxic: cells[4]?.textContent.trim() || '',
          accident: cells[5]?.textContent.trim() || '',
          restricted: cells[6]?.textContent.trim() || '',
          focused: cells[7]?.textContent.trim() || '',
          persistent: cells[8]?.textContent.trim() || '',

          // 등록 정보
          registrationTarget: cells[9]?.textContent.trim() || '',

          // 함량 및 규제정보
          contentAndRegulation: cells[10]?.textContent.trim() || '',
        };

        data.push(rowData);
      });

      return data;
    });

    console.log('크롤링 결과:', JSON.stringify(tableData[0]));

    await browser.close();

    // MSDS 조회
    const MSDS_serviceKey = decodeURIComponent(process.env.MSDS_API_KEY);

    const url = 'http://msds.kosha.or.kr/openapi/service/msdschem/chemlist';
    const queryParams = new URLSearchParams({
      serviceKey: MSDS_serviceKey,
      searchWrd: keyword, // CasNo로 검색
      searchCnd: '1', // 검색 구분 (CasNo)
      numOfRows: '10', // 한 페이지 결과 수
      pageNo: '1', // 페이지 번호
    });

    const response = await axios.get(`${url}?${queryParams}`);

    // XML을 JSON으로 변환
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const items = result.response.body.items.item;
    const chemicalInfo = Array.isArray(items) ? items : [items];

    const chemId = chemicalInfo[0].chemId;

    console.log('화학물질id:', chemId);

    // 법적 규제 정보조회
    const url_15 =
      'http://msds.kosha.or.kr/openapi/service/msdschem/chemdetail15';
    const queryParams_15 = new URLSearchParams({
      serviceKey: MSDS_serviceKey,
      chemId: chemId,
    });

    const response_15 = await axios.get(`${url_15}?${queryParams_15}`);

    // XML을 JSON으로 변환
    const parser_15 = new xml2js.Parser({ explicitArray: false });
    const result_15 = await parser_15.parseStringPromise(response_15.data);

    const items_15 = result_15.response.body.items.item;
    const allRegulations = Array.isArray(items_15) ? items_15 : [items_15];

    // O02(산업안전보건법) 데이터만 필터링
    const regulation = allRegulations.filter(
      (item) => item.msdsItemCode === 'O02',
    );

    // 위험물안전관리법상 품명
    const danger_serviceKey = decodeURIComponent(process.env.DANGER_API_KEY);

    const danger_url =
      'http://hazmat.mpss.kfi.or.kr/openapi-data/service/MaterialInfoSvc/getMaterialInfo';
    const danger_queryParams = new URLSearchParams({
      serviceKey: danger_serviceKey,
      casNo: keyword,
    });

    const danger_response = await axios.get(
      `${danger_url}?${danger_queryParams}`,
    );

    if (danger_response.data.response.body.item) {
      const items = danger_response.data.response.body.item;
      // items가 배열인지 단일 객체인지 확인
      const dangerData = Array.isArray(items) ? items : [items];

      console.log('위험물 검색 결과:', dangerData[0].hazardmaterialclass);

      res.status(200).json({
        success: true,
        data: {
          tableData: tableData[0],
          regulation: regulation[0].itemDetail,
          dangerous: dangerData[0].hazardmaterialclass,
        },
      });
    } else {
      console.log('위험물 검색 결과 없음');
      res.status(200).json({
        success: true,
        data: {
          tableData: tableData[0],
          regulation: regulation[0].itemDetail,
          dangerousGoods: null,
        },
      });
    }
  } catch (error) {
    console.error('크롤링 에러:', error);
    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/api/gcm/:table/:id', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const id = req.params.id;
    const table = req.params.table;

    console.log(table, id);

    const sql = `
        SELECT *
        FROM ${table}
        WHERE cas_no = :id`;

    const result = await connection.execute(sql, [id]);

    // column과 데이터를 key:value 형태로 변환
    const data = await Promise.all(
      result.rows.map(async (row) => {
        let obj = {};
        await Promise.all(
          row.map(async (item, index) => {
            if (item instanceof oracledb.Lob) {
              let data = '';
              item.setEncoding('utf8');
              for await (const chunk of item) {
                data += chunk;
              }
              obj[result.metaData[index].name] = data;
            } else {
              obj[result.metaData[index].name] = item;
            }
          }),
        );
        return obj;
      }),
    );

    console.log(data[0]);

    const columnNames = Object.keys(data[0]);

    res.status(200).json({ success: true, data: data[0], column: columnNames });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const multer = require('multer');
const XLSX = require('xlsx');
const { getDBConnection } = require('../../models/dbconnect/db_connect');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/api/excel/upload',
  upload.single('excelFile'),
  async (req, res) => {
    let connection;
    try {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      connection = await getDBConnection();

      const headerMapping = {
        CAS번호: 'cas_no',
        영문명: 'eng_nm',
        국문명: 'kor_nm',
        기존화학물질: 'existing_chemical',
        유해화학물질: 'harmful_chemical',
        중점관리물질: 'intensive_control',
        '암, 돌연변이성 물질': 'cancer_mutation',
        사고대비물질: 'accident_prepare',
        함량정보: 'content_info',
        비고: 'remarks',
      };

      // 엑셀 데이터 읽기 옵션 설정
      const data = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        defval: null, // 빈 셀은 null로 처리
        header: Object.keys(headerMapping), // 사용할 헤더 지정
      });

      if (data.length === 0) {
        throw new Error('엑셀 파일에 데이터가 없습니다.');
      }

      for (const row of data) {
        const bindParams = {
          cas_no: row['CAS번호'] || null,
          eng_nm: row['영문명'] || null,
          kor_nm: row['국문명'] || null,
          existing_chemical: row['기존화학물질'] || null,
          harmful_chemical: row['유해화학물질'] || null,
          intensive_control: row['중점관리물질'] || null,
          cancer_mutation: row['암, 돌연변이성 물질'] || null,
          accident_prepare: row['사고대비물질'] || null,
          content_info: row['함량정보'] || null,
          remarks: row['비고'] || null,
        };

        await connection.execute(
          `INSERT INTO CHEMICAL_SUBSTANCES (
          CAS_NO,
          ENG_NM,
          KOR_NM,
          EXISTING_CHEMICAL,
          HARMFUL_CHEMICAL,
          INTENSIVE_CONTROL,
          CANCER_MUTATION,
          ACCIDENT_PREPARE,
          CONTENT_INFO,
          REMARKS
        ) VALUES (
          :cas_no,
          :eng_nm,
          :kor_nm,
          :existing_chemical,
          :harmful_chemical,
          :intensive_control,
          :cancer_mutation,
          :accident_prepare,
          :content_info,
          :remarks
        )`,
          bindParams,
          { autoCommit: true },
        );
      }

      res.json({
        success: true,
        message: `${data.length}개의 화학물질 데이터가 성공적으로 저장되었습니다.`,
      });
    } catch (error) {
      console.error('Excel upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
);

// 미등록 테이블 조회
router.get('/api/regist/list/:table', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const table = req.params.table;
    const { dates } = req.query;

    console.log('테이블:', table);
    console.log('날짜:', dates);

    const dateArray = dates.split(',');

    // Oracle에서 IN 절을 위한 바인드 변수 생성
    const bindVariables = dateArray
      .map((_, index) => `:date${index + 1}`)
      .join(',');

    // 바인드 객체 생성
    const bindObj = {};
    dateArray.forEach((date, index) => {
      bindObj[`date${index + 1}`] = date;
    });

    // SQL 쿼리 수정 - 정확한 날짜 매칭을 위해 TO_CHAR 사용
    const sql = `
      SELECT * 
      FROM ${table} 
      WHERE TO_CHAR(TRUNC(END_TIME), 'YYYY-MM-DD') IN (${bindVariables})
    `;

    console.log('SQL:', sql);
    console.log('Bind variables:', bindObj);

    const result = await connection.execute(sql, bindObj);

    const data = await Promise.all(
      result.rows.map(async (row) => {
        let obj = {};
        await Promise.all(
          row.map(async (item, index) => {
            if (item instanceof oracledb.Lob) {
              let data = '';
              item.setEncoding('utf8');
              for await (const chunk of item) {
                data += chunk;
              }
              try {
                obj[result.metaData[index].name] = JSON.parse(data);
              } catch (e) {
                obj[result.metaData[index].name] = data;
              }
            } else {
              obj[result.metaData[index].name] = item;
            }
          }),
        );
        return obj;
      }),
    );

    // 데이터 변환 - 정확한 날짜 형식으로 변환
    const transformedData = data.map((item) => {
      const endTime = new Date(item.END_TIME);
      const dateStr = endTime.toISOString().split('T')[0];
      return [item.DEPT_NM, dateStr];
    });

    // 날짜별로 데이터 그룹화 - 요청된 날짜에 대해서만 처리
    const groupedByDate = transformedData.reduce((acc, [dept, date]) => {
      if (dateArray.includes(date)) {
        // 요청된 날짜에 대해서만 처리
        if (!acc[date]) {
          acc[date] = [];
        }
        if (!acc[date].includes(dept)) {
          // 중복 제거
          acc[date].push(dept);
        }
      }
      return acc;
    }, {});

    // 원하는 형식으로 변환
    const finalData = Object.entries(groupedByDate).map(([date, depts]) => {
      return [date, ...depts];
    });

    console.log('Final grouped data:', finalData);

    res.status(200).json({ success: true, data: finalData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
});

// 테이블 조건 조회
router.get('/api/shem/where/:id/:table', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const table = req.params.table;
    const id = req.params.id;

    console.log('테이블:', table);

    const sql = `
      SELECT ${id}
      FROM ${table} 
    `;

    const result = await connection.execute(sql);

    console.log(result.rows)

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
});

module.exports = router;
