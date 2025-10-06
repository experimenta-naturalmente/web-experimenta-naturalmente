import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, deleteUser, User as FirebaseUser } from 'firebase/auth';
import { addDoc, collection, doc, FieldValue, serverTimestamp, setDoc } from 'firebase/firestore';

export type Attachment = { type: string; url: string };

export type OpeningHourItem = {
  dayOfWeek: string; // e.g. "monday"
  openingHour: string; // "08:00"
  closingHour: string; // "18:00"
  isWorkingDay?: boolean;
};

export type ExperiencePayload = {
  name: string;
  description?: string;
  email?: string;
  cnpj?: string;
  categoryId?: string;
  ownerId?: string;
  createdAt?: FieldValue;
  phone?: string;
  address?: {
    street?: string;
    number?: number;
    zipCode?: string;
  };
  attachments?: Attachment[];
  openingHours?: OpeningHourItem[];
  socialNetworks?: Record<string, string>;
  tags?: string[];
};

export type UserPayload = {
  email: string;
  password: string;
  displayName?: string;
  cpf?: string;
  phone?: string;
  createdAt?: FieldValue;
};

export type RegisterAccountResult = {
  userId: string;
  error?: string;
};

export type RegisterExperienceResult = {
  experienceId: string;
  error?: string;
};

export async function registerUser(user: UserPayload): Promise<RegisterAccountResult> {
  if (!user?.email || !user?.password) {
    return { userId: '', error: 'Email e senha são obrigatórios' };
  }

  let createdUser: FirebaseUser | null = null;
  try {
    // 1) criar usuário no Auth
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    createdUser = userCredential.user;

    // 2) gravar documento do usuário no Firestore (coleção 'users')
    try {
      await setDoc(doc(collection(db, 'users'), createdUser.uid), {
        displayName: user.displayName,
        cpf: user.cpf,
        email: user.email,
        phone: user.phone,
        createdAt: serverTimestamp(),
      });
    } catch (uDocErr) {
      console.warn('Failed to write user doc:', uDocErr);
    }

    return { userId: createdUser.uid };
  } catch (err) {
    console.error('registerUser error:', err);
    if (createdUser) {
      try {
        // deleteUser requer que o usuário esteja autenticado; quando criamos com createUserWithEmailAndPassword
        // o novo usuário é automaticamente autenticado no client, então podemos apagá-lo.
        await deleteUser(createdUser);
      } catch (delErr) {
        console.warn('Rollback: failed to delete user after experience creation error', delErr);
      }
    }
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { userId: '', error: errorMessage };
  }
}

export async function createExperienceOnly(experience: ExperiencePayload, ownerId: string) {
  const experiencesCol = collection(db, 'experiences');
  const docRef = await addDoc(experiencesCol, {
    ...experience,
    ownerId: ownerId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
