// Suppress ReactQuill findDOMNode warnings globally
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('findDOMNode') || 
     args[0].includes('Warning: findDOMNode'))
  ) {
    return;
  }
  originalError(...args);
};

export {};