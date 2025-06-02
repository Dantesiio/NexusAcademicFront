import { render, screen } from '@testing-library/react';
import LoginPage from '../page';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe('LoginPage', () => {
  it('muestra el título de login', () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
  });
}); 