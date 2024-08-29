import { db, auth } from '../config/firebase-config' // Import the Firebase config
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const saveCardsToFirebase = async ({ cards }) => {
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      cards: cards, // Save the entire array
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

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

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
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

export { saveCardsToFirebase, signUpWithEmail, signInWithEmail }
