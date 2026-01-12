const fetchUsers = async () => {
  const response = await fetch('http://localhost:3000/rpc/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getUsers',
      id: 1,
    }),
  });

  const data = await response.json();
  console.log(data);
};

fetchUsers();
