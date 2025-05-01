# Ballotix - Blockchain Voting System

A secure, decentralized e-voting platform built with Ethereum smart contracts, IPFS for distributed storage, and a MERN-based web interface.

## Features

- **Decentralized Voting**: Leverages blockchain technology for transparent and tamper-proof voting
- **Smart Contract Integration**: Ethereum-based smart contracts for vote management
- **IPFS Storage**: Distributed storage for election data and documents
- **User Authentication**: Secure user registration and login system
- **Role-Based Access**: Different roles for voters, candidates, and administrators
- **Real-time Results**: Live election results and analytics
- **Secure Transactions**: Encrypted communication and data storage

## Tech Stack

### Backend

- **Node.js & Express.js**: Server framework
- **MongoDB**: Database for user and election data
- **JWT**: Authentication and authorization
- **Mongoose**: MongoDB ODM
- **Cloudinary**: Media storage
- **SendGrid**: Email notifications

### Frontend

- React.js
- Web3.js
- Material-UI
- Redux for state management

### Blockchain

- Ethereum Smart Contracts
- IPFS for distributed storage
- Web3 integration

## Project Structure

```
ballotix-blockchain-voting/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── data/          # Seed data and utilities
│   ├── middlewares/   # Custom middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── utils/         # Helper functions
│   ├── app.js         # Express application setup
│   └── server.js      # Server entry point
├── frontend/          # Frontend application
├── docs/             # Project documentation
└── public/           # Static files
```

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DLSNemsara/ballotix-blockchain-voting.git
   cd ballotix-blockchain-voting
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SENDGRID_API_KEY=your_sendgrid_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
