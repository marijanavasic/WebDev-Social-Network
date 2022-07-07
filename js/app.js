//Ako si ulogovan tj imas kolacic(kolacic nije prazan) ides na webDev.html
let session = new Session();
session = session.getSession();

if(session !== ""){
    window.location.href = "webDev.html";
}

//Otvaranje modala za registraciju
document.querySelector('#registracija').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'block';
});

// Zatvaranje modala klikom na X 
document.querySelector('#closeModal').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'none';
});

// Validacija forme za registraciju i login
let config = {
    'korisnicko_ime': {
        required: true,
        minlength: 3,
        maxlength: 50
    },

    'email': {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },

    'lozinka': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'ponovi_lozinku'
    },

    'ponovi_lozinku' : {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'lozinka'
    }
}

let validator = new Validator(config, '#registrationForm');

// Provera da li je validacija prosla, ako jeste treba novog korisnika upisati u bazu
document.querySelector('#registrationForm').addEventListener('submit', e => {
    e.preventDefault();
    
    if(validator.validationPassed()){
        let user = new User();
        user.username = document.querySelector('#korisnicko_ime').value;
        user.email = document.querySelector('#email').value;
        user.password = document.querySelector('#lozinka').value;
        user.create();
    } else {
        alert('Polja nisu dobro popunjena!');
    }
});

// Login Forma 
document.querySelector('#loginForm').addEventListener('submit', e => {
    e.preventDefault();

    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_lozinka').value;

    let user = new User();
    user.email = email;
    user.password = password;
    user.login();
})