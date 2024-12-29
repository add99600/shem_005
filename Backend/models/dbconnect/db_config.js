// oracle 환경변수
module.exports = {
    hmshe: {
        user: 'HMSHE',
        password: 'hmshe',
        connectString: '  (DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 12.230.55.127)(PORT = 1521))(CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = HMGWM)))',
    },

    epinf: {
        user: 'EP_INF',
        password: 'hmepinf',
        connectString: '  (DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 12.230.55.127)(PORT = 1521))(CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = HMGWM)))',
    }
};

