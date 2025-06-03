
import { Route } from 'react-router-dom';
import AdminTools from '@/pages/AdminTools';

export const AdminRoute = () => (
  <Route path="/admin" element={<AdminTools />} />
);
