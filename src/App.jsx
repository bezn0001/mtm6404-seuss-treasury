import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Fetch and display books list
const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('https://seussology.info/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <div>
      <h1>Seuss Treasury</h1>
      <div className="books-container">
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <Link to={`/book/${book.id}`}>
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fetch and display book details
const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://seussology.info/api/books/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch book details (HTTP ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!book) return <p>No book details available.</p>;

  return (
    <div className="book-details">
      <img src={book.image} alt={book.title} />
      <div>
        <h1>{book.title}</h1>
        <p>{book.description}</p>
      </div>
    </div>
  );
};

// Fetch and display quotes
const Quotes = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch('https://seussology.info/api/quotes/random/10')
      .then((response) => response.json())
      .then((data) => setQuotes(data))
      .catch((error) => console.error('Error fetching quotes:', error));
  }, []);

  return (
    <div className="quotes-container">
      <h1>Seuss Quotes</h1>
      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          <div key={index} className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">— {quote.author || "Seuss Treasury"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define routes and navigation
function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Books</Link></li>
          <li><Link to="/quotes">Quotes</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/quotes" element={<Quotes />} />
      </Routes>
    </Router>
  );
}

export default App;
