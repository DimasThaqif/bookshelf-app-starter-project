const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const editModal = document.getElementById('editModal');
const closeEditModal = document.querySelector('.close-edit');
const editForm = document.getElementById('editForm');

let currentEditBookId = null;

// Memeriksa dan memuat data dari Local Storage
document.addEventListener('DOMContentLoaded', () => {
  if (checkStorage()) {
    loadDataFromStorage();
  }

  bookForm.addEventListener('submit', addBook);
  searchForm.addEventListener('submit', searchBook);
  closeEditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target == editModal) {
      editModal.style.display = 'none';
    }
  });
  editForm.addEventListener('submit', saveEditedBook);
});

// Fungsi Menambah Buku
function addBook(event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = document.getElementById('bookFormYear').value.trim();
  const isCompleted = document.getElementById('bookFormIsComplete').checked;

  if (title && author && year) {
    const bookObject = composeBookObject(title, author, year, isCompleted);
    books.push(bookObject);
    updateDataToStorage();
    bookForm.reset();
  } else {
    alert('Silakan isi semua field.');
  }
}

// Fungsi Membuat Elemen Buku
function makeBook(book) {
  const bookElement = document.createElement("div");
  bookElement.className = "bookItem";
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem"); 

  const titleElement = document.createElement("h3");
  titleElement.innerText = book.title;
  titleElement.setAttribute("data-testid", "bookItemTitle"); 

  const authorElement = document.createElement("p");
  authorElement.innerText = `Penulis: ${book.author}`;
  authorElement.setAttribute("data-testid", "bookItemAuthor"); 

  const yearElement = document.createElement("p");
  yearElement.innerText = `Tahun: ${book.year}`;
  yearElement.setAttribute("data-testid", "bookItemYear"); 

  const toggleButton = document.createElement("button");
  toggleButton.innerText = book.isCompleted ? "Belum Selesai Dibaca" : "Selesai Dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton"); 
  toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton"); 
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const buttonContainer = document.createElement("div");
  buttonContainer.append(toggleButton, deleteButton);

  bookElement.append(titleElement, authorElement, yearElement, buttonContainer);

  return bookElement;
}



// Fungsi Menampilkan Buku
function displayBooks(bookArray) {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  bookArray.forEach(book => {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

// Fungsi Mengganti Status Buku
function toggleBookStatus(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = !book.isComplete; 
    updateDataToStorage(); 
  }
}

// Menghapus Buku
function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    updateDataToStorage();
  }
}

/// Membuka Modal Edit Buku
function openEditModal(bookId) {
  currentEditBookId = bookId;
  const book = findBook(bookId);
  if (book) {
    document.getElementById('editFormTitle').value = book.title;
    document.getElementById('editFormAuthor').value = book.author;
    document.getElementById('editFormYear').value = book.year;
    document.getElementById('editFormIsComplete').checked = book.isComplete;
    editModal.style.display = 'block';
  }
}

// Menyimpan Buku yang Diedit
function saveEditedBook(event) {
  event.preventDefault();

  const title = document.getElementById('editFormTitle').value.trim();
  const author = document.getElementById('editFormAuthor').value.trim();
  const year = document.getElementById('editFormYear').value.trim();
  const isCompleted = document.getElementById('editFormIsComplete').checked;

  if (title && author && year) {
    const book = findBook(currentEditBookId);
    if (book) {
      book.title = title;
      book.author = author;
      book.year = year;
      book.isCompleted = isCompleted;
      updateDataToStorage();
      editModal.style.display = 'none';
    }
  } else {
    alert('Silakan isi semua field.');
  }
}

// Fungsi Pencarian Buku
function searchBook(event) {
  event.preventDefault();
  const query = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.bookTitle.toLowerCase().includes(query));
  displayBooks(filteredBooks);
}

// Fungsi untuk Menyusun Objek Buku
function composeBookObject(title, author, year, isCompleted) {
  return {
    id: +new Date(), // ID unik
    title, // Judul buku
    author, // Penulis buku
    year: parseInt(year, 10), // Tahun harus berupa number
    isComplete: isCompleted // Status selesai dibaca
  };
}

// Memuat dan Menyimpan Data dari Local Storage
const STORAGE_KEY = 'BOOK_APPS';
let books = [];

function checkStorage() {
  if (typeof(Storage) === undefined) {
    alert('Browser Anda tidak mendukung Web Storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  books = serializedData ? JSON.parse(serializedData) : [];
  displayBooks(books);
}

function updateDataToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  displayBooks(books);
}


function findBook(bookId) {
  return books.find(book => book.id === bookId);
}

function findBookIndex(bookId) {
  return books.findIndex(book => book.id === bookId);
}
