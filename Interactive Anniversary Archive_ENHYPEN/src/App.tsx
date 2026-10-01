import { useState } from 'react';
import type { Screen, Message, PhotoResult } from './types';
import BootScreen from './screens/BootScreen';
import DashboardScreen from './screens/DashboardScreen';
import PhotoboothScreen from './screens/PhotoboothScreen';
import PhotoResultScreen from './screens/PhotoResultScreen';
import VaultScreen from './screens/VaultScreen';
import SafeZoneScreen from './screens/SafeZoneScreen';
import SystemScreen from './screens/SystemScreen';
import PageShell from './components/PageShell';

export default function App() {
  const [screen, setScreen] = useState<Screen>('boot');
  const [photoResult, setPhotoResult] = useState<PhotoResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const navigate = (s: Screen) => setScreen(s);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [msg, ...prev]);
  };

  const handlePhotoComplete = (photo1: string, photo2: string) => {
    setPhotoResult({ photo1, photo2 });
    setScreen('result');
  };

  if (screen === 'boot') {
    return <BootScreen onComplete={() => setScreen('dashboard')} />;
  }

  return (
    <PageShell current={screen} navigate={navigate}>
      {screen === 'dashboard' && <DashboardScreen navigate={navigate} />}
      {screen === 'photobooth' && (
        <PhotoboothScreen navigate={navigate} onComplete={handlePhotoComplete} />
      )}
      {screen === 'result' && photoResult && (
        <PhotoResultScreen
          photo1={photoResult.photo1}
          photo2={photoResult.photo2}
          navigate={navigate}
        />
      )}
      {screen === 'vault' && (
        <VaultScreen navigate={navigate} onSubmit={addMessage} />
      )}
      {screen === 'safezone' && (
        <SafeZoneScreen navigate={navigate} messages={messages} />
      )}
      {screen === 'system' && <SystemScreen navigate={navigate} />}
    </PageShell>
  );
}
