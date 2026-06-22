import fs from 'fs';
import path from 'path';

// This won't work easily to read console logs unless they are captured.
// But wait, Nodemon output is not in a file unless piped.
console.log("Cannot read nodemon console logs directly.");
