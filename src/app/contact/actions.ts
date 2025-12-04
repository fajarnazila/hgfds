
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(1, 'Subjek wajib diisi'),
  message: z.string().min(1, 'Pesan wajib diisi'),
});

// Helper function to initialize Firebase services on the server
function getDb() {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function submitContactForm(values: unknown) {
  try {
    const validatedData = contactSchema.parse(values);
    
    const db = getDb();
    const messagesCollection = collection(db, 'contactMessages');
    
    await addDoc(messagesCollection, {
      ...validatedData,
      submittedAt: serverTimestamp(),
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Data yang Anda masukkan tidak valid." };
    }
    return { success: false, error: "Terjadi kesalahan saat mengirim pesan." };
  }
}
