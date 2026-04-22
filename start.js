const { spawn } = require('child_process');
const path = require('path');

// Start Python backend
console.log('Starting Python backend...');
const backend = spawn('python', ['backend/app.py'], {
  cwd: __dirname,
  stdio: 'inherit'
});

backend.on('error', (error) => {
  console.error('Failed to start backend:', error);
});

// Start React frontend after a delay
setTimeout(() => {
  console.log('Starting React frontend...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  frontend.on('error', (error) => {
    console.error('Failed to start frontend:', error);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    backend.kill();
    frontend.kill();
    process.exit();
  });
}, 3000); // Wait 3 seconds for backend to start
