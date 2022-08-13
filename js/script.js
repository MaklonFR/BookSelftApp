window.addEventListener('DOMContentLoaded', () => {
  openTab(event, 'sb');
	const addBookForm = document.getElementById('addBookForm');
	addBookForm.addEventListener('submit', (event) => {
		event.preventDefault();
    addBook();
	});

	const searchForm = document.getElementById('searchForm');
	searchForm.addEventListener('submit', (event) => {
		event.preventDefault();
		searchBookByTitle();
	});

	maxYear();

	if (isStorageExist()) {
		loadStorageData();
	}
});

document.addEventListener('ondatasaved', () => {
	console.log('Success save!');
});

document.addEventListener('ondataloaded', () => {
	console.log('Success load!');
	refreshDataFromBooks();
});

function mycontact(){
  Swal.fire({
    title: 'Contact Me',
    text: '"Maklon J. Frare ( kallonjuve@gmail.com )"',
    confirmButtonText: 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'search-buttons',
    },
  });
}


function openTab(evt, menuBook) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuBook).style.display = "block";
  evt.currentTarget.className += " active";
}


const wrapper = document.querySelector(".wrapper");
const header = document.querySelector(".header");

wrapper.addEventListener("scroll", (e) => {
 e.target.scrollTop > 30
  ? header.classList.add("header-shadow")
  : header.classList.remove("header-shadow");
});


