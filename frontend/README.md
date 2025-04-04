# Email Automation Flowchart

## 🚀 Project Overview
This project provides a visual representation of an email automation flow using a **React-based flowchart builder**. Users can create, edit, and manage email sequences with an interactive drag-and-drop interface.

## 📌 Features
- **Drag-and-drop email nodes** for automation
- **Connect nodes** to define email sequences
- **Clear the canvas** with a confirmation prompt
- **Save and load workflows** dynamically
- **Customizable email triggers and actions**

## 🛠️ Tech Stack
- **Frontend:** React.js, React Flow
- **Styling:** CSS / TailwindCSS
- **State Management:** useState, Context API

## 📂 Project Structure
```
📦 EmailAutomationFlowchart
├── 📂 src
│   ├── 📂 components
│   │   ├── EmailAutomationFlow.js  # Main flowchart component
│   ├── App.js                      # Main app entry point
│   ├── index.js                    # React DOM rendering
│   └── styles.css                   # Global styles
├── 📄 package.json                  # Dependencies and scripts
├── 📄 README.md                      # Project documentation
└── 📄 .gitignore                     # Ignored files
```

## 🚀 Getting Started
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/EmailAutomationFlowchart.git
cd EmailAutomationFlowchart
```

### 2️⃣ Install Dependencies
```sh
yarn install  # or npm install
```

### 3️⃣ Start Development Server
```sh
yarn start  # or npm start
```
Runs the app in development mode. Open `http://localhost:3000` in your browser.

## 🔧 Troubleshooting
### 1️⃣ Module Not Found Error
If you see:
```sh
Module not found: Error: Can't resolve './EmailAutomationFlow'
```
Try renaming the file to match case sensitivity, e.g., `EmailAutomationFlow.js`.

### 2️⃣ ESLint Warning: `no-restricted-globals`
If ESLint warns about `confirm()`, update `clearCanvas`:
```js
const clearCanvas = () => {
  // eslint-disable-next-line no-restricted-globals
  const userConfirmed = window.confirm("Are you sure you want to clear the canvas?");
  if (userConfirmed) {
    setNodes([]);
    setEdges([]);
  }
};
```

### 3️⃣ Unused Variables Warning
Run ESLint fix:
```sh
yarn eslint --fix
```


## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Added new feature'`)
4. Push to GitHub (`git push origin feature-name`)
5. Create a Pull Request

## 📧 Contact
For issues or improvements, open an issue on GitHub or reach out at [harsh160502@gmail.com]

---
🚀 Happy Coding!

