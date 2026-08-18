document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // HOME PAGE LOGIC
  // ===============================
  let allBooks = [];
  let filteredBooks = [];
  let currentPage = 1;

  const grid = document.getElementById('book-grid');
  const searchInput = document.getElementById('search-input');
  const paginationControls = document.getElementById('pagination-controls');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageNumbers = document.getElementById('page-numbers');

  // Force carousel width on mobile
  function forceCarouselWidth() {
    const isMobile = window.innerWidth <= 480;
    const carouselSection = document.querySelector('.carousel-section');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (isMobile && carouselSection && carouselContainer) {
      const maxWidth = window.innerWidth - 16;
      carouselSection.style.maxWidth = maxWidth + 'px';
      carouselContainer.style.maxWidth = maxWidth + 'px';
      carouselContainer.style.width = maxWidth + 'px';
    }
  }

  window.addEventListener('resize', forceCarouselWidth);

  // ===============================
  // CAROUSEL VARIABLES
  // ===============================
  let carouselBooks = [];
  let currentSlide = 0;
  let carouselInterval = null;
  let isTransitioning = false;
  const carouselTrack = document.getElementById('carousel-track');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');
  const carouselIndicators = document.getElementById('carousel-indicators');
  const carouselContainer = document.getElementById('carousel-container');

  // List of 20 featured books to show in carousel
  const featuredBooks = [
    "A Court of Splintered Harmony",
    "The Names",
    "Threshing Day (Limited Deluxe Edition)",
    "Gruffalo Granny",
    "The Correspondent",
    "Verity",
    "Atomic Habits",
    "Yesteryear",
    "The Wedding People",
    "We Chase Shadows",
    "Never Lie",
    "Guess How Much I Love You",
    "The Cauldron: The Making of the Modern Middle East",
    "London Falling",
    "Sticker Dolly Dressing K-POP",
    "It's Not What You Think",
    "The Courage To Be Disliked",
    "Broken Country",
    "Great and Unfortunate Things",
    "The Let Them Theory",
  ];

  // Complete hardcoded mapping for ALL books with tricky filenames
  const imageMapping = {
    "First Writing Workbook Ages 3-5": "First Writing Workbook Ages 3-5.jpg",
    "Fourth Wing: The Graphic Novel, Volume One (Deluxe Edition)": "Fourth Wing The Graphic Novel Volume One Deluxe Edition.jpg",
    "Sticker Dolly Dressing K-POP": "Sticker Dolly Dressing K-POP.jpg",
    "Where's Spidey?: A Marvel Spider-Man Search & Find Book": "Wheres Spidey A Marvel Spider-Man Search Find Book.jpg",
    "We Solve Murders": "We Solve Murders.jpg",
    "Happy Birthday, Gruffalo!": "Happy Birthday Gruffalo.jpg",
    "Murdle: Solve 100 Devilishly Devious Murder Mystery Logic Puzzles": "Murdle Solve 100 Devilishly Devious Murder Mystery Logic Puzzles.jpg",
    "Threshing Day (Limited Deluxe Edition)": "Threshing Day Limited Deluxe Edition.jpg",
    "FAKE NEWS: THE SECRET DEAL BETWEEN GOVERNMENT AND THE MEDIA": "FAKE NEWS THE SECRET DEAL BETWEEN GOVERNMENT AND THE MEDIA.jpg",
    "Murdoku: 80 Murder Mystery Logic Puzzles": "Murdoku 80 Murder Mystery Logic Puzzles.jpg",
    "Where are Woody and Buzz?": "Where are Woody and Buzz.jpg",
    "The Cauldron: The Making of the Modern Middle East": "The Cauldron The Making of the Modern Middle East.jpg",
    "CGP Summer Holidays Activity Workbook - for kids between Reception and Year 1": "CGP Summer Holidays Activity Workbook for kids between Reception and Year 1.jpg",
    "The From Scratch Kitchen": "The From Scratch Kitchen.jpg",
    "Atmosphere: A Love Story": "Atmosphere A Love Story.jpg",
    "Theo of Golden": "Theo of Golden.jpg",
    "How Lucky Am I": "How Lucky Am I.jpg",
    "Jonty Gentoo - The Adventures of a Penguin": "Jonty Gentoo The Adventures of a Penguin.jpg",
    "The History of Mankind in Its Entirety (Abridged): An Unsupervised PhD": "The History of Mankind in Its Entirety Abridged An Unsupervised PhD.jpg",
    "Disney Princess: The Ultimate Colouring Book": "Disney Princess The Ultimate Colouring Book.jpg",
    "To the Women - The New Collection of Wise Words Every Woman Needs": "To the Women The New Collection of Wise Words Every Woman Needs.jpg",
    "Girl Moments": "Girl Moments.jpg",
    "Fourth Wing": "Fourth Wing.jpg",
    "Iron Flame": "Iron Flame.jpg",
    "Odyssey": "Odyssey.jpg",
    "The Odyssey": "The Odyssey.jpg",
    "Murdle": "Murdle.jpg",
    "Agrippa": "Agrippa.jpg",
    "An Inspector Calls": "An Inspector Calls.jpg",
    "Atmosphere": "Atmosphere.jpg",
    "Atomic Habits": "Atomic Habits.jpg",
    "Binding 13": "Binding 13.jpg",
    "Bored of Lunch Prep & Go": "Bored of Lunch Prep Go.jpg",
    "Brain Damage": "Brain Damage.jpg",
    "Broken Country": "Broken Country.jpg",
    "Careless People": "Careless People.jpg",
    "Cozy Corner": "Cozy Corner.jpg",
    "Cozy Days": "Cozy Days.jpg",
    "Cozy Friends": "Cozy Friends.jpg",
    "Dear Zoo": "Dear Zoo.jpg",
    "Do Not Disturb": "Do Not Disturb.jpg",
    "Fake News": "Fake News.jpg",
    "Great and Unfortunate Things": "Great and Unfortunate Things.jpg",
    "Guess How Much I Love You": "Guess How Much I Love You.jpg",
    "House of Earth and Blood": "House of Earth and Blood.jpg",
    "House of Flame and Shadow": "House of Flame and Shadow.jpg",
    "House of Sky and Breath": "House of Sky and Breath.jpg",
    "Keeping 13": "Keeping 13.jpg",
    "Kitchen Confidential": "Kitchen Confidential.jpg",
    "Land": "Land.jpg",
    "London Falling": "London Falling.jpg",
    "My Friends": "My Friends.jpg",
    "My Husband's Wife": "My Husbands Wife.jpg",
    "Never Lie": "Never Lie.jpg",
    "No More Nappies": "No More Nappies.jpg",
    "Odyssey - Stephen Fry": "Odyssey Stephen Fry.jpg",
    "On the Farm": "On the Farm.jpg",
    "One by One": "One by One.jpg",
    "Onyx Storm": "Onyx Storm.jpg",
    "Ottolenghi Simple Too": "Ottolenghi Simple Too.jpg",
    "Pinch of Nom Meal Prep": "Pinch of Nom Meal Prep.jpg",
    "Project Hail Mary": "Project Hail Mary.jpg",
    "Ready for My Potty": "Ready for My Potty.jpg",
    "Regime Change": "Regime Change.jpg",
    "A Court of Forgotten Melody": "A Court of Forgotten Melody.jpg",
    "A Court of Frost and Starlight": "A Court of Frost and Starlight.jpg",
    "A Court of Silver Flames": "A Court of Silver Flames.jpg",
    "A Court of Splintered Harmony": "A Court of Splintered Harmony.jpg",
    "A Court of Thorns and Roses": "A Court of Thorns and Roses.jpg",
    "A Court of Wings and Ruin": "A Court of Wings and Ruin.jpg",
    "Girl Moments - Cute & Comfy Colouring Book": "Girl Moments Cute Comfy Colouring Book.jpg",
    "The Psychology of Money": "The Psychology of Money.jpg",
    "It's Not What You Think": "Its Not What You Think.jpg",
    "Gruffalo Granny": "Gruffalo Granny.jpg",
    "The Greatest Secret": "The Greatest Secret.jpg",
    "The Everyday Hero": "The Everyday Hero.jpg",
    "The 5 AM Club": "The 5 AM Club.jpg",
    "The Midnight Library": "The Midnight Library.jpg",
    "The Alchemist": "The Alchemist.jpg",
    "The 7 Habits of Highly Effective People": "The 7 Habits of Highly Effective People.jpg",
    "Rich Dad Poor Dad": "Rich Dad Poor Dad.jpg",
    "Think and Grow Rich": "Think and Grow Rich.jpg",
    "The Art of War": "The Art of War.jpg",
    "How to Win Friends": "How to Win Friends.jpg",
    "The 48 Laws of Power": "The 48 Laws of Power.jpg",
    "The Intelligent Investor": "The Intelligent Investor.jpg",
    "Good to Great": "Good to Great.jpg"
  };

  function getImageFilename(bookTitle) {
    if (!bookTitle) return null;
    if (imageMapping[bookTitle]) {
      return imageMapping[bookTitle];
    }
    let cleaned = bookTitle
      .replace(/:/g, '')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/\?/g, '')
      .replace(/!/g, '')
      .replace(/\//g, ' ')
      .replace(/-/g, ' ')
      .replace(/&/g, 'and')
      .replace(/,/g, '')
      .replace(/\./g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return `${cleaned}.jpg`;
  }

  function getItemsPerPage() {
    return window.innerWidth <= 480 ? 10 : 25;
  }

  function parseCSVRow(text) {
    let result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map(val => val.replace(/^"|"$/g, '').trim());
  }

  // ===============================
  // FORCE EQUAL HEIGHTS
  // ===============================
  function forceEqualHeights() {
    const cards = document.querySelectorAll('.book-card');
    if (cards.length === 0) return;
    
    cards.forEach(card => {
      card.style.height = 'auto';
    });
    
    requestAnimationFrame(() => {
      let maxHeight = 0;
      cards.forEach(card => {
        const height = card.offsetHeight;
        if (height > maxHeight) maxHeight = height;
      });
      cards.forEach(card => {
        card.style.height = maxHeight + 'px';
      });
    });
  }

  // ===============================
  // RENDER BOOKS
  // ===============================
  function renderBooks(books) {
    if (!grid) return;
    grid.innerHTML = '';
    if (books.length === 0) {
      grid.innerHTML = `<div class="no-results">No books found matching your search.</div>`;
      return;
    }

    books.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      const encodedName = encodeURIComponent(book.name);
      const encodedAuthor = encodeURIComponent(book.author);
      const encodedYear = encodeURIComponent(book.releaseYear);
      const encodedRank = encodeURIComponent(book.rank);

      card.onclick = () => {
        window.location.href = `download.html?book=${encodedName}&author=${encodedAuthor}&year=${encodedYear}&rank=${encodedRank}`;
      };

      const imageFilename = getImageFilename(book.name);
      const imagePath = `images/${imageFilename}`;
      const placeholderPath = `images/placeholder.jpg`;
      const displayYear = book.releaseYear && book.releaseYear.trim() !== '' ? book.releaseYear : '2026';

      card.innerHTML = `
        <img src="${imagePath}" alt="${book.name} cover" class="book-cover" 
             onerror="this.onerror=null; this.src='${placeholderPath}';">
        <div class="card-content">
          <div class="card-top-info">
            <span class="rank-badge">#${book.rank}</span>
            <span class="release-year">${displayYear}</span>
          </div>
          <h3 class="book-title" title="${book.name}">${book.name}</h3>
          <p class="book-author">By ${book.author}</p>
        </div>
        <button class="download-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Get PDF
        </button>
      `;
      grid.appendChild(card);
    });
    
    setTimeout(forceEqualHeights, 100);
  }

  // ===============================
  // PAGINATION
  // ===============================
  function renderPagination(totalPages) {
    if (!pageNumbers) return;
    pageNumbers.innerHTML = '';

    const isMobile = window.innerWidth <= 480;
    const maxVisible = isMobile ? 3 : 5;

    addPageNumber(1);

    if (totalPages <= maxVisible + 2) {
      for (let i = 2; i <= totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      let startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisible / 2));

      if (currentPage <= maxVisible) {
        endPage = maxVisible;
      }
      if (currentPage > totalPages - maxVisible) {
        startPage = totalPages - maxVisible + 1;
      }

      if (startPage > 2) {
        addEllipsis();
      }

      for (let i = startPage; i <= endPage; i++) {
        addPageNumber(i);
      }

      if (endPage < totalPages - 1) {
        addEllipsis();
      }

      if (totalPages > 1) {
        addPageNumber(totalPages);
      }
    }

    function addPageNumber(num) {
      const span = document.createElement('span');
      span.className = 'page-number' + (num === currentPage ? ' active' : '');
      span.textContent = num;
      span.onclick = () => {
        if (num !== currentPage) {
          currentPage = num;
          updateView();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
      pageNumbers.appendChild(span);
    }

    function addEllipsis() {
      const span = document.createElement('span');
      span.className = 'page-number ellipsis';
      span.textContent = '…';
      pageNumbers.appendChild(span);
    }
  }

  function updateView() {
    if (!grid || !paginationControls || !prevBtn || !nextBtn) return;
    
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    renderBooks(currentBooks);

    if (filteredBooks.length > itemsPerPage) {
      paginationControls.style.display = 'flex';
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      renderPagination(totalPages);
    } else {
      paginationControls.style.display = 'none';
    }
  }

  function changePage(direction) {
    currentPage += direction;
    updateView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===============================
  // CAROUSEL - INFINITE LOOP
  // ===============================
  function setupCarousel() {
    if (!carouselTrack || !carouselPrev || !carouselNext) return;

    carouselBooks = allBooks.filter(book => featuredBooks.includes(book.name));

    if (carouselBooks.length < 20) {
      const remaining = allBooks.filter(book => !featuredBooks.includes(book.name));
      const shuffled = remaining.sort(() => Math.random() - 0.5);
      const needed = 20 - carouselBooks.length;
      carouselBooks = [...carouselBooks, ...shuffled.slice(0, needed)];
    }

    while (carouselBooks.length < 20) {
      carouselBooks = [...carouselBooks, ...carouselBooks];
    }

    renderCarousel();
    updateCarouselIndicators();

    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
      nextSlide();
    }, 400);

    carouselPrev.onclick = () => {
      if (!isTransitioning) prevSlide();
    };
    carouselNext.onclick = () => {
      if (!isTransitioning) nextSlide();
    };

    carouselContainer.addEventListener('mouseenter', () => {
      if (carouselInterval) clearInterval(carouselInterval);
    });
    carouselContainer.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(() => {
        nextSlide();
      }, 400);
    });

    let touchStartX = 0;
    let touchEndX = 0;
    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 30;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });
  }

  function renderCarousel() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = '';

    const duplicatedBooks = [...carouselBooks, ...carouselBooks, ...carouselBooks];

    duplicatedBooks.forEach(book => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      const imageFilename = getImageFilename(book.name);
      const imagePath = `images/${imageFilename}`;
      const placeholderPath = `images/placeholder.jpg`;

      item.onclick = () => {
        const encodedName = encodeURIComponent(book.name);
        const encodedAuthor = encodeURIComponent(book.author);
        const encodedYear = encodeURIComponent(book.releaseYear);
        const encodedRank = encodeURIComponent(book.rank);
        window.location.href = `download.html?book=${encodedName}&author=${encodedAuthor}&year=${encodedYear}&rank=${encodedRank}`;
      };

      item.innerHTML = `
        <img src="${imagePath}" alt="${book.name} cover" onerror="this.onerror=null; this.src='${placeholderPath}';">
        <div class="carousel-title">${book.name}</div>
      `;
      carouselTrack.appendChild(item);
    });

    currentSlide = carouselBooks.length;
    updateCarouselPosition(false);
  }

  function updateCarouselPosition(animate = true) {
    if (!carouselTrack) return;
    const items = carouselTrack.children;
    if (items.length === 0) return;

    const isMobile = window.innerWidth <= 480;
    const itemsPerView = isMobile ? 3 : 6;
    const itemWidth = isMobile ? 76 : 136;
    const totalBooks = carouselBooks.length;
    const offset = currentSlide * itemWidth;

    carouselTrack.style.transition = animate ? 'transform 0.5s ease' : 'none';
    carouselTrack.style.transform = `translateX(-${offset}px)`;

    setTimeout(() => {
      if (currentSlide >= totalBooks * 2) {
        carouselTrack.style.transition = 'none';
        currentSlide = totalBooks;
        carouselTrack.style.transform = `translateX(-${currentSlide * itemWidth}px)`;
      } else if (currentSlide < totalBooks) {
        carouselTrack.style.transition = 'none';
        currentSlide = totalBooks * 2 - itemsPerView;
        carouselTrack.style.transform = `translateX(-${currentSlide * itemWidth}px)`;
      }
    }, animate ? 500 : 0);

    updateCarouselIndicators();
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide--;
    updateCarouselPosition(true);
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide++;
    updateCarouselPosition(true);
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function updateCarouselIndicators() {
    if (!carouselIndicators) return;
    const isMobile = window.innerWidth <= 480;
    const itemsPerView = isMobile ? 3 : 6;
    const totalItems = carouselBooks.length;
    const totalSlides = Math.max(1, Math.ceil(totalItems / itemsPerView));

    let currentIndex = Math.floor((currentSlide % totalItems) / itemsPerView);
    if (currentIndex >= totalSlides) currentIndex = 0;

    carouselIndicators.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.onclick = () => {
        if (!isTransitioning) {
          const targetSlide = i * itemsPerView + carouselBooks.length;
          currentSlide = targetSlide;
          updateCarouselPosition(true);
        }
      };
      carouselIndicators.appendChild(dot);
    }
  }

  // ===============================
  // NOTIFICATION SYSTEM
  // ===============================
  function setupNotifications() {
    const notificationToast = document.getElementById('notification-toast');
    const notificationUser = document.getElementById('notification-user');

    if (!notificationToast || !notificationUser) return;

    const userNames = [
      "sarah_m", "alex_r", "mike_k", "emma_w",
      "david_l", "jessica_t", "daniel_p", "sophia_b", "chris_h",
      "amanda_c", "james_o", "olivia_s", "ethan_v", "rachel_f"
    ];

    function showNotification() {
      const randomName = userNames[Math.floor(Math.random() * userNames.length)];
      
      let bookMessage = '';
      if (allBooks.length > 0) {
        const randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];
        bookMessage = `"${randomBook.name}"`;
      } else {
        const bookTitles = [
          "Atomic Habits", "The Psychology of Money", "The 48 Laws of Power",
          "How to Win Friends", "The Art of War", "Think and Grow Rich",
          "Rich Dad Poor Dad", "The Intelligent Investor", "The 7 Habits",
          "Good to Great"
        ];
        bookMessage = `"${bookTitles[Math.floor(Math.random() * bookTitles.length)]}"`;
      }
      
      notificationUser.innerText = `@${randomName} just unlocked ${bookMessage}`;
      notificationToast.classList.add("show");
      setTimeout(() => {
        notificationToast.classList.remove("show");
      }, 3000);
    }

    setTimeout(() => {
      showNotification();
      setInterval(showNotification, 8000);
    }, 1000);
  }

  // ===============================
  // HOME PAGE - LOAD BOOKS
  // ===============================
  if (grid && searchInput) {
    fetch('Bestsellers_Parsed_Full.csv')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(csvText => {
        const rows = csvText.split('\n').filter(row => row.trim() !== '');

        for (let i = 1; i < rows.length; i++) {
          const parts = parseCSVRow(rows[i]);
          if (parts.length >= 4) {
            const rank = parseInt(parts[0].trim(), 10);
            if (rank === 29 || rank === 58) continue;

            let releaseYear = parts[3].trim();
            if (releaseYear === '' || releaseYear.toLowerCase().includes('unknown')) {
              releaseYear = '2026';
            }

            allBooks.push({
              rank: rank,
              name: parts[1].trim(),
              author: parts[2].trim() !== '' ? parts[2].trim() : 'Unknown Author',
              releaseYear: releaseYear
            });
          }
        }
        filteredBooks = allBooks;
        updateView();
        setupCarousel();
        setupNotifications();
      })
      .catch(err => {
        console.error("Error loading CSV:", err);
        grid.innerHTML = `<div class="no-results">Unable to load the book list. Please ensure 'Bestsellers_Parsed_Full.csv' is in your directory.</div>`;
        setupNotifications();
      });

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => changePage(-1));
      nextBtn.addEventListener('click', () => changePage(1));
    }

    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      filteredBooks = allBooks.filter(book => 
        book.name.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm) ||
        `#${book.rank}`.includes(searchTerm) ||
        book.rank.toString().includes(searchTerm)
      );
      currentPage = 1;
      updateView();
      setTimeout(forceEqualHeights, 200);
    });

    window.addEventListener('resize', () => {
      updateView();
      if (carouselBooks.length > 0) {
        const isMobile = window.innerWidth <= 480;
        const itemsPerView = isMobile ? 3 : 6;
        const totalBooks = carouselBooks.length;
        currentSlide = totalBooks;
        updateCarouselPosition(false);
        updateCarouselIndicators();
      }
    });
  } else {
    setupNotifications();
  }

  // ===============================
  // DOWNLOAD PAGE LOGIC
  // ===============================
  const urlParams = new URLSearchParams(window.location.search);
  const bookName = urlParams.get('book');
  const author = urlParams.get('author');
  const year = urlParams.get('year');
  const rank = urlParams.get('rank');

  const dynamicTitle = document.getElementById('dynamic-title');
  const dynamicSubtitle = document.getElementById('dynamic-subtitle');
  const tabTitle = document.getElementById('tab-title');
  const bookCoverImg = document.querySelector('.book-cover');

  // ===============================
  // PRICE MAPPING
  // ===============================
  const priceMapping = {
    "A Court of Splintered Harmony": 12.50,
    "The Names": 3.64,
    "Threshing Day (Limited Deluxe Edition)": 11.00,
    "Gruffalo Granny": 7.49,
    "The Correspondent": 7.49,
    "Verity": 5.48,
    "Yesteryear": 8.49,
    "The Wedding People": 4.38,
    "We Chase Shadows": 12.50,
    "Never Lie": 3.00,
    "Guess How Much I Love You": 3.38,
    "The Cauldron: The Making of the Modern Middle East": 20.00,
    "London Falling": 11.00,
    "Sticker Dolly Dressing K-POP": 4.00,
    "It's Not What You Think": 5.48,
    "The Courage To Be Disliked": 5.83,
    "Broken Country": 4.74,
    "Great and Unfortunate Things": 14.79,
    "The Let Them Theory": 11.30,
    "Atomic Habits": 8.00,
    "Cozy Corner": 4.97,
    "The Nightingale": 5.00,
    "Murdoku: 80 Murder Mystery Logic Puzzles": 12.74,
    "My Husband's Wife": 4.98,
    "The Very Hungry Caterpillar": 4.00,
    "The Housemaid's Secret": 5.00,
    "Where are Woody and Buzz?": 5.57,
    "The Psychology of Money": 8.49,
    "Iron Flame": 5.00,
    "The Women": 4.99,
    "Happy Birthday, Gruffalo!": 3.96,
    "Onyx Storm": 5.00,
    "The Housemaid": 5.00,
    "A Court of Thorns and Roses": 4.98,
    "Sunrise on the Reaping": 4.99,
    "Agrippa": 11.00,
    "Ward D": 3.00,
    "Careless People": 5.49,
    "Fourth Wing": 5.48,
    "The Surrogate Mother": 3.00,
    "The Divorce": 5.00,
    "What Happened Yesterday": 4.74,
    "The Housemaid Is Watching": 5.00,
    "The Secret of Secrets": 4.99,
    "The Official Highway Code": 4.74,
    "A Court of Silver Flames": 6.00,
    "Cozy Days": 3.99,
    "Keeping 13": 5.00,
    "No More Nappies": 5.99,
    "Land": 12.00,
    "The Impossible Fortune": 5.00,
    "My Friends": 4.99,
    "A Court of Wings and Ruin": 6.00,
    "Dear Zoo": 4.97,
    "Secret Code Games for Clever Kids": 2.00,
    "Do Not Disturb": 3.00,
    "Brain Damage": 4.99,
    "Odyssey": 6.00,
    "CGP Summer Holidays Activity Workbook - for kids between Reception and Year 1": 3.70,
    "Where's Spidey?: A Marvel Spider-Man Search & Find Book": 3.00,
    "Atmosphere: A Love Story": 4.99,
    "An Inspector Calls": 9.50,
    "A Court of Frost and Starlight": 5.50,
    "The Long Shoe": 5.00,
    "The Odyssey": 14.99,
    "The Score": 7.99,
    "The Mistake": 8.15,
    "Project Hail Mary": 5.48,
    "One by One": 3.00,
    "Ultimate Football Heroes Colouring Book": 3.00,
    "The Bedtime Book of Impossible Questions": 8.37,
    "Murdle: Solve 100 Devilishly Devious Murder Mystery Logic Puzzles": 11.23,
    "Ready for My Potty": 4.00,
    "On the Farm": 8.99,
    "FAKE NEWS: THE SECRET DEAL BETWEEN GOVERNMENT AND THE MEDIA": 8.99,
    "Binding 13": 5.00,
    "The Housemaid's Wedding": 4.49,
    "Cozy Friends": 4.97,
    "Summer Island": 4.98,
    "The Turtle Who Turned the Tide": 4.00,
    "The Family Friend": 5.48,
    "Regime Change": 14.00,
    "The Deal": 8.99,
    "Girl Moments": 8.99,
    "The Things We Never Say": 13.98,
    "Saving 6": 8.99,
    "The Seriously Epic Holiday of Lottie Brooks": 8.99,
    "The Satsuma Complex": 8.99,
    "To the Women - The New Collection of Wise Words Every Woman Needs": 4.89,
    "The From Scratch Kitchen": 8.99,
    "We Solve Murders": 8.99,
    "Fourth Wing: The Graphic Novel, Volume One (Deluxe Edition)": 8.99,
    "Theo of Golden": 8.99,
    "How Lucky Am I": 8.99,
    "Jonty Gentoo - The Adventures of a Penguin": 8.99,
    "The History of Mankind in Its Entirety (Abridged): An Unsupervised PhD": 8.99,
    "Disney Princess: The Ultimate Colouring Book": 8.99,
    "First Writing Workbook Ages 3-5": 8.99,
    "A Court of Forgotten Melody": 12.50,
    "A Court of Frost and Starlight": 5.50,
    "A Court of Silver Flames": 6.00,
    "A Court of Thorns and Roses": 4.98,
    "A Court of Wings and Ruin": 6.00,
    "Girl Moments - Cute & Comfy Colouring Book": 8.99,
    "Murdle": 11.23,
    "Odyssey - Stephen Fry": 6.00,
    "Bored of Lunch Prep & Go": 8.99,
    "Pinch of Nom Meal Prep": 8.99,
    "Ottolenghi Simple Too": 8.99,
    "Kitchen Confidential": 8.99,
    "The Greatest Secret": 8.99,
    "The Everyday Hero": 8.99,
    "The 5 AM Club": 8.99,
    "The Midnight Library": 8.99,
    "The Alchemist": 8.99,
    "The 7 Habits of Highly Effective People": 8.99,
    "Rich Dad Poor Dad": 8.99,
    "Think and Grow Rich": 8.99,
    "The Art of War": 8.99,
    "How to Win Friends": 8.99,
    "The 48 Laws of Power": 8.99,
    "The Intelligent Investor": 8.99,
    "Good to Great": 8.99
  };

  if (bookName && dynamicTitle) {
    let detailsText = '';
    if (rank) detailsText += `#${rank} Bestseller`;
    if (author) detailsText += ` by ${author}`;
    if (year && year !== '2026') detailsText += ` (${year})`;

    dynamicTitle.innerHTML = `Download <br><span class="highlight">${bookName}</span><br> PDF Edition`;
    if (detailsText && dynamicSubtitle) {
      dynamicSubtitle.textContent = `Get the ${detailsText}. Learn how to master the core frameworks and insights from this edition.`;
    }
    if (tabTitle) {
      tabTitle.textContent = `Download ${bookName} PDF Edition`;
    }

    if (bookCoverImg) {
      const imageFilename = getImageFilename(bookName);
      const imagePath = `images/${imageFilename}`;
      const placeholderPath = `images/placeholder.jpg`;
      bookCoverImg.src = imagePath;
      bookCoverImg.alt = `${bookName} cover`;
      bookCoverImg.onerror = function() {
        this.onerror = null;
        this.src = placeholderPath;
      };
    }

    // ===============================
    // UPDATE PRICE
    // ===============================
    const oldPriceElement = document.querySelector('.old-price');
    const price = priceMapping[bookName] || 27.00;
    
    if (oldPriceElement) {
      oldPriceElement.textContent = `£${price.toFixed(2)}`;
    }

    // ===============================
    // UPDATE PERCENTAGE (70-95%)
    // ===============================
    const percentageElement = document.getElementById('claimed-percentage');
    const progressFill = document.getElementById('progress-bar');
    
    // Generate random percentage between 70 and 95
    const randomPercentage = Math.floor(Math.random() * 26) + 70;
    
    if (percentageElement) {
      percentageElement.textContent = `${randomPercentage}% CLAIMED`;
    }
    
    if (progressFill) {
      setTimeout(() => {
        progressFill.style.width = `${randomPercentage}%`;
      }, 200);
    }

    // ===============================
    // UPDATE COPIES COUNT (3-25)
    // ===============================
    const copiesElement = document.getElementById('copies-count');
    const remainingCopies = Math.floor(Math.random() * 23) + 3;
    
    if (copiesElement) {
      copiesElement.textContent = `${remainingCopies} COPIES`;
    }
  }

  // ===============================
  // PROGRESS BAR - REMOVED OLD FIXED LOGIC
  // ===============================
  // The progress bar is now handled above with random percentage
});