class User {
    user_id = '';
    username = '';
    email = '';
    password = '';
    api_url = 'https://62bcae7a6b1401736cff2796.mockapi.io';

    create() {
        let data = {
            username: this.username,
            email: this.email,
            password: this.password
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {
            let session = new Session();
            session.user_id = data.id; // user_id je sada id iz data iz baze podataka(tabela users)
            session.startSession();
            window.location.href = 'webDev.html';
        });
    }
    
    // Uzima iz baze podatke o ulogovanom korisniku
    async get(user_id) {
        let api_url = this.api_url + '/users/' + user_id;
        let response = await fetch(api_url);
        let data = await response.json();
        return data;
    }

    //Izmena korisnickih podataka
    edit() {
        let data = {
            username: this.username,
            email: this.email
        }

        data = JSON.stringify(data);

        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = 'webDev.html'
        });
    }

    login() {
        fetch(this.api_url + '/users')
        .then(response => response.json())
        .then(data => {
            
            let login_succesfull = 0;

            data.forEach(db_user => {
                if(db_user.email === this.email && db_user.password === this.password){
                    let session = new Session();
                    session.user_id = db_user.id;
                    session.startSession();

                    login_succesfull = 1;

                    window.location.href = 'webDev.html'
                }
            });

            if(login_succesfull === 0){
                alert('Pogresna email adresa ili lozinka!');
            }
        })
    }

    //Brisanje profila korisnika
    delete() {
        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, {
            method: 'DELETE'
        })
        .then(response => response.json)
        .then(data => {
            let session = new Session();
            session.destroySession(); // Unistavamo i kolacic korisnika kada obrisemo njegove podatke iz baze

            window.location.href = '/';
        });
    }


}