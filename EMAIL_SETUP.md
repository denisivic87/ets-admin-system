# Email Konfiguracija - EmailJS Setup

## Kako aktivirati slanje email poruka

Aplikacija podržava slanje email poruka kada admin kreira novog korisnika.

### Opcija 1: Automatsko Slanje (Preporučeno)

Za aktiviranje automtskog slanja email poruka, trebate da:

1. Kreirate account na [EmailJS](https://www.emailjs.com/)
2. Generirate API ključ i ID servisa
3. Ažurirate `src/services/emailService.ts` sa vašim kredencijallima:

```typescript
const EMAIL_SERVICE_ID = 'your_service_id'; // Zameni sa svojim ID-om
const EMAIL_TEMPLATE_ID = 'your_template_id'; // Zameni sa svojim template ID-om
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Zameni sa svojim javnim ključem
```

### Opcija 2: Simulirano Slanje (Trenutno)

Ako niste konfigurirali EmailJS, aplikacija će automatski simulirati slanje email-a:
- Poruka sa pristupnim podacima će biti ispisana u browser console-u
- Korisnik će vidjeti notifikaciju da je email poslat

### Opcija 3: Otvaranje Email Klijenta

Korisnik može ručno da pošalje email preko default email klijenta:
- Kliknuti na dugme u notifikaciji
- Automatski će se otvoriti email klijent sa predpopuljenom porukom

## Email Šablon

Preporučeni email šablon sadrži:
- Korisničko ime
- Lozinku (šifru)
- Link za prijavu
- Pozdrav

## Sigurnost

⚠️ **Važno**: 
- Nikada ne čuvaj pristupne podatke direktno u kodu
- Koristi environment varijable za production
- Razmotri HTTPS enkripciju za pristupne podatke

## Troubleshooting

Ako email nije poslat:
1. Proveri browser console za greške
2. Provjeri validnost email adrese
3. Priključi se na EmailJS i proveri status servisa
4. Ako koristiš VPN ili proxy, EmailJS može biti blokiran

