class Post {
    post_id = '';
    post_content = '';
    likes = '';
    user_id = '';
    api_url = 'https://62bcae7a6b1401736cff2796.mockapi.io';

    async create() {
        let session = new Session();
        session_id = session.getSession(); //Uzima se id trenutno ulogovanog korisnika

        let data = {
            user_id: session_id,
            content: this.post_content,
            likes: 0
        }

        data = JSON.stringify(data);

        let response = await fetch(this.api_url + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        data = await response.json();
        return data;
    }

    async getAllPosts () {
        let response = await fetch(this.api_url + '/posts');
        let data = await response.json();
        return data;
    }

    like(post_id, likes) {
        let data = {
            likes: likes
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/posts/' + post_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => alert('Lajkovan post!'));
    }

    delete(post_id) {
        fetch(this.api_url + '/posts/' + post_id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => alert('Post je obrisan'));
    }
}