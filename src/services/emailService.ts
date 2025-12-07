import emailjs from '@emailjs/browser';

// Initialize EmailJS (koristiš test mode ili trebaš da kreiš account na emailjs.com)
// Za sada ću koristiti mock slanje sa console log-om
const EMAIL_SERVICE_ID = 'service_test'; // Trebas da zamenis sa stvarnim ID-om
const EMAIL_TEMPLATE_ID = 'template_test'; // Trebas da zamenis sa stvarnim ID-om
const EMAILJS_PUBLIC_KEY = 'test_key'; // Trebas da zamenis sa stvarnim key-om

// Inicijalizuj EmailJS ako imaš konfiguraciju
try {
  if (EMAILJS_PUBLIC_KEY !== 'test_key') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
} catch (error) {
  console.log('EmailJS nije inicijalizovan - slanje emaila će biti simulirano');
}

interface SendEmailParams {
  to_email: string;
  username: string;
  password: string;
  recipient_name?: string;
}

export const sendUserWelcomeEmail = async (params: SendEmailParams): Promise<boolean> => {
  try {
    // Ako nije konfigurisan EmailJS, simuliraj slanje
    if (EMAILJS_PUBLIC_KEY === 'test_key') {
      console.log('📧 SIMULACIJA SLANJA EMAIL-a:');
      console.log(`────────────────────────────────`);
      console.log(`Do: ${params.to_email}`);
      console.log(`Korisničko ime: ${params.username}`);
      console.log(`Lozinka: ${params.password}`);
      console.log(`────────────────────────────────`);
      
      // Prikaži notifikaciju
      showEmailNotification(params.to_email, true);
      return true;
    }

    // Ako je konfigurisan EmailJS, koristi ga
    const templateParams = {
      to_email: params.to_email,
      to_name: params.recipient_name || params.username,
      username: params.username,
      password: params.password,
      app_name: 'Kumulativne Obaveze'
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams
    );

    console.log('Email poslat uspešno:', response);
    showEmailNotification(params.to_email, true);
    return true;
  } catch (error) {
    console.error('Greška pri slanju emaila:', error);
    showEmailNotification(params.to_email, false);
    return false;
  }
};

// Helper funkcija za prikaz notifikacije
const showEmailNotification = (email: string, success: boolean) => {
  const message = success
    ? `Email sa podacima za prijavu je poslat na ${email}`
    : `Greška pri slanju emaila na ${email}`;
  
  // Kreiraj custom event koji se može slusati u komponentama
  const event = new CustomEvent('emailNotification', {
    detail: { message, success, email }
  });
  window.dispatchEvent(event);
};

// Utility za otvaranje email klijenta ako EmailJS nije dostupan
export const openEmailClient = (email: string, username: string, password: string) => {
  const subject = 'Dobrodošli u sistem Kumulativne Obaveze';
  const body = `Vaši podaci za prijavu:\n\nKorisničko ime: ${username}\nLozinka: ${password}`;
  
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};
