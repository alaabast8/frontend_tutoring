import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../login';
import DoctorMain from '../doctor_main';
import { describe, it, expect, vi } from 'vitest';

// 1. Test Role Switching Logic (Login)
describe('Login Integration', () => {
  it('switches between Student and Doctor roles correctly', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const doctorBtn = screen.getByText('Doctor');
    fireEvent.click(doctorBtn);
    
    // Verifies that the UI reflects the role change
    expect(screen.getByText('Login to Portal')).toBeInTheDocument();
    expect(doctorBtn).toHaveClass('active');
  });

  // 2. Test Navigation Guard in DoctorMain
  it('redirects to login if doctorId is missing in DoctorMain', async () => {
    // Mock window.alert to prevent actual popups during test
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <MemoryRouter initialEntries={['/doctor-main']}>
        <Routes>
          <Route path="/doctor-main" element={<DoctorMain />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(alertMock).toHaveBeenCalledWith("Session expired. Please login again.");
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    
    alertMock.mockRestore(); // Clean up the mock
  });
});