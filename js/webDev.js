let session = new Session();
session_id = session.getSession();

if(session_id !== ""){
//uzima i ispisuje username i email ulogovanog korisnika
    async function populateUserData(){
        let user = new User();
        user = await user.get(session_id);

        document.querySelector('#username').innerText = user['username']
        document.querySelector('#email').innerText = user['email'];

        //ide value posto je u pitanju input polje;
        // popunjava modal podacima koje zelimo da menjamo u edit Formi
        document.querySelector('#korisnicko_ime').value = user['username'];
        document.querySelector('#edit_email').value = user['email'];
    }

    populateUserData();

} else {
    window.location.href = "/"
}

//Odjava preko brisanja tj unistavanja kolacica
document.querySelector('#logout').addEventListener('click', e => {
    e.preventDefault();

    session.destroySession();
    window.location.href = '/';
});

// Otvaranje modala za izmenu korisnickih podataka
document.querySelector('#editAccount').addEventListener('click', e => {
    e.preventDefault();

    document.querySelector('.custom-modal').style.display = 'block';
});

// Zatvranje modala za imenu korisnickih podataka klikom na X
document.querySelector('#closeModal').addEventListener('click', e => {
    e.preventDefault();

    document.querySelector('.custom-modal').style.display = 'none';
});

// Izmena korisnickih podataka
document.querySelector('#editForm').addEventListener('submit', e => {
    e.preventDefault();

    let user = new User();
    user.username = document.querySelector('#korisnicko_ime').value;
    user.email = document.querySelector('#edit_email').value;
    user.edit();
});


// Brisanje profila
document.querySelector('#deleteProfile').addEventListener('click', e => {
    e.preventDefault();

    let text = 'Da li ste sigurni da zelite da obrisete profil sa drustvene mreze namenjene Web Developerima? 🤔';

    if(confirm(text) === true) {
        let user = new User();
        user.delete();
    }
});


// Kreiranje postova
document.querySelector('#postForm').addEventListener('submit', e => {
    e.preventDefault();

    async function createPost(){
        let content = document.querySelector('#postContent').value;
        document.querySelector('#postContent').value = '';
        let post = new Post();
        post.post_content = content;
        post = await post.create();

        //Ispisivanje postova na stanici
        let current_user = new User();
        current_user = await current_user.get(session_id);

        //Dugme za brisanje postova
        let delete_post_hmtl = '';
        // ako se id trenutnog korsinika(session_id) poklapa sa id korisnika koji je objavio post (post.user_id) 
        if(session_id === post.user_id){
            delete_post_hmtl  = '<button onclick="removeMyPost(this)" class="remove-btn">Remove</button>'
        } 

        document.querySelector('#allPostsWrapper').innerHTML += `<div class="single-post" data_post_id="${post.id}">
                                                                    <div class="post-content">${post.content}</div>
                                                                    
                                                                    <div class="post-actions">
                                                                        <p><b>Autor: </b> ${current_user.username}</p>
                                                                        <div>
                                                                            <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span>Likes</button>
                                                                            <button onclick="commentPost(this)" class="comment-btn">Comments</button>
                                                                            ${delete_post_hmtl }
                                                                        </div>
                                                                    </div>

                                                                    <div class="post-comments">
                                                                        <form id="commentForm">
                                                                            <input type="text" placeholder="Napisi neki komentar...">
                                                                            <button onclick="commentPostSubmit(event)">Comment</button>
                                                                        </form>
                                                                    </div>
                                                                </div>`
    }

    createPost();

});




//Ucitavanje svih postova
async function getAllPosts() {
    let all_posts = new Post();
    all_posts = await all_posts.getAllPosts();

    all_posts.forEach(post => {

        async function getPostUser() {
            let user = new User();
            user = await user.get(post.user_id); //uzima id korisnika koji je objavio post
            


            //Ucitavanje svih komentara
            let comments  = new Comment();
            comments = await comments.get(post.id);
            

            //Ispisivanje komentara
            let comments_html = '';
            if(comments.length > 0) {
                comments.forEach(comment => {   
                    // let commentUsername =   document.querySelector('#username').innerText;     
                    comments_html += `<div class="single-comment"><b>💬: ${comment.content} </b> <p>Commented by [ ${comment.comment_username} ]</p></div>`
                });
            }
    
            let delete_post_hmtl = '';
            if(session_id === post.user_id){
                delete_post_hmtl  = '<button onclick="removeMyPost(this)" class="remove-btn">Remove</button>'
            }
            document.querySelector('#allPostsWrapper').innerHTML += `<div class="single-post" data_post_id="${post.id}">
                                                                        <div class="post-content">${post.content}</div>
                                                                        
                                                                        <div class="post-actions">
                                                                            <p><b>Autor: </b> ${user.username}</p>
                                                                            <div>
                                                                                <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span>Likes</button>
                                                                                <button onclick="commentPost(this)" class="comment-btn">Comments</button>
                                                                                ${delete_post_hmtl }
                                                                            </div>
                                                                        </div>
    
                                                                        <div class="post-comments">
                                                                            <form id="commentForm">
                                                                                <input type="text" placeholder="Napisi neki komentar...">
                                                                                <button onclick="commentPostSubmit(event)">Comment</button>
                                                                            </form>

                                                                            ${comments_html}

                                                                        </div>
                                                                    </div>`
        }

        getPostUser();
       
    });
}

getAllPosts();


//Ispisivanje komentara klikom na Comment
const commentPostSubmit = e => {
    e.preventDefault();

    let btn = e.target;
    // btn.setAttribute('disabled', 'true');

    let main_post_el = btn.closest('.single-post');
    post_id = main_post_el.getAttribute('data_post_id');

   

    let comment_value = main_post_el.querySelector('input').value;
    main_post_el.querySelector('input').value = '';

    let commentUsername =   document.querySelector('#username').innerText;

    if(comment_value !== '') {

        main_post_el.querySelector('.post-comments').innerHTML += `<div class="single-comment">${comment_value}<p><b>Autor: </b> ${commentUsername}</p></div>`;

        let comment = new Comment();
        comment.content = comment_value;
        comment.user_id = session_id;
        comment.post_id = post_id;
        comment.comment_username = commentUsername;
        comment.create();

    } else { 
        alert('Unesite neki komentar!');
    }

}


const removeMyPost = btn => {
    let post_id = btn.closest('.single-post').getAttribute('data_post_id');

    btn.closest('.single-post').remove(); //ovo ne brise iz baze

    let post =  new Post();
    post.delete(post_id); //ovo brise i iz baze
}

const likePost = btn => {
    let main_post_el = btn.closest('.single-post');
    let post_id = main_post_el.getAttribute('data_post_id');
    // trenutni br lajkova
    let number_of_likes = parseInt(btn.querySelector('span').innerText);

    btn.querySelector('span').innerText = number_of_likes + 1;
    btn.setAttribute('disabled', 'true');

    let post = new Post();
    post.like(post_id, number_of_likes + 1);
}

//Prikaz polja za unos komentara i prikaz svih komentara
const commentPost = btn  => {
    let main_post_el = btn.closest('.single-post');
    let post_id = main_post_el.getAttribute('data_post_id');

    main_post_el.querySelector('.post-comments').style.display = 'block';
}