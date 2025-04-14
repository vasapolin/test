const http = require('http');

function checkHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/status',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Status code: ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function main() {
  const maxAttempts = 30;
  const delay = 1000; // 1 segundo

  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Intento ${i + 1} de ${maxAttempts} para verificar la salud de la aplicación...`);
    
    try {
      await checkHealth();
      console.log('¡La aplicación está saludable!');
      process.exit(0);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      console.log(`Esperando ${delay}ms antes del siguiente intento...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.error('La aplicación no está respondiendo después de varios intentos');
  process.exit(1);
}

main(); 