import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import DoctorMain from './doctor_main';
import { doctorService } from '../services/Doctors';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { 
    ...actual, 
    useNavigate: () => mockedUsedNavigate,
    useLocation: () => ({ state: { doctorId: 'doc_123' } }) 
  };
});

vi.mock('../services/Doctors', () => ({
  doctorService: { createProfile: vi.fn() }
}));

describe('DoctorMain Page Integration', () => {
  test('submits doctor profile details after filling all required fields', async () => {
    doctorService.createProfile.mockResolvedValue({});
    window.alert = vi.fn();

    render(<MemoryRouter><DoctorMain /></MemoryRouter>);

    // Fill out ALL required fields to satisfy the form validation
    fireEvent.change(screen.getByLabelText(/University Name/i), { target: { value: 'Health Uni' } });
    fireEvent.change(screen.getByLabelText(/Faculty/i), { target: { value: 'Medicine' } });
    fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: 'Cardiology' } });
    fireEvent.change(screen.getByLabelText(/Start Teaching Year/i), { target: { value: '2020' } });

    // Click submit
    fireEvent.click(screen.getByText(/Save Profile & Continue/i));

    await waitFor(() => {
      // Now that validation is passed, the service should be called
      expect(doctorService.createProfile).toHaveBeenCalledWith(expect.objectContaining({
        uni_name: 'Health Uni',
        faculty: 'Medicine',
        department: 'Cardiology',
        start_teaching_year: 2020
      }));
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/doctor-dashboard');
    });
  });
});