import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../features/authentication/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('../shared/hooks/useRole', () => ({
  useRole: jest.fn(),
}));

import RoleBasedRoute from '../shared/components/RoleBasedRoute';
import { useAuth } from '../features/authentication/hooks/useAuth';
import { useRole } from '../shared/hooks/useRole';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FR-06 | RoleBasedRoute', () => {
  test('TC-14 — unauthenticated user is redirected', () => {
    useAuth.mockReturnValue({ isAuthenticated: () => false });
    useRole.mockReturnValue({ hasRole: jest.fn(), canAccessPage: jest.fn() });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RoleBasedRoute requiredRoles={['admin']}>
                <div>Admin Content</div>
              </RoleBasedRoute>
            }
          />
          <Route path="/" element={<div>Landing Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  test('TC-12 — wrong role sees Access Denied', () => {
    useAuth.mockReturnValue({ isAuthenticated: () => true });
    useRole.mockReturnValue({ hasRole: () => false, canAccessPage: jest.fn() });

    render(
      <MemoryRouter>
        <RoleBasedRoute requiredRoles={['admin']}>
          <div>Admin Content</div>
        </RoleBasedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  test('TC-13 — correct role sees content', () => {
    useAuth.mockReturnValue({ isAuthenticated: () => true });
    useRole.mockReturnValue({ hasRole: () => true, canAccessPage: jest.fn() });

    render(
      <MemoryRouter>
        <RoleBasedRoute requiredRoles={['nurse']}>
          <div>Nurse Content</div>
        </RoleBasedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Nurse Content')).toBeInTheDocument();
  });
});