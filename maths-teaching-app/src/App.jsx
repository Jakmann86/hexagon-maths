import { UIProvider } from './context/UIContext';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <UIProvider>
      <MainLayout />
    </UIProvider>
  );
}

export default App;