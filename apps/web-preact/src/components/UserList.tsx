import { editing, loading, selectedUser, selectUser, showCreateForm, users } from '../hooks/useJsonRpc';
import { UserCard } from './UserCard';
import { UserForm } from './UserForm';

import type { JSX } from 'preact';

function renderTableBody(): JSX.Element {
  if (loading.value && users.value.length === 0) {
    return (
      <tr>
        <td colSpan={2} class="table-placeholder">
          Loading users...
        </td>
      </tr>
    );
  }

  if (users.value.length === 0) {
    return (
      <tr>
        <td colSpan={2} class="table-placeholder">
          No users found
        </td>
      </tr>
    );
  }

  return (
    <>
      {users.value.map((user) => (
        <tr key={user.id} class={selectedUser.value?.id === user.id ? 'selected' : ''} onClick={() => selectUser(user)}>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </>
  );
}

function renderDetailPanel() {
  if (showCreateForm.value) {
    return <UserForm mode="create" />;
  }
  if (editing.value && selectedUser.value) {
    return <UserForm mode="edit" user={selectedUser.value} />;
  }
  if (selectedUser.value) {
    return <UserCard user={selectedUser.value} />;
  }
  return null;
}

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
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {renderDetailPanel()}
    </div>
  );
}
