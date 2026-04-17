import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <h2>Contact Us</h2>
                <p>Email: support@dailyharvest.com</p>
                <p>Phone: (555) 123-4567</p>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
