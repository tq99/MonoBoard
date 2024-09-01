import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
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
