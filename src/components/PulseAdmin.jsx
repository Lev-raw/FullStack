import { useEffect, useState } from 'react';
import {
  createPulsePost,
  deletePulsePost,
  fetchPulsePosts,
  updatePulsePost,
} from '../api/pulseApi';
import PulsePostForm from './PulsePostForm';

const formatPulseDate = (dateValue) => {
  if (!dateValue) {
    return '—';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};

function PulseAdmin() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const response = await fetchPulsePosts();
      setPosts(Array.isArray(response) ? response : []);
      setError('');
    } catch (loadError) {
      setPosts([]);
      setError(loadError.message || 'Unable to load posts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setError('');
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingPost) {
        await updatePulsePost(editingPost.id, payload);
      } else {
        await createPulsePost(payload);
      }

      await loadPosts();
      resetForm();
    } catch (submitError) {
      const message = submitError.message || 'Unable to save post.';
      setError(message);
      throw submitError;
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this Pulse & Page post?',
    );
    if (!confirmed) {
      return;
    }

    try {
      await deletePulsePost(postId);
      await loadPosts();
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete post.');
    }
  };

  return (
    <section className="pulse-admin-page">
      <div className="pulse-admin-header">
        <h2>PULSE &amp; PAGE CMS</h2>
        <button
          type="button"
          className="pulse-admin-add"
          onClick={() => {
            setEditingPost(null);
            setShowForm(true);
            setError('');
          }}
        >
          + ADD NEW POST
        </button>
      </div>

      {showForm ? (
        <PulsePostForm
          initialValues={editingPost}
          submitLabel={editingPost ? 'UPDATE' : 'SAVE'}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      ) : null}

      {error ? <p className="pulse-admin-error">{error}</p> : null}

      <div className="pulse-admin-list">
        {isLoading ? (
          <p>Loading Pulse &amp; Page posts...</p>
        ) : posts.length === 0 ? (
          <p className="pulse-admin-error">No Pulse &amp; Page posts available.</p>
        ) : (
          posts.map((post) => (
            <article className="pulse-admin-card" key={post.id || post.title}>
              {post.image ? (
                <img src={post.image} alt={post.title || 'Pulse post'} />
              ) : (
                <div className="pulse-admin-thumb-fallback" aria-hidden="true" />
              )}
              <div>
                <h3>{post.title || 'Untitled post'}</h3>
                <p>{formatPulseDate(post.date)}</p>
              </div>
              <div className="pulse-admin-actions">
                <button
                  type="button"
                  className="pulse-admin-button"
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="pulse-admin-delete"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default PulseAdmin;
