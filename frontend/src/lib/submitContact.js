import axios from 'axios';
import api from './api';

export async function submitContact(form) {
  if (import.meta.env.VITE_API_URL) {
    return api.post('/api/contact', form);
  }

  const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (web3Key) {
    const { data } = await axios.post('https://api.web3forms.com/submit', {
      access_key: web3Key,
      name: form.name,
      email: form.email,
      budget: form.budget || '—',
      service: form.service || '—',
      message: form.message,
      subject: `Portfolio inquiry from ${form.name}`,
    });
    if (!data.success) throw new Error(data.message || 'Failed to send');
    return data;
  }

  const err = new Error('NO_HANDLER');
  err.code = 'NO_HANDLER';
  throw err;
}
