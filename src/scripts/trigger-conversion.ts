async function triggerConversion() {
  try {
    const response = await fetch('/api/convert-quiz', {
      method: 'POST'
    });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error triggering conversion:', error);
  }
}

// You can call this from your admin panel or development tools 