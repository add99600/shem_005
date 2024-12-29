export const StandardTable2 = () => {
  const isOverTen = (num) => num >= 10;
  
  // 공통 클래스 변수
  const cellClass = "tw-text-center";
  const headerClass = "tw-text-center tw-bg-yellow-100";
  const possibilityClass = "tw-text-center tw-bg-gray-200";
  const numberCellClass = (num) => `tw-text-center ${isOverTen(num) ? 'tw-bg-red-400' : ''}`;

  return (
    <div className="mt-4">
      <h2 className="tw-text-xl tw-font-bold mb-4">위험성 판정 평가표</h2>
      <table className="tw-table tw-table-bordered">
        <thead>
          <tr>
            <th className={possibilityClass} rowSpan="2">가능성</th>
            <th className={cellClass} colSpan="5">중대성</th>
          </tr>
          <tr>
            <th className={headerClass}>영향 없음<br/>1</th>
            <th className={headerClass}>경미한 휴업 재해<br/>2</th>
            <th className={headerClass}>단기 휴업 재해<br/>3</th>
            <th className={headerClass}>휴업 재해<br/>4</th>
            <th className={headerClass}>중대 재해<br/>5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={possibilityClass}>가능성 거의 없음 1</td>
            <td className={numberCellClass(1)}>1</td>
            <td className={numberCellClass(2)}>2</td>
            <td className={numberCellClass(3)}>3</td>
            <td className={numberCellClass(4)}>4</td>
            <td className={numberCellClass(5)}>5</td>
          </tr>
          <tr>
            <td className={possibilityClass}>가능성 미미 2</td>
            <td className={numberCellClass(2)}>2</td>
            <td className={numberCellClass(4)}>4</td>
            <td className={numberCellClass(6)}>6</td>
            <td className={numberCellClass(8)}>8</td>
            <td className={numberCellClass(10)}>10</td>
          </tr>
          <tr>
            <td className={possibilityClass}>가능성 낮음 3</td>
            <td className={numberCellClass(3)}>3</td>
            <td className={numberCellClass(6)}>6</td>
            <td className={numberCellClass(9)}>9</td>
            <td className={numberCellClass(12)}>12</td>
            <td className={numberCellClass(15)}>15</td>
          </tr>
          <tr>
            <td className={possibilityClass}>가능성 중간 4</td>
            <td className={numberCellClass(4)}>4</td>
            <td className={numberCellClass(8)}>8</td>
            <td className={numberCellClass(12)}>12</td>
            <td className={numberCellClass(16)}>16</td>
            <td className={numberCellClass(20)}>20</td>
          </tr>
          <tr>
            <td className={possibilityClass}>가능성 높음 5</td>
            <td className={numberCellClass(5)}>5</td>
            <td className={numberCellClass(10)}>10</td>
            <td className={numberCellClass(15)}>15</td>
            <td className={numberCellClass(20)}>20</td>
            <td className={numberCellClass(25)}>25</td>
          </tr>
          <tr>
            <td className={possibilityClass}>빈번함 6</td>
            <td className={numberCellClass(6)}>6</td>
            <td className={numberCellClass(12)}>12</td>
            <td className={numberCellClass(18)}>18</td>
            <td className={numberCellClass(24)}>24</td>
            <td className={numberCellClass(30)}>30</td>
          </tr>
        </tbody>
      </table>
      <p className="tw-text-red-500 tw-text-sm mt-2">※판정 결과 10점 이상인 항목은 개선 대상으로 분류하여 코드를 부여한다.</p>
    </div>
  );
};