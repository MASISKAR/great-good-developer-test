import mockData from './mockData.json';

export default class MockApi {
  getReports() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 1500);
    });
  }
}

