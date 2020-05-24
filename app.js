const ArticleList = document.querySelector('#articles-list');
const form = document.querySelector('#add-articles');

function renderArticles(doc) {
    let card = document.createElement('div');
    card.classList.add("card");
    let cardInside = document.createElement('div');
    cardInside.classList.add("card-body", "article-card");
    let title = document.createElement('h5');
    let author = document.createElement('h6');
    let divider = document.createElement('hr');
    let article = document.createElement('p');
    let cross = document.createElement('div');
    cross.classList.add("btn", "btn-primary");

    let attrs = {
        'data-id' : doc.id,
        'data-aos': 'fade-up',
        'data-aos-delay': '25',
        'data-aos-duration': '1000',
        'data-aos-offset': '150'
    };

    for (var key in attrs) {
        card.setAttribute(key, attrs[key]);
    }

    title.textContent = doc.data().title;
    author.textContent = doc.data().author;
    article.textContent = doc.data().article;
    cross.textContent = 'Delete Article';

    let arr = [title, author, divider, article, cross];
    for(var a of arr) {
        cardInside.appendChild(a);
    }

    card.appendChild(cardInside);

    ArticleList.appendChild(card);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('articles').doc(id).delete();
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('articles').add({
        title: form.title.value,
        author: form.author.value,
        article: form.article.value
    });
    form.title.value = '';
    form.author.value = '';
    form.article.value = '';
});

db.collection('articles').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type == 'added') {
            renderArticles(change.doc);
        } else if (change.type == 'removed') {
            let li = ArticleList.querySelector('[data-id=' + change.doc.id + ']');
            ArticleList.removeChild(li);
        }
    });
});