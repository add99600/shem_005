export const StandardTable1 = () => {
  // 공통 스타일 변수
  const commonStyles = {
    tableContainer: "tw-table tw-table-bordered",
    headerCell: "tw-text-center tw-bg-gray-100",
    cell: "tw-text-center",
    title: "tw-text-lg tw-font-semibold mb-2",
  };

  return (
    <div className="d-flex flex-column">
      {/* 두 테이블을 나란히 배치하기 위한 컨테이너 */}
      <div className="tw-grid tw-grid-cols-2 tw-gap-4">
        {/* 가능성 테이블 */}
        <div>
          <h3 className={commonStyles.title}>위험성(사고 발생)이 예상되는 가능성 판단</h3>
          <table className={commonStyles.tableContainer}>
            <thead>
              <tr className="tw-bg-gray-100">
                <th className={commonStyles.headerCell}>구분</th>
                <th className={commonStyles.headerCell}>가능성</th>
                <th className={commonStyles.headerCell}>내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={commonStyles.cell}>빈번함</td>
                <td className={commonStyles.cell}>6</td>
                <td>1일 1회 정도 발생할 경우</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>가능성 높음</td>
                <td className={commonStyles.cell}>5</td>
                <td>주 1회 정도 발생할 경우</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>가능성 중간</td>
                <td className={commonStyles.cell}>4</td>
                <td>월 1회 정도 발생할 경우</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>가능성 낮음</td>
                <td className={commonStyles.cell}>3</td>
                <td>분기 1회 정도 발생할 경우</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>가능성 미미</td>
                <td className={commonStyles.cell}>2</td>
                <td>반기 1회 정도 발생할 경우</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>가능성 거의 없음</td>
                <td className={commonStyles.cell}>1</td>
                <td>년에 1회 정도 발생 예상</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 중대성 테이블 */}
        <div>
          <h3 className={commonStyles.title}>위험성(사고 발생)이 예상되는 중대성 판단</h3>
          <table className={commonStyles.tableContainer}>
            <thead>
              <tr className="tw-bg-gray-100">
                <th className={commonStyles.headerCell}>구분</th>
                <th className={commonStyles.headerCell}>중대성</th>
                <th className={commonStyles.headerCell}>내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={commonStyles.cell}>중대재해</td>
                <td className={commonStyles.cell}>5</td>
                <td>휴업이 3개월 이상 or 사망</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>휴업재해</td>
                <td className={commonStyles.cell}>4</td>
                <td>휴업이 1개월 이상인 재해</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>단기 휴업재해</td>
                <td className={commonStyles.cell}>3</td>
                <td>휴업이 3일 이상인 재해</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>경미한 휴업 재해</td>
                <td className={commonStyles.cell}>2</td>
                <td>휴업이 3일 미만인 재해</td>
              </tr>
              <tr>
                <td className={commonStyles.cell}>영향 없음</td>
                <td className={commonStyles.cell}>1</td>
                <td>휴업이 수반되지 않는 재해</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 주석 */}
      <div className="tw-mt-4 tw-text-sm tw-text-gray-600">
        <p>- 가능성과 중대성을 곱한 값이 각 위험 요소에 대한 위험도이다.</p>
        <p>- 기존 발생했던 사례 또는 발생 시 예상되는 피급 효과를 예상하여 가능성, 중대성을 선정한다.</p>
      </div>
    </div>
  );
};