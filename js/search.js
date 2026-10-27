
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

/* =========================================
   SEARCHABLE CONTENT
========================================= */

const searchableContent = [
    {
        title: "Home",
        description: "Welcome to St. Robert's International College. Home of the Champions.",
        link: "index.html"
    },
    {
        title: "About Us",
        description: "Learn more about St. Robert's International College, our history and mission.",
        link: "about.html"
    },
    {
        title: "Academics",
        description: "Explore our academic programs, courses and educational opportunities.",
        link: "academics.html"
    },
    {
        title: "Admissions",
        description: "Learn about admission requirements, enrollment procedures and application.",
        link: "admissions.html"
    },
    {
        title: "Faculty",
        description: "Meet our dedicated teachers, instructors and faculty members.",
        link: "faculty.html"
    },
    {
        title: "News",
        description: "Read the latest school announcements, activities and news.",
        link: "news.html"
    },
    {
        title: "Contact Us",
        description: "Get in touch with St. Robert's International College.",
        link: "contact.html"
    }
];


/* =========================================
   SEARCH FUNCTION
========================================= */

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchText = searchInput.value.trim().toLowerCase();

    /* Empty search */
    if (searchText === "") {

        searchResults.innerHTML = `
            <div class="no-results">
                Please enter a word or phrase to search.
            </div>
        `;

        return;
    }


    /* Find matching results */

    const results = searchableContent.filter(item =>
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
    );


    /* =========================================
       DISPLAY RESULTS
    ========================================= */

    if (results.length > 0) {

        searchResults.innerHTML = `
            <div class="search-result-box">

                <h4>
                    Search Results for:
                    <strong>"${searchText}"</strong>
                </h4>

                ${results.map(item => `

                    <div class="search-result-item">

                        <h5>
                            <a href="${item.link}">
                                ${item.title}
                            </a>
                        </h5>

                        <p>
                            ${item.description}
                        </p>

                    </div>

                `).join("")}

            </div>
        `;

    } else {

        searchResults.innerHTML = `
            <div class="no-results">

                <i class="fas fa-search"></i>

                <h4>No Results Found</h4>

                <p>
                    We couldn't find anything matching
                    "<strong>${searchText}</strong>".
                </p>

            </div>
        `;
    }

});

const searchableContent = [
    {
        title: "Home",
        description: "Welcome to St. Robert's International College.",
        link: "index.html"
    },

    {
        title: "Student Services",
        description: "Information about student services and support.",
        link: "student-services.html"
    },

    {
        title: "School Activities",
        description: "Latest activities and events of the school.",
        link: "activities.html"
    }
];