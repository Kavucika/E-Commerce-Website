import { render, screen } from '@testing-library/react';
import App from './App';
import Navbar from './Components/Navbar';
import Checkout from './Pages/Checkout';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Add a test for the Checkout page route
test('renders checkout page', () => {
  render(<Checkout />);
  const checkoutElement = screen.getByText(/checkout/i);
  expect(checkoutElement).toBeInTheDocument();
});
