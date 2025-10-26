# givev




## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Firebase (Authentication, Firestore)
- **UI Animation**: Framer Motion
- **Payment Integration**: Stripe

## Installation

To get started with givev, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd elivra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Go to Project Settings > General
   - Scroll down to "Your apps" section and click the web app icon (</>)
   - Copy the Firebase configuration values
   - Create a `.env.local` file in the root directory with the following content:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Enable Authentication in Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Save the changes

5. Set up Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (for development, you can use test mode)

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Access the application:
   - Open [http://localhost:3000](http://localhost:3000)
   - Use the admin credentials provided on the login page
   
Contributing
We welcome contributions to givev! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

Fork the repository.

Create your feature branch:

git checkout -b feature/YourFeature

Commit your changes:

git commit -m "Add some feature"

Push to the branch:
git push origin feature/YourFeature

Open a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.



### LICENSE

Here's the sample MIT License text you can use:

```markdown
MIT License

Copyright (c) [2024] [AlexInem]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
