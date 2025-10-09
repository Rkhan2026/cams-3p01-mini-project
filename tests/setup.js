import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import '@testing-library/jest-dom';

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// DON'T mock fetch globally for real integration tests
// Remove: global.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  // Don't clear fetch since we want real API calls
});

// import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";

// // Mock environment variables
// // process.env.DATABASE_PRISMA_DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
// // process.env.SESSION_SECRET = 'test-secret-key-for-testing'

// // Mock Next.js router
// const mockRouter = {
//   push: vi.fn(),
//   replace: vi.fn(),
//   back: vi.fn(),
//   forward: vi.fn(),
//   refresh: vi.fn(),
//   prefetch: vi.fn(),
// };

// vi.mock("next/navigation", () => ({
//   useRouter: () => mockRouter,
//   usePathname: () => "/",
//   useSearchParams: () => new URLSearchParams(),
// }));

// // Mock fetch globally
// global.fetch = vi.fn();

// // Reset mocks before each test
// beforeEach(() => {
//   vi.clearAllMocks();
//   global.fetch.mockClear();
// });
