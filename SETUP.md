# Setup Guide - AtlasAir Backend

## 🔧 Configuration Initiale

### 1. Fichier `.env`

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database Oracle (Optionnel en développement)
# Pour désactiver temporairement la DB, laissez ces champs vides ou définissez DB_ENABLED=false
DB_ENABLED=false
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=
DB_PASSWORD=
DB_SERVICE_NAME=XEPDB1
DB_SYNCHRONIZE=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Optionnel en développement)
# Pour désactiver temporairement l'email, laissez ces champs vides ou définissez MAIL_ENABLED=false
MAIL_ENABLED=false
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=noreply@flightreservation.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_LOCATION=./uploads
```

### 2. Mode Développement sans Services Externes

Pour démarrer l'application sans Oracle Database ni configuration email :

1. **Désactiver la Database** :
   - Dans `.env`, définissez `DB_ENABLED=false`
   - Ou laissez `DB_USERNAME` et `DB_PASSWORD` vides

2. **Désactiver l'Email** :
   - Dans `.env`, définissez `MAIL_ENABLED=false`
   - Ou laissez `MAIL_USER` et `MAIL_PASSWORD` vides

### 3. Démarrer l'Application

```bash
npm run start:dev
```

L'application devrait démarrer même si Oracle Database n'est pas disponible. Les fonctionnalités qui nécessitent la DB ne fonctionneront pas, mais l'API restera accessible.

## 🔌 Configuration Oracle Database (Quand Prêt)

1. **Installer Oracle Database** :
   - Téléchargez Oracle Database XE 21c
   - Installez et configurez-le

2. **Installer Oracle Instant Client** :
   - Téléchargez depuis le site Oracle
   - Ajoutez-le au PATH

3. **Créer un utilisateur** :
   ```sql
   CREATE USER flight_user IDENTIFIED BY your_password;
   GRANT CONNECT, RESOURCE, DBA TO flight_user;
   ```

4. **Mettre à jour `.env`** :
   ```env
   DB_ENABLED=true
   DB_HOST=localhost
   DB_PORT=1521
   DB_USERNAME=flight_user
   DB_PASSWORD=your_password
   DB_SERVICE_NAME=XEPDB1
   DB_SYNCHRONIZE=true
   ```

## 📧 Configuration Email (Quand Prêt)

1. **Gmail** :
   - Activez l'authentification à 2 facteurs
   - Générez un "App Password"
   - Utilisez cet App Password comme `MAIL_PASSWORD`

2. **Mettre à jour `.env`** :
   ```env
   MAIL_ENABLED=true
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_FROM=noreply@flightreservation.com
   ```

## ⚠️ Notes Importantes

- En mode développement, l'application peut démarrer sans Oracle DB et Email
- Les fonctionnalités nécessitant ces services ne fonctionneront pas
- Pour tester l'API complète, configurez Oracle Database
- Les emails utiliseront un transport JSON en mode développement (pas d'envoi réel)

