import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import CourseForm from './';

// Mock para useNavigate y useParams
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: vi.fn(),
  };
});

describe('CourseForm Component', () => {
  const mockCourse = {
    id: 'course123',
    name: 'Matemáticas Avanzadas',
    professor: 'Dr. Pérez',
    maxSlots: 30,
    enrolledStudents: 15,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({});
    global.fetch = vi.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCourse)
    }));
  });

  const renderComponent = (editMode = false) => {
    if (editMode) {
      vi.mocked(useParams).mockReturnValue({ id: 'course123' });
    }
    
    return render(
      <MemoryRouter initialEntries={[editMode ? '/courses/edit/course123' : '/courses/new']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<CourseForm />} />
          <Route path="/courses/new" element={<CourseForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('debería mostrar el formulario en modo creación', () => {
    renderComponent();
    
    expect(screen.getByText('Crear Curso')).toBeInTheDocument();
    expect(screen.getByLabelText('ID del Curso *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del Curso *')).toBeInTheDocument();
    expect(screen.getByLabelText('Profesor *')).toBeInTheDocument();
    expect(screen.getByLabelText('Cupos Máximos *')).toBeInTheDocument();
    expect(screen.getByText('Crear Curso')).toBeInTheDocument();
  });

  it('debería mostrar el formulario en modo edición', async () => {
    renderComponent(true);
    
    await waitFor(() => {
      expect(screen.getByText('Editar Curso')).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCourse.id)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCourse.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCourse.professor)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCourse.maxSlots.toString())).toBeInTheDocument();
      expect(screen.getByText('Actualizar Curso')).toBeInTheDocument();
    });
  });

  it('debería mostrar errores de validación', async () => {
    renderComponent();
    
    fireEvent.click(screen.getByText('Crear Curso'));
    
    await waitFor(() => {
      expect(screen.getByText('El ID es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('El nombre del curso es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('El nombre del profesor es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('El número máximo de cupos debe ser al menos 1')).toBeInTheDocument();
    });
  });

  it('debería enviar el formulario en modo creación', async () => {
    renderComponent();
    
    fireEvent.change(screen.getByLabelText('ID del Curso *'), { target: { value: 'new-course' } });
    fireEvent.change(screen.getByLabelText('Nombre del Curso *'), { target: { value: 'Nuevo Curso' } });
    fireEvent.change(screen.getByLabelText('Profesor *'), { target: { value: 'Profesor Nuevo' } });
    fireEvent.change(screen.getByLabelText('Cupos Máximos *'), { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Crear Curso'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/courses/',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 'new-course',
            name: 'Nuevo Curso',
            professor: 'Profesor Nuevo',
            maxSlots: 20
          })
        })
      );
    });
  });

  it('debería enviar el formulario en modo edición', async () => {
    renderComponent(true);
    
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Nombre del Curso *'), { target: { value: 'Curso Actualizado' } });
      fireEvent.click(screen.getByText('Actualizar Curso'));
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/courses/course123',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Curso Actualizado',
            professor: mockCourse.professor,
            maxSlots: mockCourse.maxSlots,
            enrolledStudents: mockCourse.enrolledStudents
          })
        })
      );
    });
  });

  it('debería mostrar diálogo de éxito en creación', async () => {
    renderComponent();
    
    fireEvent.change(screen.getByLabelText('ID del Curso *'), { target: { value: 'new-course' } });
    fireEvent.change(screen.getByLabelText('Nombre del Curso *'), { target: { value: 'Nuevo Curso' } });
    fireEvent.change(screen.getByLabelText('Profesor *'), { target: { value: 'Profesor Nuevo' } });
    fireEvent.change(screen.getByLabelText('Cupos Máximos *'), { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Crear Curso'));
    
    await waitFor(() => {
      expect(screen.getByText('Éxito')).toBeInTheDocument();
      expect(screen.getByText('El curso ha sido creado con éxito.')).toBeInTheDocument();
    });
  });

  it('debería mostrar diálogo de error al fallar la creación', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Error en el servidor' })
    }));
    
    renderComponent();
    
    fireEvent.change(screen.getByLabelText('ID del Curso *'), { target: { value: 'new-course' } });
    fireEvent.change(screen.getByLabelText('Nombre del Curso *'), { target: { value: 'Nuevo Curso' } });
    fireEvent.change(screen.getByLabelText('Profesor *'), { target: { value: 'Profesor Nuevo' } });
    fireEvent.change(screen.getByLabelText('Cupos Máximos *'), { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Crear Curso'));
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Error en el servidor')).toBeInTheDocument();
    });
  });

  it('debería navegar al cerrar diálogo después de creación exitosa', async () => {
    renderComponent();
    
    fireEvent.change(screen.getByLabelText('ID del Curso *'), { target: { value: 'new-course' } });
    fireEvent.change(screen.getByLabelText('Nombre del Curso *'), { target: { value: 'Nuevo Curso' } });
    fireEvent.change(screen.getByLabelText('Profesor *'), { target: { value: 'Profesor Nuevo' } });
    fireEvent.change(screen.getByLabelText('Cupos Máximos *'), { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Crear Curso'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Cerrar'));
      expect(mockNavigate).toHaveBeenCalledWith('/courses');
    });
});});