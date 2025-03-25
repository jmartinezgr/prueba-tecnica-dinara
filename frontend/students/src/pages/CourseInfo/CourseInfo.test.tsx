import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CourseInfo from './';

describe('CourseInfo Component', () => {
  const mockCourse = {
    id: 'course123',
    name: 'Matemáticas Avanzadas',
    professor: 'Dr. Pérez',
    maxSlots: 30,
    enrolledStudents: 2,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z'
  };

  const mockStudents = [
    {
      id: 'student1',
      firstName: 'Juan',
      lastName: 'Gómez',
      institutionalEmail: 'juan@uni.edu'
    },
    {
      id: 'student2',
      firstName: 'María',
      lastName: 'López',
      institutionalEmail: 'maria@uni.edu'
    }
  ];

  const mockInscriptions = [
    { courseId: 'course123', userId: 'student1' },
    { courseId: 'course123', userId: 'student2' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    global.fetch = vi.fn()
      .mockImplementation((url) => {
        if (url.includes('/courses/course123')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCourse)
          });
        }
        
        if (url.includes('/inscriptions/?courseId=course123')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockInscriptions)
          });
        }
        
        if (url.includes('/students/student1')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockStudents[0])
          });
        }
        
        if (url.includes('/students/student2')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockStudents[1])
          });
        }
        
        if (url.includes('/inscriptions') && url.method === 'DELETE') {
          return Promise.resolve({
            ok: true
          });
        }
        
        return Promise.reject(new Error('URL no mockeada'));
      });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/courses/course123']}>
        <Routes>
          <Route path="/courses/:id" element={<CourseInfo />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('debería mostrar el loading inicial', () => {
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debería mostrar la información del curso después de cargar', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Información del Curso')).toBeInTheDocument();
      expect(screen.getByText(`ID del Curso: ${mockCourse.id}`)).toBeInTheDocument();
      expect(screen.getByText(`Nombre del Curso: ${mockCourse.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Profesor: ${mockCourse.professor}`)).toBeInTheDocument();
      expect(screen.getByText(`Cupos Máximos: ${mockCourse.maxSlots}`)).toBeInTheDocument();
    });
  });

  it('debería mostrar los estudiantes inscritos', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Estudiantes Inscritos')).toBeInTheDocument();
      mockStudents.forEach(student => {
        expect(screen.getByText(student.id)).toBeInTheDocument();
        expect(screen.getByText(student.firstName)).toBeInTheDocument();
        expect(screen.getByText(student.lastName)).toBeInTheDocument();
        expect(screen.getByText(student.institutionalEmail)).toBeInTheDocument();
      });
    });
  });

  it('debería mostrar mensaje cuando no hay estudiantes inscritos', async () => {
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourse)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      }));
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('No hay estudiantes inscritos.')).toBeInTheDocument();
    });
  });

  it('debería manejar la eliminación de un estudiante', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getAllByText('Eliminar').length).toBe(mockStudents.length);
    });
    
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/inscriptions',
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'student1', courseId: 'course123' })
        })
      );
    });
  });

  it('debería mostrar error cuando falla la carga del curso', async () => {
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 404
      }));
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('debería mostrar error cuando falla la carga de estudiantes', async () => {
    global.fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourse)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 500
      }));
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});