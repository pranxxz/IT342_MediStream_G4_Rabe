import React from 'react'; // 👈 Add this line
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../features/authentication/hooks/useAuth';

// Provide Router context so useNavigate doesn't crash on render
const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

describe('FR-05 | useAuth — Core Authentication Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('isAuthenticated() returns false when no user exists', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated()).toBe(false);
  });

  test('isAuthenticated() returns true when user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated()).toBe(true);
  });

  test('getCurrentUser() returns parsed user from localStorage', () => {
    const fakeUser = { id: 1, name: 'Juan', role: 'nurse' };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.getCurrentUser()).toEqual(fakeUser);
  });

  test('logout() clears localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    localStorage.setItem('token', 'fake-token');
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});