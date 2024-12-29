const express = require('express');
const router = express.Router();
const axios = require('axios');
const oracledb = require('oracledb');

const request = require('request');
const xml2js = require('xml2js');
require('dotenv').config();

router.get('/api/msds/:chemId', async (req, res) => {
    try {
        const serviceKey = decodeURIComponent(process.env.MSDS_API_KEY);
        const chemId = req.params.chemId;
        
        const url = 'http://msds.kosha.or.kr/openapi/service/msdschem/chemdetail15';
        const queryParams = new URLSearchParams({
            serviceKey: serviceKey,
            chemId: chemId
        });

        const response = await axios.get(`${url}?${queryParams}`);
        
        // XML을 JSON으로 변환
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(response.data);

        console.log(result);

        // 에러 체크
        if (result.response.header.resultCode === '30') {
            return res.status(401).json({
                success: false,
                message: '서비스 키가 유효하지 않습니다.',
                errorCode: result.response.header.resultCode,
                errorMessage: result.response.header.resultMsg
            });
        }

        // 성공 응답
        res.json({
            success: true,
            data: result.response.body,
            header: result.response.header
        });

    } catch (error) {
        console.error('MSDS API 오류:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'MSDS 데이터 조회 중 오류가 발생했습니다.'
        });
    }
});

router.get('/api/msds/search/:casNo', async (req, res) => {
    try {
        const serviceKey = decodeURIComponent(process.env.MSDS_API_KEY);
        const casNo = req.params.casNo;
        
        // 목록 검색 API 엔드포인트
        const url = 'http://msds.kosha.or.kr/openapi/service/msdschem/chemlist';
        const queryParams = new URLSearchParams({
            serviceKey: serviceKey,
            searchWrd: casNo,    // CasNo로 검색
            searchCnd: '1',      // 검색 구분
            numOfRows: '10',     // 한 페이지 결과 수
            pageNo: '1',          // 페이지 번호
        });

        const response = await axios.get(`${url}?${queryParams}`);
        
        // XML을 JSON으로 변환
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(response.data);

        console.log('API 응답:', result);

        // 에러 체크
        if (result.response.header.resultCode === '30') {
            return res.status(401).json({
                success: false,
                message: '서비스 키가 유효하지 않습니다.',
                errorCode: result.response.header.resultCode,
                errorMessage: result.response.header.resultMsg
            });
        }

        // 검색 결과 처리
        const items = result.response.body.items.item;
        const chemicalInfo = Array.isArray(items) ? items : [items];

        res.json({
            success: true,
            data: chemicalInfo.map(item => ({
                casNo: item.casNo,
                chemId: item.chemId,
                chemNameKor: item.chemNameKor,
                keNo: item.keNo,
                enNo: item.enNo,
                lastDate: item.lastDate
            }))
        });

    } catch (error) {
        console.error('MSDS API 오류:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'MSDS 데이터 조회 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;
