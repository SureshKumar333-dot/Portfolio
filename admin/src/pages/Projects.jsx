import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import styles from './Projects.module.css';

const EMPTY = { num: '', label: '', type: '', name: '', desc: '', tech: '', link: '', caseLink: '', thumb: '', large: false, visible: true, order: 0, source: 'github' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/projects');
      setProjects(data);
    } catch { toast.error('Failed to load projects.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (p) => { setForm({ ...p, tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech }); setModal(p); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (modal === 'add') {
        const { data } = await api.post('/admin/projects', payload);
        setProjects(prev => [...prev, data]);
        toast.success('Project added.');
      } else {
        const { data } = await api.put(`/admin/projects/${modal._id}`, payload);
        setProjects(prev => prev.map(p => p._id === data._id ? data : p));
        toast.success('Project updated.');
      }
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const toggleVisible = async (p) => {
    try {
      const { data } = await api.put(`/admin/projects/${p._id}`, { ...p, tech: p.tech, visible: !p.visible });
      setProjects(prev => prev.map(x => x._id === data._id ? data : x));
    } catch { toast.error('Failed to update.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Delete failed.'); }
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.sub}>{projects.length} total · {projects.filter(p=>p.visible).length} visible on site</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Project</button>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : (
        <div className={styles.table}>
          <div className={styles.thead}>
            <span>#</span><span>Name</span><span>Type</span><span>Source</span><span>Visible</span><span>Actions</span>
          </div>
          {projects.map(p => (
            <div key={p._id} className={styles.row}>
              <span className={styles.cellNum}>{p.num}</span>
              <span className={styles.cellName}>{p.name}</span>
              <span className={styles.cellType}>{p.type}</span>
              <span className={`${styles.cellSource} ${styles[p.source]}`}>{p.source || '—'}</span>
              <span>
                <button className={`${styles.pill} ${p.visible ? styles.pillOn : styles.pillOff}`} onClick={() => toggleVisible(p)}>
                  {p.visible ? 'Visible' : 'Hidden'}
                </button>
              </span>
              <span className={styles.rowActions}>
                <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                <button className={styles.delBtn} onClick={() => handleDelete(p._id)}>Del</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{modal === 'add' ? 'Add Project' : `Edit: ${modal.name}`}</h2>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.grid2}>
                <div className={styles.group}><label>Number</label><input name="num" value={form.num} onChange={handleChange} placeholder="01" /></div>
                <div className={styles.group}><label>Order (sort)</label><input name="order" type="number" value={form.order} onChange={handleChange} /></div>
              </div>
              <div className={styles.group}><label>Project Name *</label><input name="name" value={form.name} onChange={handleChange} required /></div>
              <div className={styles.group}><label>Type / Category</label><input name="type" value={form.type} onChange={handleChange} placeholder="UI Design · Mobile · Figma" /></div>
              <div className={styles.group}><label>Label</label><input name="label" value={form.label} onChange={handleChange} placeholder="// Project Label" /></div>
              <div className={styles.group}><label>Description *</label><textarea name="desc" value={form.desc} onChange={handleChange} rows={3} required /></div>
              <div className={styles.group}><label>Tech Stack (comma-separated)</label><input name="tech" value={form.tech} onChange={handleChange} placeholder="React, Figma, Node.js" /></div>
              <div className={styles.grid2}>
                <div className={styles.group}><label>Live / Project Link</label><input name="link" value={form.link} onChange={handleChange} /></div>
                <div className={styles.group}><label>Case Study Link</label><input name="caseLink" value={form.caseLink} onChange={handleChange} /></div>
              </div>
              <div className={styles.group}><label>Thumbnail Image URL</label><input name="thumb" value={form.thumb} onChange={handleChange} placeholder="https://..." /></div>
              <div className={styles.grid2}>
                <div className={styles.group}>
                  <label>Source Platform</label>
                  <select name="source" value={form.source} onChange={handleChange}>
                    <option value="github">GitHub</option>
                    <option value="behance">Behance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.checkGroup}>
                  <label className={styles.checkLabel}><input type="checkbox" name="large" checked={form.large} onChange={handleChange} /> Full-width (spans 2 columns)</label>
                  <label className={styles.checkLabel}><input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} /> Visible on portfolio</label>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>{saving ? 'Saving…' : 'Save Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
