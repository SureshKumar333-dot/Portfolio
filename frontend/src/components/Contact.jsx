import { useState } from 'react';
import api from '../lib/api';
import { personalInfo } from '../data/portfolio';
import styles from './Contact.module.css';

const budgets = ['Under ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000+'];
const services = ['UI Design', 'UX Research', 'Web Development', 'Design + Development', 'Design System', 'Brand Identity'];
const initialForm = { name: '', email: '', budget: '', service: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.post('/api/contact', form);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className={`sec ${styles.contact}`}>
      <div className="inner">
        <div className="sec-tag">
          <div className="sec-tag-line" />
          <span>Get In Touch</span>
          <span className="sec-num">/ 06</span>
        </div>
        <h2 className="big-title reveal">
          Let's Build Something<br /><em>Extraordinary</em>
        </h2>

        <div className={styles.wrap}>
          <div className={`${styles.left} reveal-l`}>
            <h3>Ready to start your next project?</h3>
            <p>
              I'm currently accepting new projects. Whether you need full product design,
              web development, or both — let's make something remarkable together.
            </p>
            <div className={styles.details}>
              <div className={styles.item}>
                <div className={styles.icon}>✉</div>
                <div>
                  <div className={styles.label}>Email</div>
                  <div className={styles.val}>
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>◎</div>
                <div>
                  <div className={styles.label}>Location</div>
                  <div className={styles.val}>{personalInfo.location}</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>◷</div>
                <div>
                  <div className={styles.label}>Response Time</div>
                  <div className={styles.val}>{personalInfo.responseTime}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-r">
            {status === 'success' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✦</div>
                <h4>Message Received</h4>
                <p>Thank you for reaching out. I'll review your details and reply within 24 hours.</p>
                <button className={styles.resetBtn} onClick={() => setStatus('idle')}>
                  Send Another →
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.group}>
                    <label>Your Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.group}>
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.group}>
                    <label>Budget</label>
                    <select name="budget" value={form.budget} onChange={handleChange}>
                      <option value="">Select range</option>
                      {budgets.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className={styles.group}>
                    <label>Service</label>
                    <select name="service" value={form.service} onChange={handleChange}>
                      <option value="">Select service</option>
                      {services.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.group}>
                  <label>Project Details</label>
                  <textarea
                    name="message"
                    placeholder="Tell me about your project, goals, and timeline..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                {status === 'error' && (
                  <div className={styles.errorMsg}>{error}</div>
                )}
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={status === 'loading'}
                >
                  <span>{status === 'loading' ? 'Sending...' : 'Send Message →'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}