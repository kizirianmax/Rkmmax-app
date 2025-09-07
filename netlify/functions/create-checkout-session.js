} catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: err.message || "Erro interno ao criar checkout",
      }),
    };
  }
};
