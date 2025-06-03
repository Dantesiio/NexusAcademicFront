// src/app/components/__tests__/CourseForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { CourseForm } from '../CourseForm';
import { useDispatch, useSelector } from 'react-redux';

// ... (your mockDispatch and action mocks from previous suggestion should be here)
const mockActualThunkDispatch = jest.fn();
const mockGetState = jest.fn(() => ({ /* ...mock state if needed by thunks ... */ }));

const mockDispatch = jest.fn(action => {
    if (typeof action === 'function') {
        return action(mockActualThunkDispatch, mockGetState);
    }
    return Promise.resolve();
});

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: jest.fn(), // Will be configured in describe/beforeEach
}));

jest.mock('../../store/actions/courseActions', () => ({
    createCourse: jest.fn((data) => async (dispatch, getState) => {
        return Promise.resolve({ id: 'newCourse123', ...data });
    }),
    updateCourseAction: jest.fn((courseId, data) => async (dispatch, getState) => {
        return Promise.resolve({ id: courseId, ...data });
    }),
}));
// ...

describe('CourseForm', () => {
    const mockOnClose = jest.fn();

    // ⭐ Define a stable mock user and state OUTSIDE beforeEach/mockImplementation
    const MOCK_USER = { // Use a constant name for clarity
        id: 'u1',
        fullName: 'Profesor Uno',
        email: 'prof@uni.edu',
        roles: ['teacher']
    };

    const MOCK_STATE = {
        auth: {
            user: MOCK_USER // Use the stable MOCK_USER object
        },
        courses: {
            loading: false
        }
        // Add other parts of your RootState if selectors access them
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // ⭐ Configure useSelector to use the stable MOCK_STATE
        (useSelector as jest.Mock).mockImplementation(selectorFn => {
            // The selectorFn is the actual function you pass to useSelector in your component,
            // e.g., (state) => state.auth.user or (state) => state.courses.loading
            return selectorFn(MOCK_STATE);
        });

        window.alert = jest.fn();
    });

    // ... your tests (it, it, etc.)
    // Example test that was likely triggering the error:
    it('renderiza campos obligatorios para un nuevo curso', async () => {
        render(<CourseForm onClose={mockOnClose} />); // No 'course' prop, so the 'else' block in useEffect runs
        
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Ej: Programación Avanzada')).toBeInTheDocument();
            // ... other assertions
        });
    });

    it('envía formulario correctamente para nuevo curso', async () => {
        render(<CourseForm onClose={mockOnClose} />);
    
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('Ej: Programación Avanzada'), {
                target: { value: 'Curso Nuevo', name: 'name' }
            });
            fireEvent.change(screen.getByPlaceholderText('Ej: PRG-301'), {
                target: { value: 'PRG-101', name: 'code' }
            });
            fireEvent.change(screen.getByPlaceholderText('Describe el contenido y objetivos del curso...'), {
                target: { value: 'Este es un curso nuevo sobre React Testing Library.', name: 'description' }
            });
            fireEvent.change(screen.getByLabelText('Fecha de Inicio'), {
                target: { value: '2025-06-10', name: 'startDate' }
            });
            fireEvent.change(screen.getByLabelText('Fecha de Fin'), {
                target: { value: '2025-06-15', name: 'endDate' }
            });
            fireEvent.click(screen.getByText('Crear'));
        });
    
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledTimes(1); 
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    // Add other tests as needed
});