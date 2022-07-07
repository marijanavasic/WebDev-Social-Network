class Comment {
    user_id = '';
    post_id = '';
    content = '';
    comment_username = '';
    api_url = 'https://62bcae7a6b1401736cff2796.mockapi.io';

    create() {
        let data = {
            user_id: this.user_id,
            post_id: this.post_id,
            comment_username: this.comment_username,
            content: this.content
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/comments', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => alert('Vas komentar je objavljen!'));
    }

   async get(post_id) {
       let api_url = this.api_url + '/comments';

       const response = await fetch(api_url);
       const data = await response.json();
       let post_comments = []; // prazan niz komentara u koji cemo stavljeti komentare samo za taj post

       let i = 0;
       // item se odnosi na jedan komentar
        data.forEach(item => {
            if(item.post_id === post_id) {
                post_comments[i] = item;
                i++;
            }
        });

        return post_comments;
    }

}