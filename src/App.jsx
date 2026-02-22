// Вместо немедленного создания в actx()
let actxPromise = null;
const getAudioContext = () => {
  if (!actxPromise) {
    actxPromise = new Promise((resolve) => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return resolve(null);
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        const resume = () => {
          ctx.resume().then(() => {
            document.removeEventListener('click', resume);
            resolve(ctx);
          });
        };
        document.addEventListener('click', resume, { once: true });
      } else {
        resolve(ctx);
      }
    });
  }
  return actxPromise;
};
