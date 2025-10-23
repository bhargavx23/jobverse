import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import BooksTable from "../components/home/BooksTable";
import BooksCard from "../components/home/BooksCard";
import Footer from "../components/Footer";
import {
  FaBook,
  FaUsers,
  FaStar,
  FaSearch,
  FaPlus,
  FaRocket,
  FaHeart,
  FaLightbulb,
  FaAward,
} from "react-icons/fa";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalGenres: 0,
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:30000/books")
      .then((response) => {
        const booksData = response.data.data;
        setBooks(booksData);
        setFilteredBooks(booksData);

        // Calculate stats
        const totalBooks = booksData.length;
        const authors = new Set(booksData.map((book) => book.author));
        const genres = new Set(booksData.flatMap((book) => book.genre || []));
        setStats({
          totalBooks,
          totalAuthors: authors.size,
          totalGenres: genres.size,
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header Section */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-lg"
            >
              <FaRocket className="text-purple-600" />
              <span className="text-purple-700 font-medium">
                Discover Your Next Read
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gradient"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              BookVerse
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your Personal Universe of Literary Treasures. Explore, discover,
              and manage your book collection.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <FaBook className="text-3xl text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalBooks}
              </div>
              <div className="text-gray-600">Books in Collection</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <FaUsers className="text-3xl text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalAuthors}
              </div>
              <div className="text-gray-600">Authors</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <FaStar className="text-3xl text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalGenres}
              </div>
              <div className="text-gray-600">Genres</div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex justify-center gap-4 mb-16"
          >
            <Link
              to="/books/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <FaPlus />
              Add New Book
            </Link>
            <Link
              to="#collection"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Browse Collection
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Filters */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-12 bg-white rounded-3xl shadow-xl p-8 -mt-8 relative z-10"
          id="collection"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl" />
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  showType === "table"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white text-purple-600 hover:bg-purple-50 shadow-md"
                }`}
                onClick={() => setShowType("table")}
              >
                Table View
              </motion.button>
              <motion.button
                className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  showType === "card"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white text-purple-600 hover:bg-purple-50 shadow-md"
                }`}
                onClick={() => setShowType("card")}
              >
                Card View
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Books Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-xl"
            >
              <FaBook className="text-6xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {books.length === 0
                  ? "No books in your collection yet"
                  : "No books match your search"}
              </h3>
              <p className="text-gray-500 text-lg mb-8">
                {books.length === 0
                  ? "Start building your literary universe by adding your first book."
                  : "Try adjusting your search terms."}
              </p>
              {books.length === 0 && (
                <Link
                  to="/books/create"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200"
                >
                  Add Your First Book
                </Link>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredBooks.length} Book
                  {filteredBooks.length !== 1 ? "s" : ""} Found
                </h2>
              </div>

              {showType === "table" ? (
                <BooksTable books={filteredBooks} />
              ) : (
                <BooksCard books={filteredBooks} />
              )}
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
