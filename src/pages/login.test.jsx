import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import Login from './login'; // Same folder
import { doctorService } from '../services/Doctors'; // Up one level to services
import { studentService } from '../services/Students';

// Mock Navigation
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockedUsedNavigate };
});

// Mock Services
vi.mock('../services/Doctors', () => ({
  doctorService: { login: vi.fn(), checkProfile: vi.fn() }
}));
vi.mock('../services/Students', () => ({
  studentService: { login: vi.fn(), checkProfile: vi.fn(), register: vi.fn() }
}));

describe('Login Page Integration', () => {
  test('successful student login redirects to dashboard', async () => {
    studentService.login.mockResolvedValue({ id: 'stu123' });
    studentService.checkProfile.mockResolvedValue({ exists: true });

    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'student_user' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});