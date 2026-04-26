const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

// 환경변수 로드
require('dotenv').config({ path: '.env.local' })

module.exports = createJestConfig({
  // 테스트 환경(jest-environment-jsdom 등) 로딩 후 실행할 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
})
