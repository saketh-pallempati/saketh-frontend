import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [updateData, setUpdateData] = useState({ email: '', name: '', age: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://crud-backend-lime.vercel.app/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://crud-backend-lime.vercel.app/users', formData);
      fetchUsers();
      setFormData({ name: '', email: '', age: '' });
    } catch (error) {
      alert('Error adding user: ' + error.response.data.error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://crud-backend-lime.vercel.app/users?email=${updateData.email}`, { name: updateData.name, age: updateData.age });
      fetchUsers();
      setUpdateData({ email: '', name: '', age: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (email) => {
    try {
      await axios.delete(`https://crud-backend-lime.vercel.app/users?email=${email}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClick = (user) => {
    setUpdateData({ email: user.email, name: user.name, age: user.age });
    setShowModal(true);
  };

  return (
    <div className="App">
      <div className={showModal ? 'blur' : ''}>
        <div className="main-content">
          <div className="form-section">
            <h2>Add User</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="number"
                required
                placeholder="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faUserPlus} /> Add User
              </button>
            </form>
          </div>

          <div className="user-section">
            <h1>Users</h1>
            <div className="user-cards">
              {users.map(user => (
                <div className="user-card" key={user._id}>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p>Age: {user.age}</p>
                  </div>
                  <div className="user-actions">
                    <button onClick={() => handleEditClick(user)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteUser(user.email)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>Update User</h2>
        <form onSubmit={handleUpdateUser}>
          <input
            type="text"
            placeholder="New Name"
            value={updateData.name}
            onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="New Age"
            value={updateData.age}
            onChange={(e) => setUpdateData({ ...updateData, age: e.target.value })}
          />
          <button type="submit">Update User</button>
        </form>
      </Modal>
    </div>
  );
}

export default App;