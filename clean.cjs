const fs = require('fs');
try {
    fs.rmSync('node_modules', { recursive: true, force: true });
    console.log('Successfully deleted node_modules');
} catch (e) {
    console.error("Failed to delete node_modules:", e);
}
