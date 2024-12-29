export const StandardTable3 = () => {
    // 공통 스타일 변수들
    const commonStyles = {
      container: "mt-6",
      title: "tw-text-xl tw-font-bold mb-4",
      tableContainer: "tw-grid tw-grid-cols-2 tw-gap-8",
      table: "tw-table tw-table-bordered",
      headerRow: "tw-bg-gray-100",
      cell: "tw-text-center",
    };
  
    return (
      <div className={commonStyles.container}>
        <h2 className={commonStyles.title}>개선 필요사항에 대한 코드부여</h2>
        
        <div className={commonStyles.tableContainer}>
          {/* 왼쪽 테이블 */}
          <div>
            <table className={commonStyles.table}>
              <thead>
                <tr className={commonStyles.headerRow}>
                  <th className={commonStyles.cell}>부서명</th>
                  <th className={commonStyles.cell}>코드</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={commonStyles.cell}>1파트</td>
                  <td className={commonStyles.cell}>A1-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>2파트</td>
                  <td className={commonStyles.cell}>A2-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>3파트</td>
                  <td className={commonStyles.cell}>A2-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>4파트</td>
                  <td className={commonStyles.cell}>A4-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>5파트</td>
                  <td className={commonStyles.cell}>A5-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>TEST파트</td>
                  <td className={commonStyles.cell}>TE-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>Facility그룹</td>
                  <td className={commonStyles.cell}>FT-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>구매그룹</td>
                  <td className={commonStyles.cell}>PU-00</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          {/* 오른쪽 테이블 */}
          <div>
            <table className={commonStyles.table}>
              <thead>
                <tr className={commonStyles.headerRow}>
                  <td className={commonStyles.cell}>부서명</td>
                  <td className={commonStyles.cell}>코드</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={commonStyles.cell}>연구소</td>
                  <td className={commonStyles.cell}>LA-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>QRA팀(PQA)</td>
                  <td className={commonStyles.cell}>QF-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>QRA팀(TQA)</td>
                  <td className={commonStyles.cell}>QB-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>QRA팀(수입검사)</td>
                  <td className={commonStyles.cell}>QI-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>QRA팀(FA파트)</td>
                  <td className={commonStyles.cell}>FA-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>ESG그룹</td>
                  <td className={commonStyles.cell}>EG-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>보안총무그룹</td>
                  <td className={commonStyles.cell}>SE-00</td>
                </tr>
                <tr>
                  <td className={commonStyles.cell}>WLS</td>
                  <td className={commonStyles.cell}>WLS-00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };