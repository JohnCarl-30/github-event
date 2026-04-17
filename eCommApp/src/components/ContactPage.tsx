import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <p className="contact-intro">We would love to hear from you. Reach out anytime using the details below or send us a message.</p>
                    <div className="contact-details">
                        <p>Email: support@thedailyharvest.com</p>
                        <p>Phone: (555) 123-4567</p>
                        <p>Address: 123 Harvest Lane, Freshville, CA 90210</p>
                    </div>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="contact-name">Your Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                    setIsSubmitted(false);
                                }}
                                placeholder="John Smith"
                                aria-required="true"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-email">Your Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setIsSubmitted(false);
                                }}
                                placeholder="name@example.com"
                                aria-required="true"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-message">Your Message</label>
                            <textarea
                                id="contact-message"
                                value={message}
                                onChange={(event) => {
                                    setMessage(event.target.value);
                                    setIsSubmitted(false);
                                }}
                                placeholder="Tell us how we can help..."
                                rows={4}
                                aria-required="true"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                    {isSubmitted && <p role="status" className="contact-success">Thanks for reaching out! We will get back to you soon.</p>}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
