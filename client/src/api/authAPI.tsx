export const login = async (loginData: { username: string; password: string }) => {
  try {
    // Log the exact data being sent
    console.log('Sending login request with data:', {
      ...loginData,
      password: loginData.password ? '[REDACTED]' : undefined
    });

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: response.url,
        requestData: {
          ...loginData,
          password: '[REDACTED]'
        }
      });
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};