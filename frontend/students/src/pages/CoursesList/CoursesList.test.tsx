import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CoursesList from './';

// Mock para useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CoursesList Component', () => {
  const mockCourses = [
    {
      id: 'course1',
      name: 'Matemáticas Avanzadas',
      professor: 'Dr. Pérez',
      maxSlots: 30,
      enrolledStudents: 15
    },
    {
      id: 'course2',
      name: 'Programación React',
      professor: 'Ing. Gómez',
      maxSlots: 25,
      enrolledStudents: 20
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourses)
      }));
  });

  it('debería mostrar el loading inicial', () => {
    render(<CoursesList />, { wrapper: MemoryRouter });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debería mostrar la lista de cursos después de cargar', async () => {
    render(<CoursesList />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      mockCourses.forEach(course => {
        expect(screen.getByText(course.id)).toBeInTheDocument();
        expect(screen.getByText(course.name)).toBeInTheDocument();
        expect(screen.getByText(course.professor)).toBeInTheDocument();
        expect(screen.getByText(course.maxSlots.toString())).toBeInTheDocument();
        expect(screen.getByText(course.enrolledStudents.toString())).toBeInTheDocument();
      });
    });
  });

  it('debería manejar el error al cargar los cursos', async () => {
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 500
      }));
    
    render(<CoursesList />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('debería navegar a la vista de detalles al hacer clic en "Ver más"', async () => {
    render(<CoursesList />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      const viewButtons = screen.getAllByText('Ver más');
      fireEvent.click(viewButtons[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/courses/course1');
    });
  });

  it('debería navegar a la edición al hacer clic en "Editar"', async () => {
    render(<CoursesList />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      const editButtons = screen.getAllByText('Editar');
      fireEvent.click(editButtons[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/courses/edit/course1');
    });
  });

  it('debería eliminar un curso al hacer clic en "Eliminar"', async () => {
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourses)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true
      }));
    
    render(<CoursesList />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Eliminar');
      fireEvent.click(deleteButtons[0]);
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/courses/course1',
        { method: 'DELETE' }
      );
      expect(screen.queryByText('Matemáticas Avanzadas')).not.toBeInTheDocument();
    });
  });

  it('debería manejar el error al eliminar un curso', async () => {
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourses)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 500
      }));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<CoursesList />, { wrapper: MemoryRouter });
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Eliminar');
      fireEvent.click(deleteButtons[0]);
    });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});