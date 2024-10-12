# Bucket List App
This is a full-stack bucket list application built using React and AWS Amplify. Users can authenticate via AWS Cognito, create, view, and delete bucket list items with optional images. The app integrates with AWS services like S3 for image storage, DynamoDB for data persistence, and GraphQL API for backend operations.

### Key Features:
User Authentication: Secure login system using AWS Amplify’s Authenticator and AWS Cognito.
CRUD Operations: Users can add, view, and delete their bucket list items.
Image Upload: Each item can optionally have an image that is stored in AWS S3 and displayed in the UI.
Responsive Design: The UI is built with Bootstrap for responsive, mobile-friendly design.
Live Data Fetching: Items are fetched and displayed dynamically using the Amplify DataStore.
Loading State Management: A loading spinner is displayed while data is being fetched, providing better UX.

### Tech Stack:
Frontend: React, AWS Amplify UI components, Bootstrap for styling.
Backend: AWS AppSync (GraphQL API), DynamoDB for storing items, S3 for image storage.
Authentication: AWS Cognito for user authentication and authorization.

### How It Works:
Login: Users must sign in to interact with their bucket list.
Create Item: Users can add a new bucket list item by filling out the form, optionally uploading an image.
View Items: The bucket list items are displayed in a grid format, with titles, descriptions, and images.
Delete Item: Users can delete any item, and the UI is updated automatically.
Sign Out: Users can securely sign out of their account.

### Setup Instructions:
Clone the repository.
Run npm install to install dependencies.
Ensure that AWS Amplify is correctly configured using your own Amplify outputs.json.
Start the app with npm run dev.

### Known Issues:
Ensure that Bootstrap is installed via npm install bootstrap for styling.
Make sure to properly configure Amplify with the necessary AWS services for S3, DynamoDB, and Cognito.

### Future Improvements:
Add item editing functionality.
Enable item filtering or searching.
Improve error handling and feedback for file uploads.
