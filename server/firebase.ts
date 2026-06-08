import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  getDocFromServer
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load configuration safely from the root file
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = {};
try {
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } else {
    console.warn("⚠️ firebase-applet-config.json not found at workspace root. Falling back to empty config.");
  }
} catch (err) {
  console.error("❌ Error parsing firebase-applet-config.json:", err);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = firestoreDbId 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firestoreDbId) 
  : initializeFirestore(app, { experimentalForceLongPolling: true });

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Track if Cloud Firestore API is available and authorized
export let isFirestoreAvailable = false;
export let firestoreConnectionError: string | null = null;
let checkAttempted = false;

export async function checkFirestoreConnection(): Promise<boolean> {
  if (checkAttempted) return isFirestoreAvailable;
  checkAttempted = true;

  if (!firebaseConfig || !firebaseConfig.projectId) {
    const skipMsg = "⚠️ Firestore connection check skipped: firebaseConfig has no projectId.";
    console.warn(skipMsg);
    firestoreConnectionError = skipMsg;
    isFirestoreAvailable = false;
    return false;
  }

  try {
    console.log(`⚡ Testing Firestore Connection for project: ${firebaseConfig.projectId}...`);
    // Attempt a direct read from a dummy path via getDocFromServer (using a blueprint schema valid collection: 'notifications')
    const testDoc = doc(db, "notifications", "test_doc_id");
    await getDocFromServer(testDoc);
    console.log("✅ Cloud Firestore is ONLINE, accessible, and ready to use!");
    isFirestoreAvailable = true;
    firestoreConnectionError = null;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const errCode = err?.code || "";
    firestoreConnectionError = `[${errCode}] ${errMsg}`;
    
    // If we hit Firestore security rules (permission-denied / insufficient permissions),
    // it means the Firestore service is fully enabled and reachable!
    if (
      errCode === "permission-denied" || 
      errMsg.includes("permission-denied") || 
      errMsg.includes("Missing or insufficient permissions") ||
      errMsg.includes("PERMISSION_DENIED")
    ) {
      // But wait! If the error message is specifically about the "Cloud Firestore API has not been used or is disabled",
      // it contains "PERMISSION_DENIED" but is not a rules permission error. Let's explicitly check for that.
      const isApiDisabled = 
        errMsg.includes("not been used in project") || 
        errMsg.includes("disabled") || 
        errMsg.includes("firestore.googleapis.com");

      if (isApiDisabled) {
        console.error("\n❌ ===========================================================================" +
                      "\n❌ CLOUD FIRESTORE API IS NOT ENABLED ON YOUR FIREBASE PROJECT!" +
                      `\n❌ Target Project: ${firebaseConfig.projectId}` +
                      "\n❌ Error detail: " + errMsg +
                      "\n❌ Fallback: Database is cleanly routing to local filesystem/MongoDB." +
                      "\n❌ To enable Firestore, visit the Firebase Console for your project:" +
                      `\n❌ https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore` +
                      "\n❌ Click 'Create database' under the Firestore Database section." +
                      "\n❌ ===========================================================================\n");
        isFirestoreAvailable = false;
      } else {
        console.log("\nℹ️ ===========================================================================" +
                     "\nℹ️ CLOUD FIRESTORE API IS ACTIVE AND RESPONDING SUCCESSFULLY!" +
                     `\nℹ️ Target Project: ${firebaseConfig.projectId}` +
                     "\nℹ️ Detail: Connected to Firestore server. Initial rules checks are propagating." +
                     "\nℹ️ Database writes and reads will be processed directly on Cloud Firestore." +
                     "\nℹ️ ===========================================================================\n");
        isFirestoreAvailable = true;
      }
    } else {
      // Any other error (e.g. offline, connection timeout, etc.) means it is currently unreachable/disabled.
      console.error("\n❌ ===========================================================================" +
                    "\n❌ CLOUD FIRESTORE IS OFFLINE, RESERVED, OR DISABLED FOR THIS PROJECT!" +
                    `\n❌ Target Project: ${firebaseConfig.projectId}` +
                    `\n❌ Error: [${errCode}] ${errMsg}` +
                    "\n❌ Fallback: Database is cleanly routing to local filesystem/MongoDB." +
                    "\n❌ ===========================================================================\n");
      isFirestoreAvailable = false;
    }
  }
  return isFirestoreAvailable;
}

// Trigger connection check on server startup asynchronously
checkFirestoreConnection().catch((e) => {
  console.warn("⚠️ Background Firestore check failed:", e);
});

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error("🔥 Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Wrapper Functions for Safe API CRUD operations with complete Error Context
export const FirestoreDb = {
  list: async <T>(collectionName: string): Promise<T[]> => {
    if (!isFirestoreAvailable) return [];
    try {
      const snap = await getDocs(collection(db, collectionName));
      const items: T[] = [];
      snap.forEach((docSnap) => {
        items.push({ ...docSnap.data() } as T);
      });
      return items;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, collectionName);
    }
  },

  get: async <T>(collectionName: string, id: string): Promise<T | null> => {
    if (!isFirestoreAvailable) return null;
    try {
      const docSnap = await getDoc(doc(db, collectionName, id));
      if (docSnap.exists()) {
        return docSnap.data() as T;
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${collectionName}/${id}`);
    }
  },

  set: async <T>(collectionName: string, id: string, data: any): Promise<T> => {
    if (!isFirestoreAvailable) return data as T;
    try {
      await setDoc(doc(db, collectionName, id), data);
      return data as T;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${id}`);
    }
  },

  update: async <T>(collectionName: string, id: string, data: Partial<any>): Promise<T | null> => {
    if (!isFirestoreAvailable) return null;
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      // Fetch updated document
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as T;
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  },

  delete: async (collectionName: string, id: string): Promise<boolean> => {
    if (!isFirestoreAvailable) return true;
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
    }
  }
};
