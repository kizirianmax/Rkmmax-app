// netlify/functions/status.js
exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      uptime: process.uptime(),
      timestamp: Date.now(),
    }),
  };
};
