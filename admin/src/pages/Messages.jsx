import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import styles from './Messages.module.css';

export default function Messages() {
  const [messages, setMessages]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all'); // all | unread

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? '?unread=true' : '';
      const { data } = await api.get(`/admin/messages${params}`);
      setMessages(data.messages);
    } catch {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      await api.patch(`/admin/messages/${msg._id}/read`);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
    }
  };

  const markReplied = async (id) => {
    await api.patch(`/admin/messages/${id}/replied`);
    setMessages(prev => prev.map(m => m._id === id ? { ...m, replied: true, read: true } : m));
    if (selected?._id === id) setSelected(s => ({ ...s, replied: true }));
    toast.success('Marked as replied.');
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/admin/messages/${id}`);
    setMessages(prev => prev.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
    toast.success('Message deleted.');
  };

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <div className={styles.filters}>
          {['all', 'unread'].map(f => (
            <button key={f} className={`${styles.filter} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.split}>
        {/* LEFT: list */}
        <div className={styles.list}>
          {loading && <div className={styles.empty}>Loading…</div>}
          {!loading && messages.length === 0 && <div className={styles.empty}>No messages found.</div>}
          {messages.map(msg => (
            <div
              key={msg._id}
              className={`${styles.item} ${!msg.read ? styles.unread : ''} ${selected?._id === msg._id ? styles.selected : ''}`}
              onClick={() => openMessage(msg)}
            >
              <div className={styles.itemTop}>
                <span className={styles.itemName}>{msg.name}</span>
                <span className={styles.itemDate}>{fmt(msg.createdAt)}</span>
              </div>
              <div className={styles.itemEmail}>{msg.email}</div>
              <div className={styles.itemPreview}>{msg.message.slice(0, 80)}…</div>
              <div className={styles.itemBadges}>
                {msg.service && <span className={styles.badge}>{msg.service}</span>}
                {msg.budget  && <span className={styles.badge}>{msg.budget}</span>}
                {msg.replied && <span className={`${styles.badge} ${styles.replied}`}>Replied</span>}
                {!msg.read   && <span className={`${styles.badge} ${styles.newBadge}`}>New</span>}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: detail */}
        <div className={styles.detail}>
          {!selected ? (
            <div className={styles.empty}>Select a message to read</div>
          ) : (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <div className={styles.detailName}>{selected.name}</div>
                  <a href={`mailto:${selected.email}`} className={styles.detailEmail}>{selected.email}</a>
                </div>
                <div className={styles.detailActions}>
                  {!selected.replied && (
                    <button className={styles.btnPrimary} onClick={() => markReplied(selected._id)}>
                      Mark Replied
                    </button>
                  )}
                  <button className={styles.btnDanger} onClick={() => deleteMessage(selected._id)}>Delete</button>
                </div>
              </div>

              <div className={styles.detailMeta}>
                <div className={styles.metaItem}><span>Budget</span><strong>{selected.budget || '—'}</strong></div>
                <div className={styles.metaItem}><span>Service</span><strong>{selected.service || '—'}</strong></div>
                <div className={styles.metaItem}><span>Received</span><strong>{fmt(selected.createdAt)}</strong></div>
              </div>

              <div className={styles.detailBody}>
                <div className={styles.bodyLabel}>Message</div>
                <div className={styles.bodyText}>{selected.message}</div>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: Your portfolio inquiry`}
                className={styles.replyLink}
                onClick={() => markReplied(selected._id)}
              >
                ✉ &nbsp;Reply via Email →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
