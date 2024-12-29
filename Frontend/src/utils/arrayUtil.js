export function makeIds(dataArray, property, propertyDesc) {
  const ids = dataArray.map((item) => {
    if (propertyDesc) {
      const str = item[property] + "/" + item[propertyDesc];
      return str;
    }
    return item[property];
  });
  return [...new Set(ids)];
}

/**
 * 중복 데이터 제거
 *
 * @param {*} dataArray - 객체 배열
 * @param {*} property - 중복 체크할 컬럼
 * @returns 중복 제거된 객체 배열
 */
export function filterDuplicates(dataArray, property) {
  return Array.from(
    new Map(dataArray.map((item) => [item[property], item])).values()
  );
}
