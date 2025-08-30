import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';

export default function Checkout() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvc: ''
  });
  const [message, setMessage] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Simulate payment
    if (!form.name || !form.email || !form.card || !form.expiry || !form.cvc) {
      setMessage('Per favore, compila tutti i campi.');
      return;
    }
    setMessage('Pagamento completato!');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#EFF9F0' }}>
      <div style={{ width: '100%', maxWidth: 400, margin: '2rem auto', position: 'relative' }}>
        <Link href="/pricing" style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0A4435', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
          <FiArrowLeft size={24} />
          <span>Indietro</span>
        </Link>
        <div style={{ padding: '2.5rem 2rem', background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(10, 68, 53, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0A4435' }}>Checkout</h2>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#222', fontWeight: 500 }}>
            <span>Riepilogo piano selezionato</span>
            <div style={{ marginTop: '0.5rem', fontSize: '1.1rem', color: '#2D6A4F' }}>
              {/* You can pass plan info via query or context if needed */}
              Piano NutriWell Pro
            </div>
            <div style={{ fontSize: '0.95rem', color: '#666' }}>€19/mese</div>
          </div>
          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input name="name" type="text" placeholder="Nome" value={form.name} onChange={handleChange} style={inputStyle} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
            <input name="card" type="text" placeholder="Numero carta" value={form.card} onChange={handleChange} style={inputStyle} maxLength={19} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input name="expiry" type="text" placeholder="MM/AA" value={form.expiry} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} maxLength={5} />
              <input name="cvc" type="text" placeholder="CVC" value={form.cvc} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} maxLength={4} />
            </div>
            <button type="submit" style={{ background: '#0A4435', color: 'white', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.75rem', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>
              Paga
            </button>
          </form>
          {message && <div style={{ marginTop: '1rem', color: message.includes('completato') ? '#2D6A4F' : '#B00020', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: '1rem',
  outline: 'none',
  width: '100%'
};
