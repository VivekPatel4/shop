import React, { useState, useEffect } from 'react';
import { orderService, cartService } from '../../../Data/api';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RdNiA06Mq1SXMMd8FLiQrjOkObqGPo1s2pMnpGmYZe2qqqf32LFO6kBSahCB7i1en5TmYP23HhNisXYb5aOj3Bx006Rfxmqm8'); // TODO: Replace with your public key

const CheckoutForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cardError, setCardError] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    // Fetch cart total on mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await cartService.getCart();
                setCartTotal(response.data.totalPrice || 0);
            } catch (err) {
                setError('Failed to fetch cart total.');
            }
        };
        fetchCart();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setCardError(null);

        if (!stripe || !elements) {
            setCardError('Stripe has not loaded yet.');
            setLoading(false);
            return;
        }

        try {
            // 1. Create PaymentIntent on the server
            const paymentIntentReq = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                mobile: formData.mobile,
                amount: cartTotal // Use the fetched cart total
            };
            const token = localStorage.getItem('token'); // Get token from localStorage
            const paymentIntentRes = await fetch('/api/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentIntentReq)
            });
            const { clientSecret } = await paymentIntentRes.json();

            // 2. Confirm card payment
            const cardElement = elements.getElement(CardElement);
            const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        address: {
                            line1: formData.streetAddress,
                            city: formData.city,
                            state: formData.state,
                            postal_code: formData.zipCode
                        }
                    }
                }
            });

            if (stripeError) {
                setCardError(stripeError.message);
                setLoading(false);
                return;
            }

            // 3. Place order in your system (flat object, not nested)
            await orderService.createOrder({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                mobile: formData.mobile,
                paymentIntentId: paymentIntent.id
            });
            navigate('/order-confirmation');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
                {/* Stripe Test Mode Banner */}
                <div className="mb-6 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                    <strong>Test Mode:</strong> Payments are running in Stripe test mode.<br/>
                    Use the following test card numbers for successful payments:<br/>
                    <ul className="list-disc ml-6 mt-2 text-sm">
                        <li><b>Visa:</b> 4242 4242 4242 4242 (any future date, any CVC)</li>
                        <li><b>Mastercard:</b> 5555 5555 5555 4444 (any future date, any CVC)</li>
                        <li><b>3D Secure:</b> 4000 0027 6000 3184 (any future date, any CVC)</li>
                        <li><b>Failed payment:</b> 4000 0000 0000 9995 (any future date, any CVC)</li>
                    </ul>
                    <span className="text-xs text-gray-600">See more test cards in <a href="https://stripe.com/docs/testing" target="_blank" rel="noopener noreferrer" className="underline">Stripe Docs</a>.</span>
                </div>
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Checkout</h2>
                {error && <div className="text-red-600 mb-4 text-center font-semibold bg-red-100 p-2 rounded">{error}</div>}
                {cardError && <div className="text-red-600 mb-4 text-center font-semibold bg-red-100 p-2 rounded">{cardError}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="my-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                        <div className="border border-gray-300 rounded-md p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !stripe}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Checkout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default Checkout;
