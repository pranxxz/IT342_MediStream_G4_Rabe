import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// 1. Intercept react-router-dom to prevent any useNavigate crashes globally
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// 2. Mock useAuth
jest.mock('../features/authentication/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import ProtectedRoute from '../shared/components/ProtectedRoute';
import { useAuth } from '../features/authentication/hooks/useAuth';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FR-05 | ProtectedRoute', () => {
  test('TC-10 — unauthenticated user is redirected', () => {
    useAuth.mockReturnValue({ isAuthenticated: () => false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Landing Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  test('TC-11 — authenticated user sees protected content', () => {
    useAuth.mockReturnValue({ isAuthenticated: () => true });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Landing Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});