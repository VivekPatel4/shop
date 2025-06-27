const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    // Read fields directly from req.body (flat structure)
    const { email, firstName, lastName, amount } = req.body;
    // Use the amount sent from frontend (in dollars), convert to cents
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    const stripeAmount = Math.round(Number(amount) * 100); // convert to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: 'usd',
      metadata: {
        email: email,
        name: `${firstName} ${lastName}`
      }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
