# Ballotix – Blockchain-Based Voting System for Organizations

Ballotix is a decentralized, secure, and transparent e-voting platform designed to modernize organizational elections. Built using Ethereum smart contracts (Sepolia testnet), the system ensures cryptographic vote integrity, real-time results, and role-based participation via a web-based interface.

**Tech Stack**: Solidity · React · Node.js · MongoDB · Web3.js · MetaMask · Docker · CI/CD

## Features

- **Blockchain-Based Voting**: Smart contracts manage elections, enforce one-vote-per-user, and compute results on Ethereum (Sepolia testnet)
- **Role-Based Access**: Distinct flows for Admins (create/start/end elections, manage users/candidates) and Voters (OTP login, cast vote)
- **Wallet Integration**: MetaMask wallet authentication ensures secure vote submission and blockchain interaction
- **OTP Email Verification**: SendGrid integration for verifying voter identity via email OTP
- **Real-Time Results**: Frontend listens to blockchain events for live result updates
- **Secure Media Handling**: Candidate images stored in Cloudinary
- **Auditability**: Vote transactions are immutable and publicly verifiable on the Ethereum blockchain
- **Responsive UI**: Built with Tailwind CSS, Chakra UI, Framer Motion, and ShadCN UI for a clean, accessible interface

## Tech Stack

| Layer              | Technologies                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| **Frontend**       | React.js, Tailwind CSS, Web3.js, Chakra UI, Framer Motion, ShadCN UI     |
| **Backend**        | Node.js, Express.js, MongoDB, JWT, Cloudinary, SendGrid                  |
| **Blockchain**     | Solidity, Ethereum (Sepolia Testnet), Web3.js, MetaMask                  |
| **DevOps/Testing** | Docker, GitHub Actions, Postman, Jest, Mocha/Chai, React Testing Library |

## Project Structure

```
ballotix-blockchain-voting/
├── backend/                # Express backend (auth, election logic, API)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   ├── data/
│   ├── app.js
│   └── server.js
├── frontend/               # React frontend (wallet, voting UI)
│   ├── src/pages/
│   ├── src/components/
│   ├── src/ethereum/       # Smart contract wrappers, Web3 integration
│   └── src/store/
├── ethereum/
│   └── contracts/          # Solidity contracts (ElectionFactory, Election)
├── docs/                   # Documentation, reports
└── README.md
```

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DLSNemsara/ballotix-blockchain-voting.git
cd ballotix-blockchain-voting
```

### 2. Smart Contracts

```bash
cd ethereum/contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Backend Setup

```bash
cd ../../backend
npm install
touch .env
```

Add your credentials to `.env`:

```
PORT=5000
MONGODB_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
SENDGRID_API_KEY=<your_sendgrid_api_key>
```

Run the server:

```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Make sure MetaMask is installed in your browser and connected to the Sepolia testnet.

## Testing

### Smart Contracts

```bash
npx hardhat test
```

### API Testing

- Use [Postman](https://postman.com) to test `/generateOtp`, `/login`, `/vote`, `/register`, `/allUsers`, `/delete/:id`, `/startElection`, `/endElection` routes.

### Frontend Unit Tests

```bash
npm run test
```

Tests include:

- Login component (OTP flow, button disabling, validation)
- Candidate display and result rendering
- Voting interaction and MetaMask signing

## Documentation

- [User Guide](docs/ballotix_user_guide.pdf)
- [Smart Contract Workflow](docs/Smart%20Contract%20Workflow.png)
- [System Architecture](docs/System%20Architecture.png)
- [Final Report](docs/final_project_report_ballotix.pdf)

## Deployment

- **Frontend**: Netlify (Free Tier)
- **Backend**: Render (Free Tier)
- **Blockchain**: Sepolia Testnet
- **Future Plans**:
  - Migrate to IPFS & AWS
  - Integrate ZKPs for full voter anonymity
  - Add multi-language support & mobile app

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a pull request

## License

MIT © 2025 Sinel Nemsara

## Contact

**Project Author**: Sinel Nemsara  
**Supervisor**: Mr. Gayan Perera  
**Degree**: BSc (Hons) Computer Science – Plymouth University  
**Email**: [dlsnemsara@students.nsbm.ac.lk](mailto:dlsnemsara@students.nsbm.ac.lk)
