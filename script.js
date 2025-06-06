import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  collection, addDoc, Timestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email');
const flightForm = document.getElementById('flight-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert('خطأ في تسجيل الدخول');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => signOut(auth));
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    userEmailDisplay.innerText = user.email;
  } else {
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
  }
});

if (flightForm) {
  flightForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(flightForm);
    const entries = Array.from({length: 5}).map((_, i) => {
      return {
        date: formData.get(`row${i}_date`),
        flt: formData.get(`row${i}_flt`),
        from: formData.get(`row${i}_from`),
        to: formData.get(`row${i}_to`),
        dep: formData.get(`row${i}_dep`),
        arr: formData.get(`row${i}_arr`),
        name: formData.get(`row${i}_name`),
        note: formData.get(`row${i}_note`),
        timestamp: Timestamp.now()
      }
    });
    try {
      for (let entry of entries) {
        if (entry.flt) {
          await addDoc(collection(db, 'flights'), entry);
        }
      }
      alert('تم حفظ الرحلات');
      flightForm.reset();
    } catch (err) {
      alert('خطأ أثناء الحفظ');
    }
  });
}