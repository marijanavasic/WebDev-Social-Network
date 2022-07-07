class Session {
    user_id = '';

    // Kreira kolacic za registrovanog korisnika koji istice za 2 dana 
    startSession() {
        const d = new Date();
        d.setTime(d.getTime() + (2*24*60*60*1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "user_id=" + this.user_id + ";" + expires;
    }

    //Uzima kolacic za korisnika koji je vec registrovan/logovan kako bi se omoguci pristup webdev.html i ne moze da se vrati na index.html dok se ne odjavi
    getSession(){
        let name = 'user_id=';// naziv kolacica
        let ca = document.cookie.split(';'); //Kolacici su razdvojeni ;

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //Unistava kolacic kada se korisnik izloguje vraca ga na index.html i onemogucava pristup webdev.html dok se ponovo ne uloguje
    destroySession() {
        let cookies = document.cookie.split(';');

        for(let i = 0; i < cookies.length; i++){
            let cookie = cookies[i];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie  = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}