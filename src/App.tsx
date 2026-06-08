import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <BrowserRouter>
        <ErrorBoundary>

          <AppRoutes />
        </ErrorBoundary>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ fontFamily: '"IranSans", sans-serif' }} // Modified this line
          toastClassName="font-sans"
          className="font-sans"
        />
      </BrowserRouter>
    </>
  );
}

export default App;
