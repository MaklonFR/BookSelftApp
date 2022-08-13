const unfinishedList = document.querySelector('.unfinished-list');
const finishedList = document.querySelector('.finished-list');
const BOOK_ITEMID = 'itemId';

const addBook = () => {    
    const bookTitle = document.getElementById('title');
	const bookAuthor = document.getElementById('author');
	const bookPublishedYear = document.getElementById('published');
    const isFinished = document.getElementById('checkStatus').checked;
	const publishedYearFirstNumber = bookPublishedYear.value.split('')[0];

	if (bookTitle.value != '' && bookAuthor.value != '' && bookPublishedYear.value != '') {
		if (publishedYearFirstNumber != 0) {
			const book = makeBook(bookTitle.value, bookAuthor.value, bookPublishedYear.value, isFinished);
			const bookObject = composeBookObject(bookTitle.value, bookAuthor.value, bookPublishedYear.value, isFinished);

			book[BOOK_ITEMID] = bookObject.id;
			books.push(bookObject);

			bookTitle.value = '';
			bookAuthor.value = '';
			bookPublishedYear.value = '';

			if (isFinished) {
				finishedList.append(book);
				openTab(event, 'sb');
			} else
			  {
				unfinishedList.append(book);
				openTab(event, 'bsb');
			  }

			updateStorageData();
			Swal.fire({
				title: 'Success!',
				text: 'Book added to the shelf!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'search-buttons-finish',
				},
			});
		} else {
			Swal.fire({
				title: 'Invalid Input',
				text: 'Published year first number cannot be 0',
				icon: 'warning',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'search-buttons-unfinish',
				},
			})
		}
	} else {
		Swal.fire({
			title: 'Empty Field',
			text: 'Please fill out the form',
			icon: 'warning',
			confirmButtonText: 'OK',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'search-buttons-unfinish',
			},
		});
    
	}
};

const makeBook = (title, author, publishedYear, isFinished) => {
    const bookDetails = document.createElement('div');
	bookDetails.classList.add('job-card');
    bookDetails.innerHTML =`
	<div class="job-card-title title">
	<h3>	${title}   </h3>
	</div>
    <div class="job-card-subtitle author">
    	Pengarang :	${author}
    </div>
   <div class="job-detail-buttons">
    <button class="search-buttons detail-button published">Tahun : ${publishedYear}</button>
   </div>`;

   const actionBtnContainer = document.createElement('div');
   actionBtnContainer.classList.add('job-card-buttons');

   
   if (isFinished) {
       actionBtnContainer.append(createUnfinishedBtn(), createRemoveBtn());
   } else {
       actionBtnContainer.append(createFinishedBtn(), createRemoveBtn());
   }

   bookDetails.append(actionBtnContainer);
	return bookDetails;
    
};

const createBtn = (classType, isFinished, eventListener) => {
	const button = document.createElement('button');

	if (isFinished) {
		button.classList.add('card-buttons', classType);
		button.innerText = `Unfinished`;
	} else {
		button.classList.add('card-buttons', classType);
		button.innerText = `Finished`;
	}

	if (classType == 'search-buttons') {
		button.classList.add('card-buttons-msg', classType);
		button.innerText = `Remove book`;
	}

	button.addEventListener('click', (event) => {
		eventListener(event);
	});

	return button;
};

const moveToFinished = (bookElement) => {
	const title = bookElement.querySelector('.title').innerText;
	const author = bookElement.querySelector('.author').innerText.split(':').slice(1);
	const publishedYear = bookElement.querySelector('.published').innerText.split(':').slice(1);


	const newBook = makeBook(title, author, publishedYear, true);
	const book = findBook(bookElement[BOOK_ITEMID]);

	book.isFinished = true;
	newBook[BOOK_ITEMID] = book.id;

	finishedList.append(newBook);
	bookElement.remove();
	updateStorageData();
};

const moveToUnfinished = (bookElement) => {
	const title = bookElement.querySelector('.title').innerText;
	const author = bookElement.querySelector('.author').innerText.split(':').slice(1);
	const publishedYear = bookElement.querySelector('.published').innerText.split(':').slice(1);

	const newBook = makeBook(title, author, publishedYear, false);
	const book = findBook(bookElement[BOOK_ITEMID]);

	book.isFinished = false;
	newBook[BOOK_ITEMID] = book.id;

	unfinishedList.append(newBook);
	bookElement.remove();
	updateStorageData();
};

const removeBook = (bookElement) => {
	const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this book!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Delete Book',
		buttonsStyling: false,
		reverseButtons: true,
		customClass: {
			cancelButton: 'search-buttons-unfinish',
			confirmButton: 'search-buttons',
		},
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: 'Deleted!',
				text: 'Book deleted from the shelf!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'search-buttons-finish',
				},
			});

			books.splice(bookPosition, 1);
			bookElement.remove();
			updateStorageData();
		}
	}); 
    
};

const searchBookByTitle = () => {
	let searchBookInput = document.querySelector('#searchForm input');
	const unfinishedBooks = document.querySelectorAll('.unfinished-list .job-card');
	const finishedBooks = document.querySelectorAll('.finished-list .job-card');

	finishedBooks.forEach((e) => e.remove());
	unfinishedBooks.forEach((e) => e.remove());

	searchBooks(searchBookInput);
};

const createFinishedBtn = () => {
	return createBtn('search-buttons-finish', false, (event) => {
		moveToFinished(event.target.parentElement.parentElement);
	});
};

const createUnfinishedBtn = () => {
	return createBtn('search-buttons-unfinish', true, (event) => {
		moveToUnfinished(event.target.parentElement.parentElement);
	});
};

const createRemoveBtn = () => {
	return createBtn('search-buttons', true, (event) => {
		removeBook(event.target.parentElement.parentElement);
	});
};

const maxYear = () => {
	const publishedInput = document.getElementById('published');
	const date = new Date();
	const year = date.getFullYear();

	publishedInput.setAttribute('min', 0);
	publishedInput.setAttribute('max', year);
};

