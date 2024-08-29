import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCh6ldfEKdDsWsrSXx84-fra0R7XfHZSDk',
  authDomain: 'monoboard-b5266.firebaseapp.com',
  databaseURL: 'https://monoboard-b5266-default-rtdb.firebaseio.com',
  projectId: 'monoboard-b5266',
  storageBucket: 'monoboard-b5266.appspot.com',
  messagingSenderId: '494331031099',
  appId: '1:494331031099:web:2775b777ce14db22bcf61e',
  measurementId: 'G-CYMCVH5MQ0',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Successfully created a new user
    const user = userCredential.user
    console.log('User signed up:', user)
    return user
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message
    console.error('Error signing up:', errorCode, errorMessage)
    throw new Error(errorMessage)
  }
}

export { db, auth, signUpWithEmail }
