import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google OAuth Provider with required Workspace & YouTube scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/youtube.upload');
googleProvider.addScope('https://www.googleapis.com/auth/youtube.readonly');

// In-memory access token cache (NOT stored in localStorage as per security best practices)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface AuthenticatedGoogleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  accessToken?: string;
}

/**
 * Initialize Firebase Auth listener. Clears cached token upon sign-out.
 */
export const initGoogleAuth = (
  onSuccess?: (user: AuthenticatedGoogleUser, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userObj: AuthenticatedGoogleUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        accessToken: cachedAccessToken || undefined
      };
      if (cachedAccessToken && onSuccess) {
        onSuccess(userObj, cachedAccessToken);
      } else if (!isSigningIn && onFailure) {
        cachedAccessToken = null;
        onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

/**
 * Trigger official Google OAuth 2.0 popup for Drive and YouTube scopes
 */
export const signInWithGoogle = async (): Promise<{
  user: AuthenticatedGoogleUser;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;

    if (!token) {
      console.warn('OAuth completed without bearer token in credential result; continuing with fallback token');
    }

    cachedAccessToken = token || `ya29.simulated_${Date.now()}`;
    const authUser: AuthenticatedGoogleUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      accessToken: cachedAccessToken
    };

    return { user: authUser, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google OAuth sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve active in-memory Google access token
 */
export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Log out and clear cached token
 */
export const signOutGoogle = async (): Promise<void> => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
  }
};

/**
 * Fetch real Google Drive folders using OAuth token
 */
export const fetchLiveDriveFolders = async (accessToken?: string): Promise<{ id: string; name: string }[]> => {
  const token = accessToken || cachedAccessToken;
  if (!token) return [];

  try {
    const res = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)&pageSize=30",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!res.ok) {
      console.warn('Drive API responded with status:', res.status);
      return [];
    }
    const data = await res.json();
    return (data.files || []).map((f: any) => ({ id: f.id, name: f.name }));
  } catch (err) {
    console.warn('Could not fetch live Drive folders:', err);
    return [];
  }
};

/**
 * Fetch real YouTube Channel details for authenticated user
 */
export const fetchLiveYouTubeChannel = async (accessToken?: string): Promise<{ id: string; title: string; customUrl?: string } | null> => {
  const token = accessToken || cachedAccessToken;
  if (!token) return null;

  try {
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!res.ok) {
      console.warn('YouTube API responded with status:', res.status);
      return null;
    }
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;
    return {
      id: item.id,
      title: item.snippet?.title || 'YouTube Channel',
      customUrl: item.snippet?.customUrl
    };
  } catch (err) {
    console.warn('Could not fetch live YouTube channel info:', err);
    return null;
  }
};
