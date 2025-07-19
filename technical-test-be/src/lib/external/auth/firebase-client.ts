
const admin: any = require("firebase-admin");

export class FirebaseService {
    private static _FirebaseService : _FirebaseService;

    static getService() : _FirebaseService {
        if (this._FirebaseService == null) {
            this._FirebaseService = new _FirebaseService();
        }
        return this._FirebaseService;
    }
}

class _FirebaseService {

    private webFirebaseInstance = null;

    private webNamespace = "admin-web";

    initializeFirebaseAdmin() {
        // to prevent the Admin SDK from initializing multiple times, check if that already load:
        if (this.webFirebaseInstance == null) {
            console.log("Initializing Firebase " + process.env.WEB_FIREBASE_WEB_PROJECT_ID);
            try {
                const config: any = {
                    "type": process.env.WEB_FIREBASE_WEB_TYPE,
                    "project_id": process.env.WEB_FIREBASE_WEB_PROJECT_ID,
                    "private_key_id": process.env.WEB_FIREBASE_WEB_PRIVATE_KEY_ID,
                    "private_key": process.env.WEB_FIREBASE_WEB_PRIVATE_KEY,
                    "client_email": process.env.WEB_FIREBASE_WEB_CLIENT_EMAIL,
                    "client_id": process.env.WEB_FIREBASE_WEB_CLIENT_ID,
                    "auth_uri": process.env.WEB_FIREBASE_WEB_AUTH_URI,
                    "token_uri": process.env.WEB_FIREBASE_WEB_TOKEN_URI,
                    "auth_provider_x509_cert_url": process.env.WEB_FIREBASE_WEB_AUTH_PROVIDER_X509_CERT_URL,
                    "client_x509_cert_url": process.env.WEB_FIREBASE_WEB_CLIENT_X509_CERT_URL
                }
                this.webFirebaseInstance = admin.initializeApp({
                    credential: admin.credential.cert(config)
                }, this.webNamespace);
            } catch (err) {
                console.log(`Error initialize web ${JSON.stringify(err)}`)
                throw err
            }
        }
    }

    async getFirebaseId(authorization: string, namespace = this.webNamespace) {
        try {
            this.initializeFirebaseAdmin();
            return await admin.app(namespace).auth().verifyIdToken(authorization);
        } catch (err) {
            throw new Error("Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token in Authorization.");
        }
    }

    async getWebFirebaseId(authorization: string) {
        return await this.getFirebaseId(authorization, this.webNamespace);
    }
    getWebFirebaseInstance() {
        this.initializeFirebaseAdmin()
        return this.webFirebaseInstance;
    }
}
