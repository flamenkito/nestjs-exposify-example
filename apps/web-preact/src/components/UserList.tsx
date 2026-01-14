import {
  users,
  loading,
  selectedUser,
  selectUser,
  showCreateForm,
  editing,
} from '../hooks/useJsonRpc';
import { UserCard } from './UserCard';
import { UserForm } from './UserForm';

export function UserList() {
  return (
    <div class="user-list-container">
      <div class="table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {loading.value && users.value.length === 0 ? (
              <tr>
                <td colSpan={2} class="table-placeholder">Loading users...</td>
              </tr>
            ) : users.value.length === 0 ? (
              <tr>
                <td colSpan={2} class="table-placeholder">No users found</td>
              </tr>
            ) : (
              users.value.map((user) => (
                <tr
                  key={user.id}
                  class={selectedUser.value?.id === user.id ? 'selected' : ''}
                  onClick={() => selectUser(user)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateForm.value ? (
        <UserForm />
      ) : editing.value && selectedUser.value ? (
        <UserForm user={selectedUser.value} />
      ) : selectedUser.value ? (
        <UserCard user={selectedUser.value} />
      ) : null}
    </div>
  );
}
